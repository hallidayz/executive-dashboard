import React from 'react';
import { Sliders, LayoutGrid } from 'lucide-react';
import { WidgetConfig, WorkspacePreset, ViewMode, ProductLine, ChiefOfStaffSummary, CalendarEvent, EmailMessage, NotionActionItem, KrispTranscription, AppShortcut, PriorityAlert, KnowledgeEntry, LeadershipPersonaRule } from '../types';

import { ProductExecutionHeatmap } from './ProductExecutionHeatmap';
import { ChiefOfStaffView } from './ChiefOfStaffView';
import { OutlookView } from './OutlookView';
import { NotionKrispView } from './NotionKrispView';
import { AppLauncher } from './AppLauncher';
import { PriorityAlertsView } from './PriorityAlertsView';
import { KnowledgeBaseView } from './KnowledgeBaseView';
import { AILeadershipCloneView } from './AILeadershipCloneView';

interface WidgetWorkspaceProps {
  widgets: WidgetConfig[];
  activePreset: WorkspacePreset;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onSelectPreset: (preset: WorkspacePreset) => void;
  onOpenCustomizer: () => void;
  products: ProductLine[];
  chiefSummary: ChiefOfStaffSummary;
  calendar: CalendarEvent[];
  emails: EmailMessage[];
  notion: NotionActionItem[];
  krisp: KrispTranscription[];
  apps: AppShortcut[];
  alerts: PriorityAlert[];
  kb: KnowledgeEntry[];
  personaRules: LeadershipPersonaRule[];
  userName: string;
  onNavigateTab: (tab: any) => void;
  onToggleEmailFlag: (id: string) => void;
  onMarkRead: (id: string) => void;
  onAddNotionAction: (action: NotionActionItem) => void;
  onToggleNotionStatus: (id: string) => void;
  onAddKrispTranscript: (transcript: KrispTranscription) => void;
  onAddShortcut: (shortcut: AppShortcut) => void;
  onLaunchShortcut: (id: string) => void;
  onTogglePinApp: (id: string) => void;
  onToggleAlertHandled: (id: string) => void;
  onAddKnowledgeEntry: (entry: KnowledgeEntry) => void;
}

export const WidgetWorkspace: React.FC<WidgetWorkspaceProps> = ({
  widgets,
  activePreset,
  viewMode,
  onToggleViewMode,
  onSelectPreset,
  onOpenCustomizer,
  products,
  chiefSummary,
  calendar,
  emails,
  notion,
  krisp,
  apps,
  alerts,
  kb,
  personaRules,
  userName,
  onNavigateTab,
  onToggleEmailFlag,
  onMarkRead,
  onAddNotionAction,
  onToggleNotionStatus,
  onAddKrispTranscript,
  onAddShortcut,
  onLaunchShortcut,
  onTogglePinApp,
  onToggleAlertHandled,
  onAddKnowledgeEntry,
}) => {
  const enabledWidgets = widgets.filter((w) => w.enabled);

  return (
    <div className="space-y-6">
      {/* Top Workspace Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-base">Head of Product Command Center</h2>
            <p className="text-xs text-slate-400">Pluggable executive dashboard layout • Configured for product execution leadership.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-slate-800">
            {(['execution', 'meeting', 'strategy', 'custom'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  activePreset === preset
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset === 'execution' ? '⚡ Execution' : preset === 'meeting' ? '📅 Sync' : preset === 'strategy' ? '🧠 Strategy' : '⚙️ Custom'}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenCustomizer}
            className="p-2 rounded-xl bg-obsidian-800 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all shrink-0"
            title="Customize Pluggable Widgets"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Render Enabled Pluggable Widgets */}
      <div className="space-y-6">
        {enabledWidgets.map((w) => {
          if (w.id === 'w-heatmap') {
            return <ProductExecutionHeatmap key={w.id} products={products} onNavigateTab={onNavigateTab} />;
          }
          if (w.id === 'w-chief') {
            return <ChiefOfStaffView key={w.id} summary={chiefSummary} onNavigateTab={onNavigateTab} />;
          }
          if (w.id === 'w-triage') {
            return <PriorityAlertsView key={w.id} alerts={alerts} onToggleHandled={onToggleAlertHandled} />;
          }
          if (w.id === 'w-outlook') {
            return (
              <OutlookView
                key={w.id}
                calendar={calendar}
                emails={emails}
                onToggleEmailFlag={onToggleEmailFlag}
                onMarkRead={onMarkRead}
              />
            );
          }
          if (w.id === 'w-notion' || w.id === 'w-krisp') {
            return (
              <NotionKrispView
                key={w.id}
                notionActions={notion}
                krispTranscripts={krisp}
                onAddNotionAction={onAddNotionAction}
                onAddKrispTranscript={onAddKrispTranscript}
                onToggleNotionStatus={onToggleNotionStatus}
              />
            );
          }
          if (w.id === 'w-apps') {
            return (
              <AppLauncher
                key={w.id}
                shortcuts={apps}
                viewMode={viewMode}
                onToggleViewMode={onToggleViewMode}
                onAddShortcut={onAddShortcut}
                onLaunchShortcut={onLaunchShortcut}
                onTogglePin={onTogglePinApp}
              />
            );
          }
          if (w.id === 'w-clone') {
            return (
              <div key={w.id} className="space-y-6">
                <KnowledgeBaseView entries={kb} onAddEntry={onAddKnowledgeEntry} />
                <AILeadershipCloneView entries={kb} personaRules={personaRules} userName={userName} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
