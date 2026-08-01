import React, { useState } from 'react';
import {
  Grid,
  List,
  ExternalLink,
  Plus,
  Pin,
  Mail,
  MessageSquare,
  FileText,
  Mic,
  Layout,
  Code,
  CheckSquare,
  Bot,
  Globe,
  Play,
  Terminal,
} from 'lucide-react';
import { AppShortcut, ViewMode, CustomAppSpec } from '../types';
import { CustomAppRunnerModal } from './CustomAppRunnerModal';
import { LocalFilePathBadge } from './LocalFilePathBadge';

interface AppLauncherProps {
  shortcuts: AppShortcut[];
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onAddShortcut: (shortcut: AppShortcut) => void;
  onLaunchShortcut: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({
  shortcuts,
  viewMode,
  onToggleViewMode,
  onAddShortcut,
  onLaunchShortcut,
  onTogglePin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomAppModal, setShowCustomAppModal] = useState(false);
  const [runningCustomApp, setRunningCustomApp] = useState<CustomAppSpec | null>(null);

  const [appName, setAppName] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [appCategory, setAppCategory] = useState<'Communication' | 'Productivity' | 'Design & Code' | 'Custom'>('Productivity');

  const getIcon = (name: string) => {
    switch (name) {
      case 'Mail': return <Mail className="w-5 h-5 text-cyan-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-indigo-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'Mic': return <Mic className="w-5 h-5 text-purple-400" />;
      case 'Layout': return <Layout className="w-5 h-5 text-pink-400" />;
      case 'Code': return <Code className="w-5 h-5 text-amber-400" />;
      case 'CheckSquare': return <CheckSquare className="w-5 h-5 text-blue-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-gold-400" />;
      default: return <Globe className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleLaunch = (sc: AppShortcut) => {
    onLaunchShortcut(sc.id);
    window.open(sc.url, '_blank');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !appUrl) return;

    onAddShortcut({
      id: `app-custom-${Date.now()}`,
      name: appName,
      category: appCategory,
      icon: 'Globe',
      url: appUrl,
      isLocalUri: appUrl.startsWith('file://') || appUrl.startsWith('app://') || appUrl.includes(':\\') || appUrl.includes(':/'),
      pinned: true,
      launchCount: 1,
    });

    setAppName('');
    setAppUrl('');
    setShowAddModal(false);
  };

  const handleSaveCustomApp = (spec: CustomAppSpec) => {
    onAddShortcut({
      id: spec.id,
      name: spec.name,
      category: 'Custom',
      icon: 'Code',
      url: spec.url || '#',
      isLocalUri: true,
      pinned: true,
      launchCount: 1,
      customAppId: spec.id,
    });
    setRunningCustomApp(spec);
  };

  const categories = ['All', 'Pinned', 'Communication', 'Productivity', 'Design & Code', 'Custom'];

  const filteredShortcuts = shortcuts.filter((sc) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Pinned') return sc.pinned;
    return sc.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & View Mode Switcher */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Executive App & Custom Runner Hub</h2>
            <p className="text-xs text-slate-400">Launch standard web tools or write/run custom executive micro-apps.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tiles vs List Toggle Button */}
          <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid' ? 'bg-amber-500 text-obsidian-950 font-bold' : 'text-slate-400'
              }`}
              title="Tile Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Tiles</span>
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list' ? 'bg-amber-500 text-obsidian-950 font-bold' : 'text-slate-400'
              }`}
              title="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => setShowCustomAppModal(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Code className="w-4 h-4" />
            <span>Write Custom App</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-gold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shortcut</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto bg-obsidian-900/80 p-1.5 rounded-xl border border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-500 text-obsidian-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Embedded Live Runner Container (If active custom app) */}
      {runningCustomApp && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/50 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>Custom App Execution Environment: {runningCustomApp.name}</span>
            </span>
            <button onClick={() => setRunningCustomApp(null)} className="text-xs text-slate-400 hover:text-white">
              Close Runner
            </button>
          </div>
          {runningCustomApp.codeSnippet ? (
            <div
              className="p-4 rounded-xl bg-obsidian-950 border border-slate-800 overflow-auto"
              dangerouslySetInnerHTML={{ __html: runningCustomApp.codeSnippet }}
            />
          ) : (
            <iframe src={runningCustomApp.url} className="w-full h-64 rounded-xl border border-slate-800" />
          )}
        </div>
      )}

      {/* Add Shortcut Modal */}
      {showAddModal && (
        <form onSubmit={handleAddSubmit} className="glass-panel p-5 rounded-2xl border border-amber-500/40 space-y-3">
          <h4 className="font-bold text-slate-100 text-sm">Add New App Shortcut</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="App Name..."
              className="px-3 py-2 rounded-xl glass-input text-xs"
            />
            <input
              type="text"
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="URL or Local URI..."
              className="px-3 py-2 rounded-xl glass-input text-xs"
            />
            <select
              value={appCategory}
              onChange={(e: any) => setAppCategory(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input text-xs bg-obsidian-950"
            >
              <option value="Communication">Communication</option>
              <option value="Productivity">Productivity</option>
              <option value="Design & Code">Design & Code</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 rounded-xl bg-amber-500 text-obsidian-950 text-xs font-bold hover:bg-amber-400">
              Save App
            </button>
          </div>
        </form>
      )}

      {/* Custom App Creator Modal */}
      <CustomAppRunnerModal
        isOpen={showCustomAppModal}
        onClose={() => setShowCustomAppModal(false)}
        onSaveCustomApp={handleSaveCustomApp}
      />

      {/* View Mode: TILES GRID VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredShortcuts.map((sc) => (
            <div
              key={sc.id}
              onClick={() => handleLaunch(sc)}
              className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 cursor-pointer space-y-4 group relative flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800 group-hover:border-amber-500/40 transition-all">
                  {getIcon(sc.icon)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(sc.id);
                  }}
                  className={`p-1.5 rounded-lg transition-all ${
                    sc.pinned ? 'text-amber-400 bg-amber-500/20' : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-base group-hover:text-amber-400 transition-colors truncate">
                  {sc.name}
                </h4>
                <span className="text-xs text-slate-400 block truncate">{sc.category}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <span>Launches: <strong className="text-amber-400">{sc.launchCount}</strong></span>
                {sc.isLocalUri ? (
                  <LocalFilePathBadge path={sc.url} />
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 group-hover:underline">
                    Open <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* View Mode: SINGLE-ROW COMPACT LIST VIEW */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
          {filteredShortcuts.map((sc) => (
            <div
              key={sc.id}
              onClick={() => handleLaunch(sc)}
              className="p-3 hover:bg-slate-800/40 transition-all flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 rounded-lg bg-obsidian-950 border border-slate-800 shrink-0">
                  {getIcon(sc.icon)}
                </div>
                <h4 className="font-bold text-slate-100 text-xs shrink-0">{sc.name}</h4>
                <span className="text-[11px] text-slate-400 truncate flex-1 min-w-0" title={sc.url}>
                  {sc.category} • {sc.url}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs">
                {sc.isLocalUri ? (
                  <LocalFilePathBadge path={sc.url} />
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    Launch <ExternalLink className="w-3 h-3" />
                  </span>
                )}

                <span className="text-slate-400 hidden sm:inline">Launches: <strong className="text-amber-400">{sc.launchCount}</strong></span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(sc.id);
                  }}
                  className={`p-1.5 rounded-lg ${sc.pinned ? 'text-amber-400' : 'text-slate-500'}`}
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
