import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Minimize2,
  ArrowLeftRight,
} from 'lucide-react';
import { ChiefOfStaffSummary } from '../types';

interface FloatingAIAdvisorPanelProps {
  summary: ChiefOfStaffSummary;
  onNavigateTab: (tab: any) => void;
  sidebarWidth?: number;
  chiefOfStaffName: string;
  markDataUrl?: string;
  isMinimized: boolean;
  onMinimizedChange: (minimized: boolean) => void;
}

export const FloatingAIAdvisorPanel: React.FC<FloatingAIAdvisorPanelProps> = ({
  summary,
  sidebarWidth = 260,
  chiefOfStaffName,
  markDataUrl,
  isMinimized,
  onMinimizedChange,
}) => {
  const cosName = chiefOfStaffName?.trim() || 'Atlas';
  const [dockPosition, setDockPosition] = useState<'right' | 'left'>('right');
  const [aiPrompt, setAiPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; text: string; timestamp: string }[]>([
    {
      role: 'assistant',
      text: `Good morning! I'm ${cosName}, your Chief of Staff AI. ${summary.dailyTagline}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      role: 'assistant',
      text: `Top Priority Directive: ${summary.topDirectives[0] || 'Review Q3 launch readiness & active blockers.'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isMinimized]);

  const handleSendPrompt = (userText: string) => {
    if (!userText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatLog((prev) => [...prev, { role: 'user', text: userText, timestamp: time }]);
    setAiPrompt('');

    setTimeout(() => {
      let reply = `${cosName}: Regarding "${userText}", I recommend prioritizing your top 3 launch readiness blockers, protecting your 10:30 AM focus window, and logging the rationale in your Local KB.`;
      const lower = userText.toLowerCase();

      if (lower.includes('schedule') || includesAny(lower, ['meeting', 'cal'])) {
        reply = `${cosName}: Calendar density is currently at ${summary.calendarDensityPercentage}%. I recommend reserving your 10:30 AM deep work window for AI Clone scenario logging.`;
      } else if (includesAny(lower, ['email', 'outlook', 'vip'])) {
        reply = `${cosName}: Analyzed priority emails. CEO Sarah's board deck request is flagged urgent for 2 PM today.`;
      } else if (includesAny(lower, ['blocker', 'launch', 'readiness'])) {
        reply = `${cosName}: Launch readiness is at 92%. Active blockers identified on Product #4 (Security Shield). Eng resources assigned.`;
      } else if (includesAny(lower, ['krisp', 'notion', 'transcript'])) {
        reply = `${cosName}: 2 decisions extracted from your latest Krisp notes are ready to export into Notion.`;
      }

      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 450);
  };

  function includesAny(text: string, words: string[]) {
    return words.some((w) => text.includes(w));
  }

  const quickActions = [
    { label: 'Optimize Schedule', query: 'Optimize my day schedule' },
    { label: 'Launch Readiness', query: 'Check product launch readiness' },
    { label: 'Draft VIP Reply', query: 'Draft response to CEO Sarah' },
    { label: 'Simulate Stance', query: 'Simulate decision stance on blockers' },
  ];

  // Minimized state is rendered in the top header (left of Search).
  if (isMinimized) return null;

  return (
    <div
      className={`fixed top-24 z-50 transition-all duration-300 ${
        dockPosition === 'right' ? 'right-4' : ''
      }`}
      style={dockPosition === 'left' ? { left: sidebarWidth + 16 } : undefined}
    >
      <div className="glass-panel w-80 md:w-96 rounded-2xl brand-border brand-ring bg-obsidian-950/95 shadow-2xl flex flex-col h-[520px] overflow-hidden backdrop-blur-xl">
        <div className="p-3.5 border-b border-slate-800/80 brand-bg-soft flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg brand-bg-soft brand-border border flex items-center justify-center overflow-hidden shrink-0">
              {markDataUrl ? (
                <img src={markDataUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Sparkles className="w-4 h-4 brand-text animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-white truncate">{cosName}</h4>
              <span className="text-[9px] text-slate-400 block">
                Chief of Staff · Docked {dockPosition === 'right' ? 'Right' : 'Left'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setDockPosition(dockPosition === 'right' ? 'left' : 'right')}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
              title={`Move panel to ${dockPosition === 'right' ? 'Left' : 'Right'}`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-semibold hidden sm:inline">Flip</span>
            </button>

            <button
              onClick={() => onMinimizedChange(true)}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Minimize to header"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                    : 'bg-obsidian-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-500 px-1">{msg.timestamp}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-2.5 bg-obsidian-900/80 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(qa.query)}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold whitespace-nowrap transition-all shrink-0"
              >
                {qa.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(aiPrompt);
            }}
            className="flex gap-1.5"
          >
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={`Ask ${cosName}...`}
              className="flex-1 px-3 py-2 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
