/**
 * Runtime environment for personal multi-device use
 * (Mac / Windows Electron + iPhone / Android browsers).
 */

export type DesktopOs = 'windows' | 'mac' | 'linux';
export type ClientKind = 'electron' | 'browser';
export type DeviceClass = 'desktop' | 'mobile' | 'tablet';

export interface ClientEnvironment {
  desktopOs: DesktopOs;
  /** iOS / Android when on phone/tablet browsers */
  mobileOs: 'ios' | 'android' | null;
  clientKind: ClientKind;
  deviceClass: DeviceClass;
  /** Short label for Settings UI */
  label: string;
  /** How API keys are stored on this client */
  secretsHint: string;
  /** How to reach this client from another device */
  transferHint: string;
}

function ua(): string {
  return typeof navigator !== 'undefined' ? navigator.userAgent : '';
}

export function detectDesktopOs(): DesktopOs {
  const override = import.meta.env.VITE_PLATFORM as string | undefined;
  if (override === 'windows' || override === 'mac' || override === 'linux') {
    return override;
  }
  const s = ua();
  if (/Windows/i.test(s)) return 'windows';
  if (/Mac OS X|Macintosh/i.test(s) && !/iPhone|iPad|iPod/i.test(s)) return 'mac';
  if (/Linux/i.test(s) && !/Android/i.test(s)) return 'linux';
  return 'linux';
}

export function detectMobileOs(): 'ios' | 'android' | null {
  const s = ua();
  if (/iPhone|iPad|iPod/i.test(s)) return 'ios';
  // iPadOS 13+ may report as Macintosh with touch
  if (/Macintosh/i.test(s) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1) {
    return 'ios';
  }
  if (/Android/i.test(s)) return 'android';
  return null;
}

export function detectClientKind(): ClientKind {
  if (typeof window !== 'undefined' && window.desktopSecrets) return 'electron';
  return 'browser';
}

export function detectDeviceClass(): DeviceClass {
  const mobile = detectMobileOs();
  if (!mobile) return 'desktop';
  const s = ua();
  if (/iPad/i.test(s) || (mobile === 'android' && !/Mobile/i.test(s))) return 'tablet';
  return 'mobile';
}

export function detectClientEnvironment(): ClientEnvironment {
  const desktopOs = detectDesktopOs();
  const mobileOs = detectMobileOs();
  const clientKind = detectClientKind();
  const deviceClass = detectDeviceClass();

  let label: string;
  if (mobileOs === 'ios') label = deviceClass === 'tablet' ? 'iPad (browser)' : 'iPhone (browser)';
  else if (mobileOs === 'android')
    label = deviceClass === 'tablet' ? 'Android tablet (browser)' : 'Android phone (browser)';
  else if (clientKind === 'electron') label = `${desktopOs} · Electron`;
  else label = `${desktopOs} · browser`;

  const secretsHint =
    clientKind === 'electron'
      ? 'API keys encrypted with OS safeStorage (Keychain / Credential Manager). Ciphertext is machine-bound — use Export with secrets to move keys.'
      : mobileOs
        ? 'API keys stay in this browser session only (cleared when you close Safari/Chrome). Re-import a secrets export or paste keys again after restart.'
        : 'API keys stay in this browser session only. Prefer Electron on Mac/Windows for persistent encrypted keys.';

  const transferHint =
    mobileOs
      ? 'On a Mac or Windows machine: Export Workspace (include secrets if needed) → AirDrop / Files / Drive → Import here.'
      : 'Mac ↔ Windows: Export / Import JSON. Phones: run npm run dev:lan on a desktop, open the LAN URL, then Import the same file.';

  return {
    desktopOs,
    mobileOs,
    clientKind,
    deviceClass,
    label,
    secretsHint,
    transferHint,
  };
}
