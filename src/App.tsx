import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from './components/Navigation';
import { AppHeader } from './components/AppHeader';
import { FloatingAIAdvisorPanel } from './components/FloatingAIAdvisorPanel';
import { WidgetWorkspace } from './components/WidgetWorkspace';
import { ProductExecutionHeatmap } from './components/ProductExecutionHeatmap';
import { ChiefOfStaffView } from './components/ChiefOfStaffView';
import { OutlookView } from './components/OutlookView';
import { WorkspaceToolsView } from './components/NotionKrispView';
import { AppLauncher } from './components/AppLauncher';
import { PriorityAlertsView } from './components/PriorityAlertsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AILeadershipCloneView } from './components/AILeadershipCloneView';
import { SettingsView } from './components/SettingsView';
import { CommandPalette } from './components/CommandPalette';

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
  SidebarNavId,
} from './types';
import { normalizeSidebarNavOrder, syncWidgetsToNavOrder } from './services/navOrder';

import { storageService } from './services/storageService';
import { generateChiefOfStaffSummary } from './services/chiefOfStaffEngine';
import { MOCK_PRODUCT_LINES } from './services/mockData';
import { applyThemePreference, subscribeSystemTheme } from './services/themeService';
import { applyBranding } from './services/brandingService';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('command-center');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [settingsSubTab, setSettingsSubTab] = useState<
    'general' | 'workspace' | 'skills' | 'connectors' | 'ai-models' | 'claude-md' | 'system' | undefined
  >(undefined);
  const [aiMinimized, setAiMinimized] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());
  const [viewMode, setViewMode] = useState<ViewMode>(settings.viewMode || 'list');
  const [calendar, setCalendar] = useState<CalendarEvent[]>(storageService.getCalendar());
  const [emails, setEmails] = useState<EmailMessage[]>(storageService.getEmails());
  const [notionActions, setNotionActions] = useState<NotionActionItem[]>(storageService.getNotionActions());
  const [krispTranscripts, setKrispTranscripts] = useState<KrispTranscription[]>(storageService.getKrispTranscripts());
  const [appShortcuts, setAppShortcuts] = useState<AppShortcut[]>(storageService.getAppShortcuts());
  const [priorityAlerts, setPriorityAlerts] = useState<PriorityAlert[]>(storageService.getPriorityAlerts());
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>(storageService.getKnowledgeEntries());
  const [personaRules, setPersonaRules] = useState<LeadershipPersonaRule[]>(storageService.getPersonaRules());
  const [products, setProducts] = useState<ProductLine[]>(MOCK_PRODUCT_LINES);
  /** Always-current settings for system-theme listener (avoids stale branding closure). */
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Apply theme + branding whenever personalization tokens change.
  useEffect(() => {
    applyThemePreference(settings.theme || 'system');
    applyBranding(settings);
  }, [
    settings.theme,
    settings.brandPreset,
    settings.accentColor,
    settings.accentSecondary,
    settings.primaryFontColor,
    settings.secondaryFontColor,
    settings.primaryContrastColor,
    settings.secondaryContrastColor,
    settings.brandGradientType,
    settings.brandGradientAngle,
    settings.brandGradientStops,
    settings.brandIntensity,
    settings.useBrandGradient,
    settings.fontPreset,
  ]);

  // Subscribe to OS theme only while preference is "system"; always unsubscribe on cleanup.
  useEffect(() => {
    if ((settings.theme || 'system') !== 'system') return;
    return subscribeSystemTheme(() => {
      applyThemePreference('system');
      applyBranding(settingsRef.current);
    });
  }, [settings.theme]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    applyThemePreference(newSettings.theme || 'system');
    applyBranding(newSettings);
  };

  const handleToggleSidebar = () => {
    const updated = { ...settings, sidebarCollapsed: !settings.sidebarCollapsed };
    handleSaveSettings(updated);
  };

  const handleToggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    const updatedSettings = { ...settings, viewMode: mode };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
  };

  const handleUpdateWidgets = (newWidgets: WidgetConfig[]) => {
    // Keep panel stack aligned with the single module order when visibility changes.
    const synced = syncWidgetsToNavOrder(newWidgets, settings.sidebarNavOrder);
    const updatedSettings = {
      ...settings,
      widgets: synced,
      activePreset: 'custom' as WorkspacePreset,
    };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
  };

  /** One reorder path: left rail + Command Center panels stay in sync. */
  const handleReorderModules = (order: SidebarNavId[]) => {
    const navOrder = normalizeSidebarNavOrder(order);
    const syncedWidgets = syncWidgetsToNavOrder(settings.widgets, navOrder);
    const updatedSettings = {
      ...settings,
      sidebarNavOrder: navOrder,
      widgets: syncedWidgets,
      // Diverging from a named workspace layout → mark preset custom.
      activePreset: 'custom' as WorkspacePreset,
    };
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

    // Presets change visibility only; keep the shared module order.
    newWidgets = syncWidgetsToNavOrder(newWidgets, settings.sidebarNavOrder);
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

  const reloadWorkspaceFromStorage = () => {
    const nextSettings = storageService.getSettings();
    setSettings(nextSettings);
    setViewMode(nextSettings.viewMode || 'list');
    applyThemePreference(nextSettings.theme || 'system');
    applyBranding(nextSettings);
    setCalendar(storageService.getCalendar());
    setEmails(storageService.getEmails());
    setNotionActions(storageService.getNotionActions());
    setKrispTranscripts(storageService.getKrispTranscripts());
    setAppShortcuts(storageService.getAppShortcuts());
    setPriorityAlerts(storageService.getPriorityAlerts());
    setKnowledgeEntries(storageService.getKnowledgeEntries());
    setPersonaRules(storageService.getPersonaRules());
  };

  const handleResetMockData = () => {
    storageService.resetAllToMock();
    reloadWorkspaceFromStorage();
  };

  const chiefOfStaffSummary = generateChiefOfStaffSummary(calendar, emails, notionActions, krispTranscripts);
  const unreadAlertsCount = priorityAlerts.filter((a) => !a.handled).length;

  return (
    <div className="min-h-screen flex font-sans relative" style={{ background: 'var(--app-bg)', color: 'var(--app-fg)' }}>
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        collapsed={Boolean(settings.sidebarCollapsed)}
        onToggleCollapsed={handleToggleSidebar}
        unreadAlertsCount={unreadAlertsCount}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <AppHeader
          settings={settings}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          aiMinimized={aiMinimized}
          onExpandAi={() => setAiMinimized(false)}
        />

        <FloatingAIAdvisorPanel
          summary={chiefOfStaffSummary}
          onNavigateTab={setActiveTab}
          sidebarWidth={settings.sidebarCollapsed ? 72 : 260}
          chiefOfStaffName={settings.chiefOfStaffName || 'Atlas'}
          markDataUrl={settings.markDataUrl}
          isMinimized={aiMinimized}
          onMinimizedChange={setAiMinimized}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          {activeTab === 'command-center' && (
            <WidgetWorkspace
              widgets={settings.widgets}
              activePreset={settings.activePreset}
              viewMode={viewMode}
              onToggleViewMode={handleToggleViewMode}
              onSelectPreset={handleSelectPreset}
              onOpenLayoutSettings={() => {
                setSettingsSubTab('workspace');
                setActiveTab('settings');
              }}
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
              connectors={settings.connectors || []}
              userName={settings.userName}
              workspaceName={settings.workspaceName || 'Command Center'}
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
              onOpenConnectorsSettings={() => {
                setSettingsSubTab('connectors');
                setActiveTab('settings');
              }}
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
            <WorkspaceToolsView
              connectors={settings.connectors || []}
              notionActions={notionActions}
              krispTranscripts={krispTranscripts}
              onAddNotionAction={handleAddNotionAction}
              onAddKrispTranscript={handleAddKrispTranscript}
              onToggleNotionStatus={handleToggleNotionStatus}
              onOpenConnectorsSettings={() => {
                setSettingsSubTab('connectors');
                setActiveTab('settings');
              }}
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
              onReloadWorkspace={reloadWorkspaceFromStorage}
              onUpdateWidgets={handleUpdateWidgets}
              onReorderModules={handleReorderModules}
              onSelectPreset={handleSelectPreset}
              initialSubTab={settingsSubTab}
            />
          )}
        </main>
      </div>

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
    </div>
  );
}

export default App;
