import React, { useState } from 'react';
import {
  Sliders,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  GripVertical,
} from 'lucide-react';
import { WidgetConfig, WorkspacePreset, SidebarNavId, AppSettings } from '../types';
import {
  DEFAULT_SIDEBAR_NAV_ORDER,
  SIDEBAR_NAV_LABELS,
  NAV_TO_WIDGET_IDS,
  moveItemInList,
  normalizeSidebarNavOrder,
  reorderListByIndex,
} from '../services/navOrder';

interface WorkspaceLayoutSettingsProps {
  widgets: WidgetConfig[];
  activePreset: WorkspacePreset;
  sidebarNavOrder: SidebarNavId[];
  settings: AppSettings;
  viewMode?: 'grid' | 'list';
  onUpdateWidgets: (widgets: WidgetConfig[]) => void;
  onReorderModules: (order: SidebarNavId[]) => void;
  onSelectPreset: (preset: WorkspacePreset) => void;
}

/** Command Center + left-rail layout controls (used inside Settings & Config). */
export const WorkspaceLayoutSettings: React.FC<WorkspaceLayoutSettingsProps> = ({
  widgets,
  activePreset,
  sidebarNavOrder,
  settings,
  viewMode = 'list',
  onUpdateWidgets,
  onReorderModules,
  onSelectPreset,
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const moduleOrder = normalizeSidebarNavOrder(sidebarNavOrder);
  const widgetById = new Map(widgets.map((w) => [w.id, w]));

  const clearDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const moduleVisibility = (id: SidebarNavId): 'all' | 'some' | 'none' | 'shell' => {
    const ids = NAV_TO_WIDGET_IDS[id];
    if (!ids.length) return 'shell';
    const states = ids.map((wid) => widgetById.get(wid)?.enabled ?? false);
    if (states.every(Boolean)) return 'all';
    if (states.some(Boolean)) return 'some';
    return 'none';
  };

  const toggleModuleVisibility = (id: SidebarNavId) => {
    const ids = NAV_TO_WIDGET_IDS[id];
    if (!ids.length) return;
    const currentlyOn = ids.some((wid) => widgetById.get(wid)?.enabled);
    const updated = widgets.map((w) =>
      ids.includes(w.id) ? { ...w, enabled: !currentlyOn } : w
    );
    onUpdateWidgets(updated);
  };

  const applyModuleOrder = (next: SidebarNavId[]) => {
    onReorderModules(normalizeSidebarNavOrder(next));
  };

  const moveModule = (index: number, direction: -1 | 1) => {
    applyModuleOrder(moveItemInList(moduleOrder, index, direction));
  };

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.55';
    }
  };

  const onDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    clearDrag();
  };

  const onDragOverItem = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverIndex(index);
  };

  const onDropItem = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from =
      dragIndex ??
      (() => {
        const n = Number(e.dataTransfer.getData('text/plain'));
        return Number.isFinite(n) ? n : null;
      })();
    if (from == null) {
      clearDrag();
      return;
    }
    applyModuleOrder(reorderListByIndex(moduleOrder, from, toIndex));
    clearDrag();
  };

  const moduleLabel = (id: SidebarNavId) => {
    if (id === 'command-center') return settings.workspaceName || SIDEBAR_NAV_LABELS[id];
    if (id === 'chief-of-staff') return settings.chiefOfStaffName || SIDEBAR_NAV_LABELS[id];
    return SIDEBAR_NAV_LABELS[id];
  };

  const moduleHint = (id: SidebarNavId) => {
    const widgetIds = NAV_TO_WIDGET_IDS[id];
    if (!widgetIds.length) return 'Home shell · opens Command Center workspace';
    return `Workspace panel${widgetIds.length > 1 ? 's' : ''}: ${widgetIds.join(', ')}`;
  };

  const rowHighlight = (index: number) => {
    if (dragIndex === index) return ' opacity-50 scale-[0.99]';
    if (overIndex === index && dragIndex !== null) {
      return ' ring-2 ring-[var(--brand-accent)] border-[var(--brand-accent)]';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel p-5 rounded-2xl brand-border space-y-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 brand-text" />
          <div>
            <h3 className="font-bold text-slate-100 text-base">Command Center & navigation layout</h3>
            <p className="text-xs text-slate-400">
              One module order drives both the left rail and Command Center panels. Changes save immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Workspace mode presets
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['execution', 'meeting', 'strategy', 'custom'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSelectPreset(p)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                activePreset === p
                  ? 'brand-gradient brand-border shadow-lg'
                  : 'glass-card border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'execution'
                ? '⚡ Execution'
                : p === 'meeting'
                  ? '📅 Sync Mode'
                  : p === 'strategy'
                    ? '🧠 Strategy'
                    : '⚙️ Custom'}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500">
          Presets only change which panels are visible — module order stays the same.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Module order (left nav + panels)
          </span>
          <button
            type="button"
            onClick={() => applyModuleOrder([...DEFAULT_SIDEBAR_NAV_ORDER])}
            className="text-[10px] font-semibold text-slate-400 hover:brand-text flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset order
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Drag the grip (or use arrows). Eye shows/hides that module’s Command Center panel(s).
          Settings stays pinned at the bottom of the left rail.
        </p>

        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
              : 'space-y-2'
          }
        >
          {moduleOrder.map((id, index) => {
            const visibility = moduleVisibility(id);
            const canToggle = visibility !== 'shell';
            return (
              <div
                key={id}
                onDragOver={onDragOverItem(index)}
                onDrop={onDropItem(index)}
                className={`${
                  viewMode === 'grid' ? 'p-4 flex-col items-stretch' : 'p-3 items-center'
                } rounded-xl glass-card border brand-border flex gap-2 transition-all${rowHighlight(
                  index
                )} ${visibility === 'none' ? 'opacity-55' : ''}`}
              >
                <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'w-full' : ''}`}>
                  <div
                    draggable
                    onDragStart={onDragStart(index)}
                    onDragEnd={onDragEnd}
                    className="p-1 rounded-md text-slate-400 hover:text-[var(--app-fg)] shrink-0 cursor-grab active:cursor-grabbing touch-none"
                    title="Drag to reorder"
                    aria-label="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveModule(index, -1)}
                      className="p-1 rounded-md bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === moduleOrder.length - 1}
                      onClick={() => moveModule(index, 1)}
                      className="p-1 rounded-md bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                      <h4 className="font-bold text-slate-100 text-xs truncate">{moduleLabel(id)}</h4>
                    </div>
                    <p className={`text-[10px] text-slate-500 ${viewMode === 'grid' ? '' : 'line-clamp-1'}`}>
                      {moduleHint(id)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {canToggle ? (
                      <button
                        type="button"
                        onClick={() => toggleModuleVisibility(id)}
                        className={`p-1.5 rounded-lg ${
                          visibility === 'all'
                            ? 'text-emerald-400'
                            : visibility === 'some'
                              ? 'text-amber-400'
                              : 'text-slate-500'
                        }`}
                        title={
                          visibility === 'none'
                            ? 'Show in Command Center'
                            : 'Hide from Command Center'
                        }
                      >
                        {visibility === 'none' ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <span className="text-[9px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 font-semibold uppercase">
                        Home
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl border border-dashed border-slate-700 text-[11px] text-slate-500">
          Pinned: <span className="text-slate-300 font-semibold">Settings & Config</span> (always last
          in the left rail)
        </div>
      </div>
    </div>
  );
};
