import React, { useState, useEffect } from 'react';
import { Search, X, Calendar, Mail, FileText, Mic, Grid, Brain, Sparkles, Command } from 'lucide-react';
import {
  CalendarEvent,
  EmailMessage,
  NotionActionItem,
  KrispTranscription,
  AppShortcut,
  KnowledgeEntry,
  TabType,
} from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  calendar: CalendarEvent[];
  emails: EmailMessage[];
  notion: NotionActionItem[];
  krisp: KrispTranscription[];
  apps: AppShortcut[];
  kb: KnowledgeEntry[];
  onNavigateTab: (tab: TabType) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  calendar,
  emails,
  notion,
  krisp,
  apps,
  kb,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingCal = calendar.filter((c) => c.title.toLowerCase().includes(q) || c.agenda?.toLowerCase().includes(q));
  const matchingEmails = emails.filter((e) => e.subject.toLowerCase().includes(q) || e.sender.toLowerCase().includes(q));
  const matchingNotion = notion.filter((n) => n.title.toLowerCase().includes(q) || n.project.toLowerCase().includes(q));
  const matchingKrisp = krisp.filter((k) => k.title.toLowerCase().includes(q) || k.summary.toLowerCase().includes(q));
  const matchingApps = apps.filter((a) => a.name.toLowerCase().includes(q));
  const matchingKb = kb.filter((k) => k.title.toLowerCase().includes(q) || k.decisionMade.toLowerCase().includes(q));

  const totalResults =
    matchingCal.length + matchingEmails.length + matchingNotion.length + matchingKrisp.length + matchingApps.length + matchingKb.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border brand-border p-4 space-y-4 shadow-2xl relative">
        {/* Search Header */}
        <div className="relative flex items-center border-b border-slate-800 pb-3">
          <Search className="w-5 h-5 brand-text absolute left-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across Outlook, Notion, Krisp, Local KB, App Launcher, or AI Clone... (Ctrl+K)"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder:text-slate-500"
          />
          <button onClick={onClose} className="absolute right-3 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1 text-xs">
          {!q && (
            <div className="p-4 text-center text-slate-400 space-y-2">
              <Command className="w-8 h-8 brand-text mx-auto opacity-60" />
              <p className="font-semibold text-slate-200">Executive Command Palette Active</p>
              <p className="text-[11px]">Type any keyword to instantly search emails, meetings, tasks, and decision logs.</p>
            </div>
          )}

          {/* Apps */}
          {matchingApps.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold brand-text uppercase tracking-wider block px-2">Apps & Tools</span>
              {matchingApps.map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    window.open(a.url, '_blank');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl glass-card border border-slate-800 hover:border-[var(--brand-accent-border)] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 brand-text" />
                    <span className="font-semibold text-slate-100">{a.name}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Launch App</span>
                </div>
              ))}
            </div>
          )}

          {/* Notion Deliverables */}
          {matchingNotion.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold brand-text uppercase tracking-wider block px-2">Action cards</span>
              {matchingNotion.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    onNavigateTab('notion-krisp');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl glass-card border border-slate-800 hover:border-[var(--brand-accent-border)] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 brand-text" />
                    <span className="font-semibold text-slate-100">{n.title}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      n.priority === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : n.priority === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'brand-bg-soft brand-text border-transparent'
                    }`}
                  >
                    {n.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Krisp Notes */}
          {matchingKrisp.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold brand-text-secondary uppercase tracking-wider block px-2">Krisp Transcriptions</span>
              {matchingKrisp.map((k) => (
                <div
                  key={k.id}
                  onClick={() => {
                    onNavigateTab('notion-krisp');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl glass-card border border-slate-800 hover:brand-border flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 brand-text-secondary" />
                    <span className="font-semibold text-slate-100">{k.title}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{k.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* Local KB Entries */}
          {matchingKb.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold brand-text-secondary uppercase tracking-wider block px-2">Local KB & AI Clone Log</span>
              {matchingKb.map((kbEntry) => (
                <div
                  key={kbEntry.id}
                  onClick={() => {
                    onNavigateTab('knowledge-clone');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl glass-card border border-slate-800 hover:brand-border flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 brand-text-secondary" />
                    <span className="font-semibold text-slate-100">{kbEntry.title}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{kbEntry.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
