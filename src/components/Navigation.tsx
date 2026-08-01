import React from 'react';
import {
  Shield,
  Sparkles,
  Calendar,
  FileText,
  Grid,
  Bell,
  Brain,
  Settings,
  Power,
  Search,
  Rocket,
  LayoutGrid,
} from 'lucide-react';
import { TabType, AppSettings } from '../types';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  settings: AppSettings;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  unreadAlertsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenSettings,
  onOpenCommandPalette,
  unreadAlertsCount,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'command-center', label: 'Command Center', icon: <LayoutGrid className="w-4 h-4 text-indigo-400" /> },
    { id: 'product-portfolio', label: 'Product Delivery Matrix', icon: <Rocket className="w-4 h-4 text-purple-400" /> },
    { id: 'chief-of-staff', label: 'Chief of Staff', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'outlook', label: 'Outlook Inbox & Cal', icon: <Calendar className="w-4 h-4 text-cyan-400" /> },
    { id: 'notion-krisp', label: 'Notion & Krisp', icon: <FileText className="w-4 h-4 text-emerald-400" /> },
    { id: 'app-launcher', label: 'App Launcher', icon: <Grid className="w-4 h-4 text-gold-400" /> },
    {
      id: 'priority-alerts',
      label: 'Priority Alerts',
      icon: <Bell className="w-4 h-4 text-rose-400" />,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
    { id: 'knowledge-clone', label: 'Local KB & AI Clone', icon: <Brain className="w-4 h-4 text-purple-300" /> },
    { id: 'settings', label: 'Settings & AI Config', icon: <Settings className="w-4 h-4 text-indigo-300" /> },
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Executive Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-glow-indigo flex items-center justify-center">
          <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base tracking-tight text-white font-sans">
              Head of Product Command Center
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-300 border border-indigo-500/40 rounded-full uppercase">
              Execution Co-Pilot
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {settings.userName} • <span className="text-indigo-400 font-semibold">{settings.userTitle}</span>
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-obsidian-900/90 p-1 rounded-xl border border-slate-800/80 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Search, Auto-Start Status & Settings */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger Button */}
        <button
          onClick={onOpenCommandPalette}
          className="px-3 py-1.5 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-medium flex items-center gap-2 transition-all shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>

        {/* Auto-Start Status Badge */}
        <div
          title={settings.autoStartOnBoot ? 'Windows Auto-Start is Active' : 'Auto-Start is Disabled'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            settings.autoStartOnBoot
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-slate-800/50 text-slate-400 border-slate-700'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Auto-Start:</span>
          <span className="font-semibold">{settings.autoStartOnBoot ? 'ON' : 'OFF'}</span>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-obsidian-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-sm"
          title="App Settings & Integration Keys"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
