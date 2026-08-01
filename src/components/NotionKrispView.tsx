import React, { useState } from 'react';
import {
  FileText,
  Mic,
  Plus,
  CheckSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  Upload,
  Brain,
} from 'lucide-react';
import { NotionActionItem, KrispTranscription } from '../types';
import { parseKrispNote } from '../services/krispParser';

interface NotionKrispViewProps {
  notionActions: NotionActionItem[];
  krispTranscripts: KrispTranscription[];
  onAddNotionAction: (action: NotionActionItem) => void;
  onAddKrispTranscript: (transcript: KrispTranscription) => void;
  onToggleNotionStatus: (id: string) => void;
}

export const NotionKrispView: React.FC<NotionKrispViewProps> = ({
  notionActions,
  krispTranscripts,
  onAddNotionAction,
  onAddKrispTranscript,
  onToggleNotionStatus,
}) => {
  const [rawKrispText, setRawKrispText] = useState('');
  const [krispTitle, setKrispTitle] = useState('');
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionPriority, setNewActionPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [showAddAction, setShowAddAction] = useState(false);

  const handleParseKrisp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawKrispText.trim()) return;

    const parsed = parseKrispNote(rawKrispText, krispTitle || 'Krisp Executive Sync');
    onAddKrispTranscript(parsed);

    // Auto-create Notion action items for extracted items
    parsed.actionItems.forEach((item, index) => {
      onAddNotionAction({
        id: `notion-auto-${Date.now()}-${index}`,
        title: item,
        project: 'Krisp Extract',
        priority: 'High',
        status: 'To Do',
        dueDate: new Date().toISOString().split('T')[0],
        impactScore: 8,
      });
    });

    setRawKrispText('');
    setKrispTitle('');
  };

  const handleCreateNotionAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;

    onAddNotionAction({
      id: `notion-${Date.now()}`,
      title: newActionTitle,
      project: 'Executive Directives',
      priority: newActionPriority,
      status: 'To Do',
      dueDate: new Date().toISOString().split('T')[0],
      impactScore: newActionPriority === 'High' ? 9 : 7,
    });

    setNewActionTitle('');
    setShowAddAction(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Notion Action Items Board (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-base">Notion Action Items Sync</h3>
            </div>
            <button
              onClick={() => setShowAddAction(!showAddAction)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Action</span>
            </button>
          </div>

          {/* Add Notion Task Form */}
          {showAddAction && (
            <form onSubmit={handleCreateNotionAction} className="p-4 rounded-xl glass-card border border-emerald-500/40 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase">New Notion Action Card</h4>
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
                  onChange={(e: any) => setNewActionPriority(e.target.value)}
                  className="px-3 py-1.5 rounded-lg glass-input text-xs bg-obsidian-950"
                >
                  <option value="High">Priority: High</option>
                  <option value="Medium">Priority: Medium</option>
                  <option value="Low">Priority: Low</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                >
                  Save Task
                </button>
              </div>
            </form>
          )}

          {/* Action List */}
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
                      : 'border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isDone ? 'bg-emerald-500 border-emerald-400 text-obsidian-950 font-bold' : 'border-slate-600'
                        }`}
                      >
                        {isDone && '✓'}
                      </span>
                      <h4 className="font-semibold text-slate-100 text-sm">{action.title}</h4>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        action.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {action.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Project: <strong className="text-slate-200 font-medium">{action.project}</strong></span>
                    <span className="text-emerald-400 font-semibold">Impact: {action.impactScore}/10</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Krisp Transcription Reader & AI Extractor (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Upload / Paste Form */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-slate-100 text-base">Krisp Transcriptions AI Parser</h3>
            </div>
            <span className="text-xs text-purple-400 font-medium">Extract Decisions & Actions</span>
          </div>

          <form onSubmit={handleParseKrisp} className="space-y-3">
            <input
              type="text"
              value={krispTitle}
              onChange={(e) => setKrispTitle(e.target.value)}
              placeholder="Meeting Title (e.g. Q3 Architecture Review)..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
            <textarea
              rows={4}
              value={rawKrispText}
              onChange={(e) => setRawKrispText(e.target.value)}
              placeholder="Paste raw Krisp meeting notes, bullet points, or transcription output here..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Parse Decisions & Sync to Notion</span>
            </button>
          </form>
        </div>

        {/* Existing Parsed Transcripts Feed */}
        <div className="space-y-3">
          {krispTranscripts.map((t) => (
            <div key={t.id} className="glass-panel rounded-2xl p-5 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{t.title}</h4>
                  <span className="text-[11px] text-slate-400">{t.date} • {t.duration}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  AI Analyzed
                </span>
              </div>

              {/* Extracted Decisions */}
              {t.decisions.length > 0 && (
                <div className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-purple-400 uppercase">Key Decisions Made</span>
                  <ul className="space-y-1">
                    {t.decisions.map((d, idx) => (
                      <li key={idx} className="text-xs text-slate-200 flex items-start gap-1.5">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracted Actions */}
              {t.actionItems.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase">Action Items Extracted</span>
                  <ul className="space-y-1">
                    {t.actionItems.map((a, idx) => (
                      <li key={idx} className="text-xs text-emerald-200 flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
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
    </div>
  );
};
