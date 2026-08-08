import type { ConnectorApproach, ConnectorItem } from '../types';

export interface ConnectorApproachMeta {
  id: ConnectorApproach;
  label: string;
  startsOnItsOwn: string;
  multiAppInOneMotion: string;
  setupBurden: string;
  summary: string;
}

/** Comparison matrix shown under Connectors help disclosure (not primary UI). */
export const CONNECTOR_APPROACHES: ConnectorApproachMeta[] = [
  {
    id: 'native_vendor',
    label: 'Native AI-vendor connectors',
    startsOnItsOwn: 'Chat session; schedules on some tiers',
    multiAppInOneMotion: 'Limited',
    setupBurden: 'Sign in, done',
    summary: 'Vendor OAuth into Claude / ChatGPT / Google / Microsoft workspaces.',
  },
  {
    id: 'mcp',
    label: 'MCP servers',
    startsOnItsOwn: 'No — chat session only',
    multiAppInOneMotion: 'One server per app',
    setupBurden: 'Low to high',
    summary: 'Model Context Protocol servers for tools your AI can call in-session.',
  },
  {
    id: 'ipaas',
    label: 'iPaaS with AI steps',
    startsOnItsOwn: 'Yes — schedules and event triggers',
    multiAppInOneMotion: 'Yes',
    setupBurden: 'Real build work',
    summary: 'Zapier, Make, n8n — event-driven multi-app automation with AI steps.',
  },
  {
    id: 'ai_assistant',
    label: 'AI-native assistants',
    startsOnItsOwn: 'Yes — schedules and triggers',
    multiAppInOneMotion: 'Yes',
    setupBurden: 'Low',
    summary: 'Hermes / agent runtimes that orchestrate tools on a schedule.',
  },
  {
    id: 'direct_api',
    label: 'Direct API / your own key',
    startsOnItsOwn: 'Yes, if you build it',
    multiAppInOneMotion: 'Yes, if you build it',
    setupBurden: 'You’re the engineer',
    summary: 'Bring your own endpoint + API key; you own the glue code.',
  },
];

export function approachLabel(id: ConnectorApproach | undefined): string {
  return CONNECTOR_APPROACHES.find((a) => a.id === id)?.label ?? 'Custom';
}

/** Short chip label for filters / cards. */
export function approachShortLabel(id: ConnectorApproach | undefined): string {
  switch (id) {
    case 'native_vendor':
      return 'Native';
    case 'mcp':
      return 'MCP';
    case 'ipaas':
      return 'iPaaS';
    case 'ai_assistant':
      return 'Assistant';
    case 'direct_api':
      return 'Direct API';
    default:
      return 'Custom';
  }
}

export function connectorSetupCta(connector: Pick<ConnectorItem, 'authType' | 'status'>): string {
  if (connector.status === 'Connected') return 'Reconfigure';
  switch (connector.authType) {
    case 'IDP_OAUTH':
      return 'Sign in & connect';
    case 'WEBHOOK':
      return 'Add webhook';
    case 'MCP':
      return 'Connect MCP';
    case 'API_KEY':
    default:
      return 'Connect';
  }
}

export function inferConnectorApproach(
  item: Pick<ConnectorItem, 'ecosystem' | 'authType' | 'id' | 'name'> & {
    approach?: ConnectorApproach;
  }
): ConnectorApproach {
  if (item.approach) return item.approach;
  if (item.ecosystem === 'MCP' || item.authType === 'MCP') return 'mcp';
  if (item.ecosystem === 'iPaaS' || item.ecosystem === 'n8n') return 'ipaas';
  if (item.ecosystem === 'AI Assistant') return 'ai_assistant';
  if (item.authType === 'API_KEY' || item.authType === 'WEBHOOK') return 'direct_api';
  return 'native_vendor';
}

/** Merge catalog defaults with saved connectors; migrate legacy Notion keys. */
export function normalizeConnectorsCatalog(
  saved: ConnectorItem[] | undefined,
  catalog: ConnectorItem[],
  legacy?: { notionApiKey?: string; notionDatabaseId?: string; notionConnected?: boolean; krispAutoSync?: boolean }
): ConnectorItem[] {
  const byId = new Map<string, ConnectorItem>();
  for (const c of catalog) {
    byId.set(c.id, { ...c, approach: c.approach ?? inferConnectorApproach(c) });
  }
  for (const c of saved || []) {
    const base = byId.get(c.id);
    byId.set(c.id, {
      ...(base || c),
      ...c,
      approach: c.approach ?? base?.approach ?? inferConnectorApproach(c),
      surfaceRole: c.surfaceRole ?? base?.surfaceRole,
      startsAutonomously: c.startsAutonomously ?? base?.startsAutonomously,
      multiAppInOneMotion: c.multiAppInOneMotion ?? base?.multiAppInOneMotion,
      setupBurden: c.setupBurden ?? base?.setupBurden,
      configValues: { ...(base?.configValues || {}), ...(c.configValues || {}) },
    });
  }

  const list = [...byId.values()];

  // Migrate Personalization Notion keys → connector config
  const notion = list.find((c) => c.id === 'conn-notion');
  if (notion && legacy) {
    const cfg = { ...(notion.configValues || {}) };
    if (legacy.notionApiKey && !cfg.apiKey) cfg.apiKey = legacy.notionApiKey;
    if (legacy.notionDatabaseId && !cfg.databaseId) cfg.databaseId = legacy.notionDatabaseId;
    if (legacy.notionConnected && notion.status !== 'Connected') {
      notion.status = 'Connected';
      notion.connectedUser = notion.connectedUser || 'Migrated from Personalization';
      notion.lastSynced = notion.lastSynced || 'Migrated';
    }
    notion.configValues = cfg;
  }

  const krisp = list.find((c) => c.id === 'conn-krisp');
  if (krisp && legacy?.krispAutoSync && krisp.status !== 'Connected') {
    krisp.status = 'Connected';
    krisp.configValues = { ...(krisp.configValues || {}), autoSync: 'true' };
    krisp.lastSynced = krisp.lastSynced || 'Migrated';
  }

  return list;
}

export function connectedWorkspaceTools(connectors: ConnectorItem[]): {
  actions?: ConnectorItem;
  transcripts?: ConnectorItem;
  connected: ConnectorItem[];
} {
  const connected = connectors.filter((c) => c.status === 'Connected');
  return {
    connected,
    actions: connected.find((c) => c.surfaceRole === 'actions'),
    transcripts: connected.find((c) => c.surfaceRole === 'transcripts'),
  };
}
