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
};

export const storageService = {
  getSettings(): AppSettings {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
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
  }
};
