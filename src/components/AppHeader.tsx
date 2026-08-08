import React from 'react';
import { Search, Power, Bot, Maximize2 } from 'lucide-react';
import { AppSettings } from '../types';

interface AppHeaderProps {
  settings: AppSettings;
  onOpenCommandPalette: () => void;
  aiMinimized: boolean;
  onExpandAi: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  settings,
  onOpenCommandPalette,
  aiMinimized,
  onExpandAi,
}) => {
  const workspaceName = settings.workspaceName || 'Command Center';
  const cosName = settings.chiefOfStaffName || 'Atlas';
  const tagline = settings.tagline || 'Execution Co-Pilot';

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 py-3 border-b backdrop-blur-md"
      style={{ background: 'var(--header-bg)', borderColor: 'var(--app-border)' }}
    >
      <div className="min-w-0 flex items-center gap-3">
        {settings.logoDataUrl ? (
          <img
            src={settings.logoDataUrl}
            alt={`${workspaceName} logo`}
            className="h-8 w-auto max-w-[120px] object-contain shrink-0 rounded"
          />
        ) : settings.markDataUrl ? (
          <img
            src={settings.markDataUrl}
            alt=""
            className="h-8 w-8 object-cover shrink-0 rounded-lg border"
            style={{ borderColor: 'var(--app-border)' }}
          />
        ) : null}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-bold text-base tracking-tight font-sans truncate" style={{ color: 'var(--text-heading)' }}>
              {workspaceName}
            </h1>
            {tagline && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider brand-badge rounded-full uppercase shrink-0">
                {tagline}
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--app-muted)] truncate">
            {settings.userName} • <span className="brand-text font-semibold">{settings.userTitle}</span>
            {settings.personalTouch ? (
              <span className="brand-text-secondary"> · {settings.personalTouch}</span>
            ) : null}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Minimized CoS AI docks immediately left of Search */}
        {aiMinimized && (
          <button
            type="button"
            onClick={onExpandAi}
            className="px-3 py-1.5 rounded-xl brand-border-secondary brand-bg-secondary-soft border text-xs font-medium flex items-center gap-2 transition-all shadow-sm hover:opacity-90"
            title={`Expand ${cosName}`}
          >
            {settings.markDataUrl ? (
              <img src={settings.markDataUrl} alt="" className="w-5 h-5 rounded-md object-cover" />
            ) : (
              <span className="w-5 h-5 rounded-md brand-secondary-fill flex items-center justify-center">
                <Bot className="w-3 h-3 animate-pulse" style={{ color: 'var(--brand-on-secondary)' }} />
              </span>
            )}
            <span className="font-bold brand-text-secondary max-w-[120px] truncate">{cosName}</span>
            <Maximize2 className="w-3.5 h-3.5 brand-text-secondary hidden sm:block" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all shadow-sm text-[var(--app-fg)] hover:border-[var(--brand-accent-border)]"
          style={{ background: 'var(--glass-input)', borderColor: 'var(--app-border)' }}
        >
          <Search className="w-3.5 h-3.5 brand-text" />
          <span className="hidden md:inline text-[var(--app-muted)]">Search...</span>
          <kbd
            className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border text-[var(--app-muted)]"
            style={{ background: 'var(--glass-card)', borderColor: 'var(--app-border)' }}
          >
            Ctrl+K
          </kbd>
        </button>

        <div
          title={
            settings.autoStartOnBoot
              ? 'Auto-Start preference ON (applies in Electron shell)'
              : 'Auto-Start preference OFF'
          }
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            settings.autoStartOnBoot
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
              : 'text-[var(--app-muted)]'
          }`}
          style={!settings.autoStartOnBoot ? { borderColor: 'var(--app-border)' } : undefined}
        >
          <Power className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Auto-Start:</span>
          <span className="font-semibold">{settings.autoStartOnBoot ? 'ON' : 'OFF'}</span>
        </div>
      </div>
    </header>
  );
};
