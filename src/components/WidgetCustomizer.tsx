import React from 'react';
import { X, Sliders, Eye, EyeOff, Save, Check, RotateCcw } from 'lucide-react';
import { WidgetConfig, WorkspacePreset } from '../types';

interface WidgetCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  activePreset: WorkspacePreset;
  onUpdateWidgets: (widgets: WidgetConfig[]) => void;
  onSelectPreset: (preset: WorkspacePreset) => void;
}

export const WidgetCustomizer: React.FC<WidgetCustomizerProps> = ({
  isOpen,
  onClose,
  widgets,
  activePreset,
  onUpdateWidgets,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const toggleWidget = (id: string) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
    onUpdateWidgets(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-indigo-500/40 p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">Configure Workspace & Pluggable Widgets</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Mode Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Workspace Mode Presets</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['execution', 'meeting', 'strategy', 'custom'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onSelectPreset(p)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                  activePreset === p
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg'
                    : 'glass-card border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p === 'execution' ? '⚡ Execution' : p === 'meeting' ? '📅 Sync Mode' : p === 'strategy' ? '🧠 Strategy' : '⚙️ Custom'}
              </button>
            ))}
          </div>
        </div>

        {/* Pluggable Widgets List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Pluggable Widgets</span>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {widgets.map((w) => (
              <div
                key={w.id}
                onClick={() => toggleWidget(w.id)}
                className={`p-3 rounded-xl glass-card border flex items-center justify-between cursor-pointer transition-all ${
                  w.enabled ? 'border-indigo-500/40 bg-indigo-950/20' : 'border-slate-800/60 opacity-50'
                }`}
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-100 text-xs">{w.title}</h4>
                  <p className="text-[11px] text-slate-400">{w.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase">
                    {w.category}
                  </span>
                  <button className={`p-1.5 rounded-lg ${w.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {w.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
};
