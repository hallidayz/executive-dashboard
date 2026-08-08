import {
  AppSettings,
  CalendarEvent,
  EmailMessage,
  NotionActionItem,
  KrispTranscription,
  AppShortcut,
  PriorityAlert,
  KnowledgeEntry,
  LeadershipPersonaRule,
} from '../types';

import {
  INITIAL_SETTINGS,
  MOCK_CALENDAR,
  MOCK_EMAILS,
  MOCK_NOTION_ACTIONS,
  MOCK_KRISP_TRANSCRIPTS,
  MOCK_APP_SHORTCUTS,
  MOCK_PRIORITY_ALERTS,
  MOCK_KNOWLEDGE_BASE,
  MOCK_PERSONA_RULES,
} from './mockData';
import { normalizeSidebarNavOrder, syncWidgetsToNavOrder } from './navOrder';
import { normalizeConnectorsCatalog } from './connectorApproaches';
import { INITIAL_CONNECTORS_CATALOG } from './connectorsCatalog';

const KEYS = {
  SETTINGS: 'exec_dash_settings',
  CALENDAR: 'exec_dash_calendar',
  EMAILS: 'exec_dash_emails',
  NOTION: 'exec_dash_notion',
  KRISP: 'exec_dash_krisp',
  APPS: 'exec_dash_apps',
  ALERTS: 'exec_dash_alerts',
  KB: 'exec_dash_knowledge_base',
  PERSONA: 'exec_dash_persona_rules',
  /** Side-store used by knowledgeBaseSync (skills dual-write). */
  CUSTOM_SKILLS: 'executive_dashboard_custom_skills_v1',
};

export const WORKSPACE_EXPORT_VERSION = 1;

export interface WorkspaceExportPayload {
  version: number;
  exportedAt: string;
  platformHint?: string;
  data: Record<string, unknown>;
}

export const storageService = {
  getSettings(): AppSettings {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) return { ...INITIAL_SETTINGS };
    try {
      const parsed = JSON.parse(data) as Partial<AppSettings>;
      // Migrate older localStorage blobs missing newer fields.
      // Legacy indigo default → Halliday Corporate (see halliday-brand-guide/).
      const legacyIndigo =
        (!parsed.brandPreset || parsed.brandPreset === 'indigo') &&
        (!parsed.accentColor || String(parsed.accentColor).toUpperCase() === '#6366F1');

      const brandDefaults = legacyIndigo
        ? {
            brandPreset: INITIAL_SETTINGS.brandPreset,
            accentColor: INITIAL_SETTINGS.accentColor,
            accentSecondary: INITIAL_SETTINGS.accentSecondary,
            primaryContrastColor: INITIAL_SETTINGS.primaryContrastColor,
            primaryFontColor: INITIAL_SETTINGS.primaryFontColor,
            primaryFontLinked: true,
            secondaryContrastColor: INITIAL_SETTINGS.secondaryContrastColor,
            secondaryFontColor: INITIAL_SETTINGS.secondaryFontColor,
            secondaryFontLinked: true,
            brandGradientStops: INITIAL_SETTINGS.brandGradientStops,
            theme: parsed.theme ?? INITIAL_SETTINGS.theme,
          }
        : {};

      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        ...brandDefaults,
        theme: brandDefaults.theme ?? parsed.theme ?? INITIAL_SETTINGS.theme,
        sidebarCollapsed: parsed.sidebarCollapsed ?? INITIAL_SETTINGS.sidebarCollapsed,
        workspaceName: parsed.workspaceName ?? INITIAL_SETTINGS.workspaceName,
        chiefOfStaffName: parsed.chiefOfStaffName ?? INITIAL_SETTINGS.chiefOfStaffName,
        tagline: parsed.tagline ?? INITIAL_SETTINGS.tagline,
        logoDataUrl: parsed.logoDataUrl ?? '',
        markDataUrl: parsed.markDataUrl ?? '',
        personalTouch: parsed.personalTouch ?? '',
        brandPreset: brandDefaults.brandPreset ?? parsed.brandPreset ?? INITIAL_SETTINGS.brandPreset,
        accentColor: brandDefaults.accentColor ?? parsed.accentColor ?? INITIAL_SETTINGS.accentColor,
        accentSecondary:
          brandDefaults.accentSecondary ?? parsed.accentSecondary ?? INITIAL_SETTINGS.accentSecondary,
        primaryContrastColor:
          brandDefaults.primaryContrastColor ??
          parsed.primaryContrastColor ??
          INITIAL_SETTINGS.primaryContrastColor,
        // Migrate legacy brandFontColor → primaryFontColor
        primaryFontColor:
          brandDefaults.primaryFontColor ??
          parsed.primaryFontColor ??
          parsed.brandFontColor ??
          INITIAL_SETTINGS.primaryFontColor,
        primaryFontLinked:
          brandDefaults.primaryFontLinked ??
          parsed.primaryFontLinked ??
          INITIAL_SETTINGS.primaryFontLinked,
        secondaryContrastColor:
          brandDefaults.secondaryContrastColor ??
          parsed.secondaryContrastColor ??
          INITIAL_SETTINGS.secondaryContrastColor,
        secondaryFontColor:
          brandDefaults.secondaryFontColor ??
          parsed.secondaryFontColor ??
          INITIAL_SETTINGS.secondaryFontColor,
        secondaryFontLinked:
          brandDefaults.secondaryFontLinked ??
          parsed.secondaryFontLinked ??
          INITIAL_SETTINGS.secondaryFontLinked,
        brandGradientType: parsed.brandGradientType ?? INITIAL_SETTINGS.brandGradientType,
        brandGradientAngle: parsed.brandGradientAngle ?? INITIAL_SETTINGS.brandGradientAngle,
        brandGradientStops:
          brandDefaults.brandGradientStops ??
          (parsed.brandGradientStops?.length
            ? parsed.brandGradientStops
            : [
                {
                  id: 'stop-start',
                  color: parsed.accentColor ?? INITIAL_SETTINGS.accentColor,
                  position: 0,
                  alpha: 100,
                },
                {
                  id: 'stop-end',
                  color: parsed.accentSecondary ?? INITIAL_SETTINGS.accentSecondary,
                  position: 100,
                  alpha: 100,
                },
              ]),
        brandIntensity: parsed.brandIntensity ?? INITIAL_SETTINGS.brandIntensity,
        useBrandGradient: parsed.useBrandGradient ?? INITIAL_SETTINGS.useBrandGradient,
        fontPreset: parsed.fontPreset ?? INITIAL_SETTINGS.fontPreset,
        sidebarNavOrder: normalizeSidebarNavOrder(parsed.sidebarNavOrder),
        // Keep Command Center panel stack aligned with the single module order.
        widgets: syncWidgetsToNavOrder(
          parsed.widgets ?? INITIAL_SETTINGS.widgets,
          normalizeSidebarNavOrder(parsed.sidebarNavOrder)
        ),
        connectors: normalizeConnectorsCatalog(
          parsed.connectors,
          INITIAL_CONNECTORS_CATALOG,
          {
            notionApiKey: parsed.notionApiKey,
            notionDatabaseId: parsed.notionDatabaseId,
            notionConnected: parsed.notionConnected,
            krispAutoSync: parsed.krispAutoSync,
          }
        ),
      };
    } catch {
      return { ...INITIAL_SETTINGS };
    }
  },
  saveSettings(settings: AppSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getCalendar(): CalendarEvent[] {
    const data = localStorage.getItem(KEYS.CALENDAR);
    return data ? JSON.parse(data) : MOCK_CALENDAR;
  },
  saveCalendar(events: CalendarEvent[]): void {
    localStorage.setItem(KEYS.CALENDAR, JSON.stringify(events));
  },

  getEmails(): EmailMessage[] {
    const data = localStorage.getItem(KEYS.EMAILS);
    return data ? JSON.parse(data) : MOCK_EMAILS;
  },
  saveEmails(emails: EmailMessage[]): void {
    localStorage.setItem(KEYS.EMAILS, JSON.stringify(emails));
  },

  getNotionActions(): NotionActionItem[] {
    const data = localStorage.getItem(KEYS.NOTION);
    return data ? JSON.parse(data) : MOCK_NOTION_ACTIONS;
  },
  saveNotionActions(actions: NotionActionItem[]): void {
    localStorage.setItem(KEYS.NOTION, JSON.stringify(actions));
  },

  getKrispTranscripts(): KrispTranscription[] {
    const data = localStorage.getItem(KEYS.KRISP);
    return data ? JSON.parse(data) : MOCK_KRISP_TRANSCRIPTS;
  },
  saveKrispTranscripts(transcripts: KrispTranscription[]): void {
    localStorage.setItem(KEYS.KRISP, JSON.stringify(transcripts));
  },

  getAppShortcuts(): AppShortcut[] {
    const data = localStorage.getItem(KEYS.APPS);
    return data ? JSON.parse(data) : MOCK_APP_SHORTCUTS;
  },
  saveAppShortcuts(apps: AppShortcut[]): void {
    localStorage.setItem(KEYS.APPS, JSON.stringify(apps));
  },

  getPriorityAlerts(): PriorityAlert[] {
    const data = localStorage.getItem(KEYS.ALERTS);
    return data ? JSON.parse(data) : MOCK_PRIORITY_ALERTS;
  },
  savePriorityAlerts(alerts: PriorityAlert[]): void {
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(alerts));
  },

  getKnowledgeEntries(): KnowledgeEntry[] {
    const data = localStorage.getItem(KEYS.KB);
    return data ? JSON.parse(data) : MOCK_KNOWLEDGE_BASE;
  },
  saveKnowledgeEntries(entries: KnowledgeEntry[]): void {
    localStorage.setItem(KEYS.KB, JSON.stringify(entries));
  },

  getPersonaRules(): LeadershipPersonaRule[] {
    const data = localStorage.getItem(KEYS.PERSONA);
    return data ? JSON.parse(data) : MOCK_PERSONA_RULES;
  },
  savePersonaRules(rules: LeadershipPersonaRule[]): void {
    localStorage.setItem(KEYS.PERSONA, JSON.stringify(rules));
  },

  resetAllToMock(): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(KEYS.CALENDAR, JSON.stringify(MOCK_CALENDAR));
    localStorage.setItem(KEYS.EMAILS, JSON.stringify(MOCK_EMAILS));
    localStorage.setItem(KEYS.NOTION, JSON.stringify(MOCK_NOTION_ACTIONS));
    localStorage.setItem(KEYS.KRISP, JSON.stringify(MOCK_KRISP_TRANSCRIPTS));
    localStorage.setItem(KEYS.APPS, JSON.stringify(MOCK_APP_SHORTCUTS));
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(MOCK_PRIORITY_ALERTS));
    localStorage.setItem(KEYS.KB, JSON.stringify(MOCK_KNOWLEDGE_BASE));
    localStorage.setItem(KEYS.PERSONA, JSON.stringify(MOCK_PERSONA_RULES));
    localStorage.setItem(
      KEYS.CUSTOM_SKILLS,
      JSON.stringify(INITIAL_SETTINGS.customSkills || [])
    );
  },

  /** Snapshot all dashboard localStorage keys for moving between machines/browsers. */
  exportWorkspace(): WorkspaceExportPayload {
    const data: Record<string, unknown> = {};
    for (const key of Object.values(KEYS)) {
      const raw = localStorage.getItem(key);
      if (raw != null) {
        try {
          data[key] = JSON.parse(raw);
        } catch {
          data[key] = raw;
        }
      }
    }
    return {
      version: WORKSPACE_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      platformHint: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      data,
    };
  },

  /**
   * Restore a previously exported workspace payload.
   * Returns false if the file shape is invalid.
   */
  importWorkspace(payload: unknown): boolean {
    if (!payload || typeof payload !== 'object') return false;
    const body = payload as Partial<WorkspaceExportPayload>;
    if (!body.data || typeof body.data !== 'object') return false;

    const allowed = new Set(Object.values(KEYS));
    for (const [key, value] of Object.entries(body.data)) {
      if (!allowed.has(key)) continue;
      localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  },
};
