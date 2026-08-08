/**
 * Secret handling for settings / connectors / AI providers.
 *
 * - Electron: OS keychain encryption via safeStorage (ciphertext in localStorage).
 * - Browser: session-only vault (cleared when the tab/window closes) — never
 *   leave plaintext API keys in persistent localStorage.
 */

import type { AppSettings, ConnectorItem, AIProviderConfig } from '../types';

export const SECRETS_STORAGE_KEY = 'exec_dash_secrets_v1';
/** Ciphertext envelope written when Electron safeStorage is available. */
export const SECRETS_ENC_STORAGE_KEY = 'exec_dash_secrets_enc_v1';
export const REDACTED_PLACEHOLDER = '[REDACTED]';

export type SecretsBackend = 'electron-safeStorage' | 'session' | 'memory' | 'none';

declare global {
  interface Window {
    desktopSecrets?: {
      isAvailable: () => Promise<boolean>;
      encrypt: (plainText: string) => Promise<string>;
      decrypt: (payload: string) => Promise<string>;
      platform?: string;
    };
  }
}

const SECRET_CONFIG_KEYS = new Set([
  'apiKey',
  'api_key',
  'token',
  'accessToken',
  'secret',
  'clientSecret',
  'password',
  'webhookSecret',
  'privateKey',
  'authorization',
]);

export interface SecretsVault {
  notionApiKey?: string;
  customLlmApiKey?: string;
  aiProviderKeys?: Record<string, string>;
  connectorSecrets?: Record<string, Record<string, string>>;
}

let vaultCache: SecretsVault = {};
let backend: SecretsBackend = 'none';
let hydrated = false;

export function isSecretConfigKey(key: string): boolean {
  const k = key.toLowerCase();
  if (SECRET_CONFIG_KEYS.has(key)) return true;
  return (
    k.includes('secret') ||
    k.includes('password') ||
    k.includes('apikey') ||
    k.endsWith('token') ||
    k.includes('private')
  );
}

export function getSecretsBackend(): SecretsBackend {
  return backend;
}

export function secretsBackendLabel(): string {
  switch (backend) {
    case 'electron-safeStorage':
      return 'OS keychain (Electron safeStorage)';
    case 'session':
      return 'Browser session only (cleared when you close the tab)';
    case 'memory':
      return 'In-memory only for this page load';
    default:
      return 'Not initialized';
  }
}

function parseVault(raw: string | null): SecretsVault {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as SecretsVault;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function desktopAvailable(): Promise<boolean> {
  try {
    if (!window.desktopSecrets?.isAvailable) return false;
    return Boolean(await window.desktopSecrets.isAvailable());
  } catch {
    return false;
  }
}

async function persistVault(vault: SecretsVault): Promise<void> {
  const json = JSON.stringify(vault);
  const empty = Object.keys(vault).length === 0;

  if (backend === 'electron-safeStorage' && window.desktopSecrets) {
    if (empty) {
      localStorage.removeItem(SECRETS_ENC_STORAGE_KEY);
    } else {
      const enc = await window.desktopSecrets.encrypt(json);
      localStorage.setItem(SECRETS_ENC_STORAGE_KEY, enc);
    }
    localStorage.removeItem(SECRETS_STORAGE_KEY);
    sessionStorage.removeItem(SECRETS_STORAGE_KEY);
    return;
  }

  // Browser path: session-only — never persist plaintext secrets to localStorage.
  if (empty) {
    sessionStorage.removeItem(SECRETS_STORAGE_KEY);
  } else {
    sessionStorage.setItem(SECRETS_STORAGE_KEY, json);
  }
  localStorage.removeItem(SECRETS_STORAGE_KEY);
  localStorage.removeItem(SECRETS_ENC_STORAGE_KEY);
}

/**
 * Must run once before getSettings() on boot.
 * Migrates legacy plaintext localStorage vault into Electron ciphertext or session.
 */
export async function hydrateSecretsVault(): Promise<void> {
  if (hydrated) return;

  const useDesktop = await desktopAvailable();
  backend = useDesktop ? 'electron-safeStorage' : 'session';

  let loaded: SecretsVault = {};

  if (useDesktop && window.desktopSecrets) {
    const enc = localStorage.getItem(SECRETS_ENC_STORAGE_KEY);
    if (enc) {
      try {
        const plain = await window.desktopSecrets.decrypt(enc);
        loaded = parseVault(plain);
      } catch (err) {
        console.warn('Could not decrypt secrets vault:', err);
        loaded = {};
      }
    }
  } else {
    loaded = parseVault(sessionStorage.getItem(SECRETS_STORAGE_KEY));
  }

  // One-time migration off legacy plaintext localStorage.
  const legacyPlain = parseVault(localStorage.getItem(SECRETS_STORAGE_KEY));
  if (Object.keys(legacyPlain).length > 0) {
    loaded = {
      ...legacyPlain,
      ...loaded,
      aiProviderKeys: {
        ...(legacyPlain.aiProviderKeys || {}),
        ...(loaded.aiProviderKeys || {}),
      },
      connectorSecrets: {
        ...(legacyPlain.connectorSecrets || {}),
        ...(loaded.connectorSecrets || {}),
      },
    };
    localStorage.removeItem(SECRETS_STORAGE_KEY);
  }

  vaultCache = loaded;
  hydrated = true;
  await persistVault(vaultCache);
}

export function loadSecretsVault(): SecretsVault {
  return { ...vaultCache };
}

export function saveSecretsVault(vault: SecretsVault): void {
  vaultCache = vault || {};
  if (!hydrated) {
    backend = backend === 'none' ? 'memory' : backend;
  }
  void persistVault(vaultCache).catch((err) => {
    console.warn('Failed to persist secrets vault:', err);
  });
}

export function clearSecretsVault(): void {
  vaultCache = {};
  localStorage.removeItem(SECRETS_STORAGE_KEY);
  localStorage.removeItem(SECRETS_ENC_STORAGE_KEY);
  sessionStorage.removeItem(SECRETS_STORAGE_KEY);
  void persistVault({});
}

export function splitSettingsSecrets(settings: AppSettings): {
  publicSettings: AppSettings;
  vault: SecretsVault;
} {
  const vault: SecretsVault = {};
  const publicSettings: AppSettings = {
    ...settings,
    notionApiKey: '',
    customLlmApiKey: '',
    aiProviders: (settings.aiProviders || []).map((p) => {
      if (p.apiKey) {
        vault.aiProviderKeys = vault.aiProviderKeys || {};
        vault.aiProviderKeys[p.id] = p.apiKey;
      }
      const { apiKey: _drop, ...rest } = p;
      return { ...rest } as AIProviderConfig;
    }),
    connectors: (settings.connectors || []).map((c) => {
      const cfg = { ...(c.configValues || {}) };
      const secretBag: Record<string, string> = {};
      for (const [key, value] of Object.entries(cfg)) {
        if (value && isSecretConfigKey(key)) {
          secretBag[key] = value;
          delete cfg[key];
        }
      }
      if (Object.keys(secretBag).length) {
        vault.connectorSecrets = vault.connectorSecrets || {};
        vault.connectorSecrets[c.id] = secretBag;
      }
      return { ...c, configValues: cfg };
    }),
  };

  if (settings.notionApiKey) vault.notionApiKey = settings.notionApiKey;
  if (settings.customLlmApiKey) vault.customLlmApiKey = settings.customLlmApiKey;

  return { publicSettings, vault };
}

export function mergeSettingsSecrets(
  settings: AppSettings,
  vault: SecretsVault
): AppSettings {
  return {
    ...settings,
    notionApiKey: vault.notionApiKey || settings.notionApiKey || '',
    customLlmApiKey: vault.customLlmApiKey || settings.customLlmApiKey || '',
    aiProviders: (settings.aiProviders || []).map((p) => ({
      ...p,
      apiKey: vault.aiProviderKeys?.[p.id] ?? p.apiKey,
    })),
    connectors: (settings.connectors || []).map((c) => ({
      ...c,
      configValues: {
        ...(c.configValues || {}),
        ...(vault.connectorSecrets?.[c.id] || {}),
      },
    })),
  };
}

export function redactSecretsInExportData(
  data: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data };
  delete out[SECRETS_STORAGE_KEY];
  delete out[SECRETS_ENC_STORAGE_KEY];

  const settingsKey = 'exec_dash_settings';
  if (out[settingsKey] && typeof out[settingsKey] === 'object') {
    const s = out[settingsKey] as AppSettings;
    const { publicSettings } = splitSettingsSecrets({
      ...s,
      notionApiKey: s.notionApiKey || '',
      customLlmApiKey: s.customLlmApiKey || '',
      aiProviders: s.aiProviders || [],
      connectors: s.connectors || [],
    } as AppSettings);
    out[settingsKey] = {
      ...publicSettings,
      notionApiKey: '',
      customLlmApiKey: '',
      aiProviders: (publicSettings.aiProviders || []).map((p) => ({
        ...p,
        apiKey: p.apiKey ? REDACTED_PLACEHOLDER : undefined,
      })),
      connectors: (publicSettings.connectors || []).map((c) =>
        redactConnectorConfig(c)
      ),
    };
  }

  return out;
}

function redactConnectorConfig(c: ConnectorItem): ConnectorItem {
  const cfg = { ...(c.configValues || {}) };
  for (const key of Object.keys(cfg)) {
    if (isSecretConfigKey(key) && cfg[key]) {
      cfg[key] = REDACTED_PLACEHOLDER;
    }
  }
  return { ...c, configValues: cfg };
}

export function isSecretUnchanged(value: string | undefined): boolean {
  if (value == null || value === '') return true;
  if (value === REDACTED_PLACEHOLDER) return true;
  if (/^•+$/.test(value)) return true;
  return false;
}

/** Rewrite misleading IdP/password copy on connector help text. */
export function sanitizeConnectorInstructions(instructions: string[]): string[] {
  return instructions.map((line) =>
    line
      .replace(
        /Enter your work username and password in the secure popup\.?/gi,
        'Use Demo connect — no password is collected; live OAuth is not wired yet.'
      )
      .replace(/Sign In with Microsoft IDP/gi, 'Demo connect')
      .replace(/Sign In with Google IDP/gi, 'Demo connect')
      .replace(/Sign In with Salesforce IDP/gi, 'Demo connect')
      .replace(/Sign In with Atlassian IDP/gi, 'Demo connect')
      .replace(/Sign In with Slack IDP/gi, 'Demo connect')
      .replace(/Sign In with Claude Account/gi, 'Demo connect')
      .replace(/Sign In with OpenAI Account/gi, 'Demo connect')
      .replace(/Click "Demo connect"/gi, 'Click Demo connect')
      .replace(/we auto-fill all tokens for you!?/gi, 'this only enables a local demo surface')
      .replace(/Authenticate with your Microsoft credentials\.?/gi, 'Enable the local demo (no live Microsoft login yet).')
  );
}
