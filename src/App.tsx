import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { FloatingAIAdvisorPanel } from './components/FloatingAIAdvisorPanel';
import { WidgetWorkspace } from './components/WidgetWorkspace';
import { ProductExecutionHeatmap } from './components/ProductExecutionHeatmap';
import { ChiefOfStaffView } from './components/ChiefOfStaffView';
import { OutlookView } from './components/OutlookView';
import { NotionKrispView } from './components/NotionKrispView';
import { AppLauncher } from './components/AppLauncher';
import { PriorityAlertsView } from './components/PriorityAlertsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AILeadershipCloneView } from './components/AILeadershipCloneView';
import { SettingsModal } from './components/SettingsModal';
import { SettingsView } from './components/SettingsView';
import { CommandPalette } from './components/CommandPalette';
import { WidgetCustomizer } from './components/WidgetCustomizer';

import {
  TabType,
  AppSettings,
  CalendarEvent,
  EmailMessage,
  NotionActionItem,
  KrispTranscription,
  AppShortcut,
  PriorityAlert,
  KnowledgeEntry,
  LeadershipPersonaRule,
  ProductLine,
  WorkspacePreset,
  WidgetConfig,
  ViewMode,
} from './types';

import { storageService } from './services/storageService';
import { generateChiefOfStaffSummary } from './services/chiefOfStaffEngine';
import { MOCK_PRODUCT_LINES } from './services/mockData';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('command-center');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isWidgetCustomizerOpen, setIsWidgetCustomizerOpen] = useState(false);

  // Application Data States
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());
  const [viewMode, setViewMode] = useState<ViewMode>(settings.viewMode || 'grid');
  const [calendar, setCalendar] = useState<CalendarEvent[]>(storageService.getCalendar());
  const [emails, setEmails] = useState<EmailMessage[]>(storageService.getEmails());
  const [notionActions, setNotionActions] = useState<NotionActionItem[]>(storageService.getNotionActions());
  const [krispTranscripts, setKrispTranscripts] = useState<KrispTranscription[]>(storageService.getKrispTranscripts());
  const [appShortcuts, setAppShortcuts] = useState<AppShortcut[]>(storageService.getAppShortcuts());
  const [priorityAlerts, setPriorityAlerts] = useState<PriorityAlert[]>(storageService.getPriorityAlerts());
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>(storageService.getKnowledgeEntries());
  const [personaRules, setPersonaRules] = useState<LeadershipPersonaRule[]>(storageService.getPersonaRules());
  const [products, setProducts] = useState<ProductLine[]>(MOCK_PRODUCT_LINES);

  // Handlers
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleToggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    const updatedSettings = { ...settings, viewMode: mode };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
  };

  const handleUpdateWidgets = (newWidgets: WidgetConfig[]) => {
    const updatedSettings = { ...settings, widgets: newWidgets };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
  };

  const handleSelectPreset = (preset: WorkspacePreset) => {
    let newWidgets = [...settings.widgets];
    if (preset === 'execution') {
      newWidgets = newWidgets.map((w) => ({
        ...w,
        enabled: w.id === 'w-heatmap' || w.id === 'w-notion' || w.id === 'w-triage' || w.id === 'w-apps',
      }));
    } else if (preset === 'meeting') {
      newWidgets = newWidgets.map((w) => ({
        ...w,
        enabled: w.id === 'w-outlook' || w.id === 'w-krisp' || w.id === 'w-apps',
      }));
    } else if (preset === 'strategy') {
      newWidgets = newWidgets.map((w) => ({
        ...w,
        enabled: w.id === 'w-chief' || w.id === 'w-clone' || w.id === 'w-heatmap',
      }));
    } else {
      newWidgets = newWidgets.map((w) => ({ ...w, enabled: true }));
    }

    const updatedSettings = { ...settings, activePreset: preset, widgets: newWidgets };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
  };

  const handleToggleEmailFlag = (id: string) => {
    const updated = emails.map((e) => (e.id === id ? { ...e, flagged: !e.flagged } : e));
    setEmails(updated);
    storageService.saveEmails(updated);
  };

  const handleMarkEmailRead = (id: string) => {
    const updated = emails.map((e) => (e.id === id ? { ...e, isRead: true } : e));
    setEmails(updated);
    storageService.saveEmails(updated);
  };

  const handleAddNotionAction = (action: NotionActionItem) => {
    const updated = [action, ...notionActions];
    setNotionActions(updated);
    storageService.saveNotionActions(updated);
  };

  const handleToggleNotionStatus = (id: string) => {
    const updated: NotionActionItem[] = notionActions.map((n) =>
      n.id === id ? { ...n, status: (n.status === 'Done' ? 'To Do' : 'Done') as 'To Do' | 'Done' } : n
    );
    setNotionActions(updated);
    storageService.saveNotionActions(updated);
  };

  const handleAddKrispTranscript = (transcript: KrispTranscription) => {
    const updated = [transcript, ...krispTranscripts];
    setKrispTranscripts(updated);
    storageService.saveKrispTranscripts(updated);
  };

  const handleAddAppShortcut = (shortcut: AppShortcut) => {
    const updated = [shortcut, ...appShortcuts];
    setAppShortcuts(updated);
    storageService.saveAppShortcuts(updated);
  };

  const handleLaunchShortcut = (id: string) => {
    const updated = appShortcuts.map((a) => (a.id === id ? { ...a, launchCount: a.launchCount + 1 } : a));
    setAppShortcuts(updated);
    storageService.saveAppShortcuts(updated);
  };

  const handleTogglePinApp = (id: string) => {
    const updated = appShortcuts.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a));
    setAppShortcuts(updated);
    storageService.saveAppShortcuts(updated);
  };

  const handleToggleAlertHandled = (id: string) => {
    const updated = priorityAlerts.map((a) => (a.id === id ? { ...a, handled: !a.handled } : a));
    setPriorityAlerts(updated);
    storageService.savePriorityAlerts(updated);
  };

  const handleAddKnowledgeEntry = (entry: KnowledgeEntry) => {
    const updated = [entry, ...knowledgeEntries];
    setKnowledgeEntries(updated);
    storageService.saveKnowledgeEntries(updated);
  };

  const handleResetMockData = () => {
    storageService.resetAllToMock();
    setSettings(storageService.getSettings());
    setCalendar(storageService.getCalendar());
    setEmails(storageService.getEmails());
    setNotionActions(storageService.getNotionActions());
    setKrispTranscripts(storageService.getKrispTranscripts());
    setAppShortcuts(storageService.getAppShortcuts());
    setPriorityAlerts(storageService.getPriorityAlerts());
    setKnowledgeEntries(storageService.getKnowledgeEntries());
    setPersonaRules(storageService.getPersonaRules());
  };

  const chiefOfStaffSummary = generateChiefOfStaffSummary(calendar, emails, notionActions, krispTranscripts);
  const unreadAlertsCount = priorityAlerts.filter((a) => !a.handled).length;

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans relative">
      {/* Header & Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Floating AI Advisor Panel (Scrolls with page, dockable Left or Right) */}
      <FloatingAIAdvisorPanel summary={chiefOfStaffSummary} onNavigateTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'command-center' && (
          <WidgetWorkspace
            widgets={settings.widgets}
            activePreset={settings.activePreset}
            viewMode={viewMode}
            onToggleViewMode={handleToggleViewMode}
            onSelectPreset={handleSelectPreset}
            onOpenCustomizer={() => setIsWidgetCustomizerOpen(true)}
            products={products}
            chiefSummary={chiefOfStaffSummary}
            calendar={calendar}
            emails={emails}
            notion={notionActions}
            krisp={krispTranscripts}
            apps={appShortcuts}
            alerts={priorityAlerts}
            kb={knowledgeEntries}
            personaRules={personaRules}
            userName={settings.userName}
            onNavigateTab={setActiveTab}
            onToggleEmailFlag={handleToggleEmailFlag}
            onMarkRead={handleMarkEmailRead}
            onAddNotionAction={handleAddNotionAction}
            onToggleNotionStatus={handleToggleNotionStatus}
            onAddKrispTranscript={handleAddKrispTranscript}
            onAddShortcut={handleAddAppShortcut}
            onLaunchShortcut={handleLaunchShortcut}
            onTogglePinApp={handleTogglePinApp}
            onToggleAlertHandled={handleToggleAlertHandled}
            onAddKnowledgeEntry={handleAddKnowledgeEntry}
          />
        )}

        {activeTab === 'product-portfolio' && (
          <ProductExecutionHeatmap products={products} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'chief-of-staff' && (
          <ChiefOfStaffView summary={chiefOfStaffSummary} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'outlook' && (
          <OutlookView
            calendar={calendar}
            emails={emails}
            onToggleEmailFlag={handleToggleEmailFlag}
            onMarkRead={handleMarkEmailRead}
          />
        )}

        {activeTab === 'notion-krisp' && (
          <NotionKrispView
            notionActions={notionActions}
            krispTranscripts={krispTranscripts}
            onAddNotionAction={handleAddNotionAction}
            onAddKrispTranscript={handleAddKrispTranscript}
            onToggleNotionStatus={handleToggleNotionStatus}
          />
        )}

        {activeTab === 'app-launcher' && (
          <AppLauncher
            shortcuts={appShortcuts}
            viewMode={viewMode}
            onToggleViewMode={handleToggleViewMode}
            onAddShortcut={handleAddAppShortcut}
            onLaunchShortcut={handleLaunchShortcut}
            onTogglePin={handleTogglePinApp}
          />
        )}

        {activeTab === 'priority-alerts' && (
          <PriorityAlertsView alerts={priorityAlerts} onToggleHandled={handleToggleAlertHandled} />
        )}

        {activeTab === 'knowledge-clone' && (
          <div className="space-y-6">
            <KnowledgeBaseView entries={knowledgeEntries} onAddEntry={handleAddKnowledgeEntry} />
            <AILeadershipCloneView
              entries={knowledgeEntries}
              personaRules={personaRules}
              userName={settings.userName}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onResetMockData={handleResetMockData}
          />
        )}
      </main>

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        calendar={calendar}
        emails={emails}
        notion={notionActions}
        krisp={krispTranscripts}
        apps={appShortcuts}
        kb={knowledgeEntries}
        onNavigateTab={setActiveTab}
      />

      {/* Widget Customizer Modal */}
      <WidgetCustomizer
        isOpen={isWidgetCustomizerOpen}
        onClose={() => setIsWidgetCustomizerOpen(false)}
        widgets={settings.widgets}
        activePreset={settings.activePreset}
        onUpdateWidgets={handleUpdateWidgets}
        onSelectPreset={handleSelectPreset}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetMockData={handleResetMockData}
      />
    </div>
  );
}

export default App;
