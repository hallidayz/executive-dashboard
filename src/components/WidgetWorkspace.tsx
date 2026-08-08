import React from "react";
import { Sliders, LayoutGrid } from "lucide-react";
import {
  WidgetConfig,
  WorkspacePreset,
  ViewMode,
  ProductLine,
  ChiefOfStaffSummary,
  CalendarEvent,
  EmailMessage,
  NotionActionItem,
  KrispTranscription,
  AppShortcut,
  PriorityAlert,
  KnowledgeEntry,
  LeadershipPersonaRule,
  ConnectorItem,
} from "../types";

import { ProductExecutionHeatmap } from "./ProductExecutionHeatmap";
import { ChiefOfStaffView } from "./ChiefOfStaffView";
import { OutlookView } from "./OutlookView";
import { WorkspaceToolsView } from "./NotionKrispView";
import { AppLauncher } from "./AppLauncher";
import { PriorityAlertsView } from "./PriorityAlertsView";
import { KnowledgeBaseView } from "./KnowledgeBaseView";
import { AILeadershipCloneView } from "./AILeadershipCloneView";

interface WidgetWorkspaceProps {
  widgets: WidgetConfig[];
  activePreset: WorkspacePreset;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onSelectPreset: (preset: WorkspacePreset) => void;
  /** Navigate to Settings → Workspace Layout */
  onOpenLayoutSettings: () => void;
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
  connectors: ConnectorItem[];
  userName: string;
  workspaceName?: string;
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
  onOpenConnectorsSettings?: () => void;
}

export const WidgetWorkspace: React.FC<WidgetWorkspaceProps> = ({
  widgets,
  activePreset,
  viewMode,
  onToggleViewMode,
  onSelectPreset,
  onOpenLayoutSettings,
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
  connectors,
  userName,
  workspaceName = "Command Center",
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
  onOpenConnectorsSettings,
}) => {
  const enabledWidgets = [...widgets]
    .sort((a, b) => a.order - b.order)
    .filter((w) => w.enabled);

  return (
    <div className="space-y-6">
      {/* Top Workspace Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl brand-bg-soft brand-text border brand-border">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-base">
              {workspaceName}
            </h2>
            <p className="text-xs text-slate-400">
              Pluggable executive dashboard layout • Personalized for {userName}
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-slate-800">
            {(["execution", "meeting", "strategy", "custom"] as const).map(
              (preset) => (
                <button
                  key={preset}
                  onClick={() => onSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                    activePreset === preset
                      ? "brand-button shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {preset === "execution"
                    ? "⚡ Execution"
                    : preset === "meeting"
                      ? "📅 Sync"
                      : preset === "strategy"
                        ? "🧠 Strategy"
                        : "⚙️ Custom"}
                </button>
              ),
            )}
          </div>

          <button
            onClick={onOpenLayoutSettings}
            className="px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all shrink-0 flex items-center gap-1.5 text-xs font-semibold"
            title="Open Workspace Layout in Settings & Config"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Layout settings</span>
          </button>
        </div>
      </div>

      {/* Render Enabled Pluggable Widgets */}
      <div className="space-y-6">
        {enabledWidgets.map((w) => {
          if (w.id === "w-heatmap") {
            return (
              <ProductExecutionHeatmap
                key={w.id}
                products={products}
                onNavigateTab={onNavigateTab}
              />
            );
          }
          if (w.id === "w-chief") {
            return (
              <ChiefOfStaffView
                key={w.id}
                summary={chiefSummary}
                onNavigateTab={onNavigateTab}
              />
            );
          }
          if (w.id === "w-triage") {
            return (
              <PriorityAlertsView
                key={w.id}
                alerts={alerts}
                onToggleHandled={onToggleAlertHandled}
              />
            );
          }
          if (w.id === "w-outlook") {
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
          if (w.id === "w-notion" || w.id === "w-krisp") {
            return (
              <WorkspaceToolsView
                key={w.id}
                connectors={connectors}
                notionActions={notion}
                krispTranscripts={krisp}
                onAddNotionAction={onAddNotionAction}
                onAddKrispTranscript={onAddKrispTranscript}
                onToggleNotionStatus={onToggleNotionStatus}
                onOpenConnectorsSettings={onOpenConnectorsSettings}
              />
            );
          }
          if (w.id === "w-apps") {
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
          if (w.id === "w-clone") {
            return (
              <div key={w.id} className="space-y-6">
                <KnowledgeBaseView
                  entries={kb}
                  onAddEntry={onAddKnowledgeEntry}
                />
                <AILeadershipCloneView
                  entries={kb}
                  personaRules={personaRules}
                  userName={userName}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
