import React, { useState } from 'react';
import { Mic, Plus, CheckSquare, Sparkles, Settings2, Plug } from 'lucide-react';
import { NotionActionItem, KrispTranscription, ConnectorItem } from '../types';
import { parseKrispNote } from '../services/krispParser';
import { approachLabel, resolveWorkspaceTools } from '../services/connectorApproaches';

interface WorkspaceToolsViewProps {
  connectors: ConnectorItem[];
  notionActions: NotionActionItem[];
  krispTranscripts: KrispTranscription[];
  onAddNotionAction: (action: NotionActionItem) => void;
  onAddKrispTranscript: (transcript: KrispTranscription) => void;
  onToggleNotionStatus: (id: string) => void;
  onOpenConnectorsSettings?: () => void;
  /** When true, show local demo boards even if no connector surfaces are enabled. */
  useMockData?: boolean;
}

function priorityBadgeClass(priority: string): string {
  if (priority === 'High') {
    return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
  }
  if (priority === 'Medium') {
    return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
  }
  return 'bg-[color-mix(in_srgb,var(--color-secondary-silver)_25%,transparent)] text-[var(--color-secondary-charcoal)] border border-[var(--border-subtle)]';
}

/** Config-driven tools workspace — panes come from Connected connectors with surface roles. */
export const WorkspaceToolsView: React.FC<WorkspaceToolsViewProps> = ({
  connectors,
  notionActions,
  krispTranscripts,
  onAddNotionAction,
  onAddKrispTranscript,
  onToggleNotionStatus,
  onOpenConnectorsSettings,
  useMockData = true,
}) => {
  const {
    actions: actionsTool,
    transcripts: transcriptsTool,
    connected,
    isLocalDemoFallback,
  } = resolveWorkspaceTools(connectors, { useMockData });
  const hasWorkspaceSurfaces = Boolean(actionsTool || transcriptsTool);
  const showLocalDemoBadge =
    isLocalDemoFallback ||
    actionsTool?.connectionMode === 'demo' ||
    transcriptsTool?.connectionMode === 'demo' ||
    (actionsTool && !actionsTool.liveVerified) ||
    (transcriptsTool && !transcriptsTool.liveVerified);

  const [rawKrispText, setRawKrispText] = useState('');
  const [krispTitle, setKrispTitle] = useState('');
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionPriority, setNewActionPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [showAddAction, setShowAddAction] = useState(false);

  const handleParseKrisp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawKrispText.trim() || !transcriptsTool) return;

    const parsed = parseKrispNote(
      rawKrispText,
      krispTitle || `${transcriptsTool.name} Sync`
    );
    onAddKrispTranscript(parsed);

    if (actionsTool) {
      parsed.actionItems.forEach((item, index) => {
        onAddNotionAction({
          id: `action-auto-${Date.now()}-${index}`,
          title: item,
          project: `${transcriptsTool.name} Extract`,
          priority: 'High',
          status: 'To Do',
          dueDate: new Date().toISOString().split('T')[0],
          impactScore: 8,
        });
      });
    }

    setRawKrispText('');
    setKrispTitle('');
  };

  const handleCreateNotionAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim() || !actionsTool) return;

    onAddNotionAction({
      id: `action-${Date.now()}`,
      title: newActionTitle,
      project: actionsTool.name,
      priority: newActionPriority,
      status: 'To Do',
      dueDate: new Date().toISOString().split('T')[0],
      impactScore: newActionPriority === 'High' ? 9 : 7,
    });

    setNewActionTitle('');
    setShowAddAction(false);
  };

  if (!hasWorkspaceSurfaces) {
    return (
      <div className="glass-panel rounded-2xl p-8 border brand-border space-y-5 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl brand-bg-soft brand-text border brand-border">
            <Plug className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Configure your tools</h2>
            <p className="text-sm text-slate-400">
              This workspace is empty until you connect tools in Settings. Nothing defaults to Notion
              or Krisp — pick native vendors, MCP, iPaaS, AI assistants, or a direct API.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl glass-card border border-slate-800">
            <p className="font-bold brand-text mb-1">Actions board</p>
            <p className="text-slate-400">
              Connect any tool with an <strong>actions</strong> surface (e.g. Notion, Jira, custom API).
            </p>
          </div>
          <div className="p-3 rounded-xl glass-card border border-slate-800">
            <p className="font-bold brand-text mb-1">Transcripts / notes</p>
            <p className="text-slate-400">
              Connect a <strong>transcripts</strong> surface (e.g. Krisp, meeting AI) to parse decisions.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          {connected.length} connector{connected.length === 1 ? '' : 's'} connected overall — none
          assigned to workspace action/transcript surfaces yet.
        </p>

        <button
          type="button"
          onClick={onOpenConnectorsSettings}
          className="px-4 py-2.5 rounded-xl brand-button text-xs font-bold inline-flex items-center gap-2 brand-ring"
        >
          <Settings2 className="w-4 h-4" />
          Open Connectors settings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 rounded-2xl border brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-slate-100 text-base">Tools &amp; workspace surfaces</h2>
            {showLocalDemoBadge && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/30 text-[10px] font-bold">
                Local demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {isLocalDemoFallback
              ? 'Showing on-device demo boards — connect tools in Settings to replace these surfaces.'
              : 'Driven by your Connectors configuration'}
            {actionsTool ? ` · Actions: ${actionsTool.name}` : ''}
            {transcriptsTool ? ` · Transcripts: ${transcriptsTool.name}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenConnectorsSettings}
          className="px-3 py-1.5 rounded-xl border brand-border text-xs font-semibold brand-text hover:brand-bg-soft inline-flex items-center gap-1.5"
        >
          <Settings2 className="w-3.5 h-3.5" />
          Manage connectors
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {actionsTool && (
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 brand-text" />
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">
                      {actionsTool.name} — Action Items
                    </h3>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {approachLabel(actionsTool.approach)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAction(!showAddAction)}
                  className="px-3 py-1.5 rounded-xl brand-button text-xs font-semibold flex items-center gap-1.5 brand-ring transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Action</span>
                </button>
              </div>

              {showAddAction && (
                <form
                  onSubmit={handleCreateNotionAction}
                  className="p-4 rounded-xl glass-card border brand-border space-y-3"
                >
                  <h4 className="text-xs font-bold brand-text uppercase">New action card</h4>
                  <input
                    type="text"
                    value={newActionTitle}
                    onChange={(e) => setNewActionTitle(e.target.value)}
                    placeholder="Action item title..."
                    className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={newActionPriority}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewActionPriority(e.target.value as 'High' | 'Medium' | 'Low')
                      }
                      className="px-3 py-1.5 rounded-lg glass-input text-xs bg-obsidian-950"
                    >
                      <option value="High">Priority: High</option>
                      <option value="Medium">Priority: Medium</option>
                      <option value="Low">Priority: Low</option>
                    </select>
                    <button type="submit" className="px-4 py-1.5 rounded-lg brand-button text-xs font-bold">
                      Save Task
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {notionActions.map((action) => {
                  const isDone = action.status === 'Done';
                  return (
                    <div
                      key={action.id}
                      onClick={() => onToggleNotionStatus(action.id)}
                      className={`p-4 rounded-xl glass-card border transition-all cursor-pointer space-y-2 ${
                        isDone
                          ? 'border-slate-800/50 opacity-60 line-through'
                          : 'border-slate-800 hover:border-[var(--brand-accent-border)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-400 text-obsidian-950 font-bold'
                                : 'border-slate-600'
                            }`}
                          >
                            {isDone && '✓'}
                          </span>
                          <h4 className="font-semibold text-slate-100 text-sm">{action.title}</h4>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${priorityBadgeClass(action.priority)}`}
                        >
                          {action.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span>
                          Project:{' '}
                          <strong className="text-slate-200 font-medium">{action.project}</strong>
                        </span>
                        <span className="brand-text font-semibold">
                          Impact: {action.impactScore}/10
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {transcriptsTool && (
          <div className={`${actionsTool ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4`}>
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 brand-text" />
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">
                      {transcriptsTool.name} — Notes &amp; AI Parser
                    </h3>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {approachLabel(transcriptsTool.approach)}
                    </span>
                  </div>
                </div>
                <span className="text-xs brand-text-secondary font-medium">
                  Extract Decisions &amp; Actions
                </span>
              </div>

              <form onSubmit={handleParseKrisp} className="space-y-3">
                <input
                  type="text"
                  value={krispTitle}
                  onChange={(e) => setKrispTitle(e.target.value)}
                  placeholder="Meeting Title..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
                <textarea
                  rows={4}
                  value={rawKrispText}
                  onChange={(e) => setRawKrispText(e.target.value)}
                  placeholder={`Paste raw ${transcriptsTool.name} notes or transcription output…`}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl brand-button font-bold text-xs flex items-center justify-center gap-2 brand-ring transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Parse Decisions
                    {actionsTool ? ` & Sync to ${actionsTool.name}` : ''}
                  </span>
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {krispTranscripts.map((t) => (
                <div
                  key={t.id}
                  className="glass-panel rounded-2xl p-5 border brand-border space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{t.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        {t.date} • {t.duration}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full brand-badge">
                      AI Analyzed
                    </span>
                  </div>

                  {t.decisions.length > 0 && (
                    <div className="p-3 rounded-xl bg-[var(--bg-section-alt)] border border-[var(--border-subtle)] space-y-1">
                      <span className="text-[11px] font-bold brand-text uppercase">
                        Key Decisions Made
                      </span>
                      <ul className="space-y-1">
                        {t.decisions.map((d, idx) => (
                          <li key={idx} className="text-xs text-slate-200 flex items-start gap-1.5">
                            <span className="brand-text font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {t.actionItems.length > 0 && (
                    <div className="p-3 rounded-xl brand-bg-soft border brand-border space-y-1">
                      <span className="text-[11px] font-bold brand-text uppercase">
                        Action Items Extracted
                      </span>
                      <ul className="space-y-1">
                        {t.actionItems.map((a, idx) => (
                          <li key={idx} className="text-xs text-slate-200 flex items-start gap-1.5">
                            <span className="brand-text font-bold">•</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** @deprecated Use WorkspaceToolsView — kept for widget imports */
export const NotionKrispView = WorkspaceToolsView;
