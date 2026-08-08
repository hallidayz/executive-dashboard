import React, { useMemo } from 'react';
import {
  Shield,
  Sparkles,
  Calendar,
  FileText,
  Grid,
  Bell,
  Brain,
  Settings,
  Rocket,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { TabType, AppSettings, SidebarNavId } from '../types';
import { normalizeSidebarNavOrder } from '../services/navOrder';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  settings: AppSettings;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  unreadAlertsCount: number;
}

const NAV_ICONS: Record<SidebarNavId, React.ReactNode> = {
  'command-center': <LayoutGrid className="w-4 h-4" />,
  'product-portfolio': <Rocket className="w-4 h-4" />,
  'chief-of-staff': <Sparkles className="w-4 h-4" />,
  outlook: <Calendar className="w-4 h-4" />,
  'notion-krisp': <FileText className="w-4 h-4" />,
  'app-launcher': <Grid className="w-4 h-4" />,
  'priority-alerts': <Bell className="w-4 h-4" />,
  'knowledge-clone': <Brain className="w-4 h-4" />,
};

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  settings,
  collapsed,
  onToggleCollapsed,
  unreadAlertsCount,
}) => {
  const mainNavItems = useMemo(() => {
    const catalog: Record<
      SidebarNavId,
      { id: SidebarNavId; label: string; icon: React.ReactNode; badge?: number }
    > = {
      'command-center': {
        id: 'command-center',
        label: settings.workspaceName || 'Command Center',
        icon: NAV_ICONS['command-center'],
      },
      'product-portfolio': {
        id: 'product-portfolio',
        label: 'Product Delivery',
        icon: NAV_ICONS['product-portfolio'],
      },
      'chief-of-staff': {
        id: 'chief-of-staff',
        label: settings.chiefOfStaffName || 'Chief of Staff',
        icon: NAV_ICONS['chief-of-staff'],
      },
      outlook: {
        id: 'outlook',
        label: 'EMAIL & CAL',
        icon: NAV_ICONS.outlook,
      },
      'notion-krisp': {
        id: 'notion-krisp',
        label: 'Tools & Connectors',
        icon: NAV_ICONS['notion-krisp'],
      },
      'app-launcher': {
        id: 'app-launcher',
        label: 'App Launcher',
        icon: NAV_ICONS['app-launcher'],
      },
      'priority-alerts': {
        id: 'priority-alerts',
        label: 'Priority Alerts',
        icon: NAV_ICONS['priority-alerts'],
        badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
      },
      'knowledge-clone': {
        id: 'knowledge-clone',
        label: 'KB & AI Clone',
        icon: NAV_ICONS['knowledge-clone'],
      },
    };

    return normalizeSidebarNavOrder(settings.sidebarNavOrder).map((id) => catalog[id]);
  }, [
    settings.sidebarNavOrder,
    settings.workspaceName,
    settings.chiefOfStaffName,
    unreadAlertsCount,
  ]);

  const settingsActive = activeTab === 'settings';

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 z-40 flex flex-col border-r transition-[width] duration-200 ease-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--app-border)' }}
    >
      <div
        className={`flex items-center gap-2 border-b px-3 py-3 ${collapsed ? 'justify-center' : ''}`}
        style={{ borderColor: 'var(--app-border)' }}
      >
        {settings.markDataUrl || settings.logoDataUrl ? (
          <img
            src={settings.markDataUrl || settings.logoDataUrl}
            alt=""
            className="w-9 h-9 rounded-xl object-cover shrink-0 border"
            style={{ borderColor: 'var(--app-border)' }}
          />
        ) : (
          <div className="w-9 h-9 rounded-xl brand-gradient p-0.5 brand-ring flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[10px] flex items-center justify-center bg-[var(--sidebar-bg)]">
              <Shield className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
            </div>
          </div>
        )}
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate" style={{ color: 'var(--sidebar-fg)' }}>
              {settings.workspaceName || 'Command Center'}
            </p>
            <p className="text-[10px] truncate">
              <span className="font-semibold" style={{ color: 'var(--brand-accent)' }}>
                {settings.chiefOfStaffName || 'Atlas'}
              </span>
              <span style={{ color: 'var(--sidebar-muted)' }}> · {settings.userName}</span>
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          style={{ color: 'var(--sidebar-muted)' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {mainNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative w-full flex items-center gap-2.5 rounded-xl text-xs font-medium transition-all ${
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'brand-button shadow-md brand-ring'
                  : 'hover:bg-white/10'
              }`}
              style={
                isActive
                  ? { color: 'var(--brand-on-accent)' }
                  : { color: 'var(--sidebar-muted)' }
              }
            >
              <span
                className="shrink-0"
                style={isActive ? { color: 'var(--brand-on-accent)' } : undefined}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span
                  className="truncate flex-1 text-left"
                  style={isActive ? { color: 'var(--brand-on-accent)' } : undefined}
                >
                  {item.label}
                </span>
              )}
              {item.badge !== undefined && (
                <span
                  className={`rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse ${
                    collapsed ? 'absolute top-1 right-1 w-4 h-4' : 'w-5 h-5'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t" style={{ borderColor: 'rgba(214,214,214,0.2)' }}>
        {!collapsed && (
          <p
            className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: 'var(--brand-accent)' }}
          >
            Configuration
          </p>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          title="Settings & Config"
          className={`w-full flex items-center gap-2.5 rounded-xl text-xs font-semibold transition-all ${
            collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
          } ${
            settingsActive
              ? 'brand-button shadow-md brand-ring'
              : 'hover:bg-white/10 border border-transparent'
          }`}
          style={
            settingsActive
              ? { color: 'var(--brand-on-accent)' }
              : { color: 'var(--sidebar-muted)' }
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="truncate">Settings & Config</span>}
        </button>
        {!collapsed && (
          <p className="px-2 pt-2 text-[10px] leading-snug" style={{ color: 'var(--sidebar-muted)' }}>
            Personalization, workspace layout, skills, AI models, and system preferences.
          </p>
        )}
      </div>
    </aside>
  );
};
