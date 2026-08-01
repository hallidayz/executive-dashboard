import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  Clock,
  ChevronRight,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Bot,
  Send,
  CheckCircle2,
  ListTodo,
  Layers,
} from 'lucide-react';
import { ChiefOfStaffSummary } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface ChiefOfStaffViewProps {
  summary: ChiefOfStaffSummary;
  onNavigateTab: (tab: any) => void;
}

const mockEnergyData = [
  { time: '8 AM', energy: 90, meeting: 'Focus Prep' },
  { time: '9 AM', energy: 75, meeting: 'Exec Sync' },
  { time: '11 AM', energy: 95, meeting: 'AI Clone Deep Work' },
  { time: '1 PM', energy: 70, meeting: '1:1 Arch Sync' },
  { time: '3 PM', energy: 85, meeting: 'All-Hands Product' },
  { time: '5 PM', energy: 60, meeting: 'Day Wrap' },
];

export const ChiefOfStaffView: React.FC<ChiefOfStaffViewProps> = ({ summary, onNavigateTab }) => {
  const [activeHorizon, setActiveHorizon] = useState<'today' | 'tomorrow' | 'week' | 'beyond'>('today');
  const [aiPrompt, setAiPrompt] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Good morning! I am your Chief of Staff AI. You have ${summary.topDirectives.length} high-priority directives today. How can I assist you with schedule optimization or strategic decisions?`,
    },
  ]);

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    setChatLog((prev) => [...prev, { role: 'user', text: userText }]);
    setAiPrompt('');

    setTimeout(() => {
      let aiReply = `Chief of Staff Advisory: Regarding "${userText}", my strategic directive is to protect your 10:30 AM focus block, delegate low-impact email responses to your team, and log the final outcome in your Local Knowledge Base.`;
      if (userText.toLowerCase().includes('email') || userText.toLowerCase().includes('outlook')) {
        aiReply = `Drafted strategic response for VIP email stream. Prioritize CEO Sarah's feedback on board slides 12-18 before 2 PM.`;
      } else if (userText.toLowerCase().includes('krisp') || userText.toLowerCase().includes('meeting')) {
        aiReply = `I extracted 2 decisions from your latest Krisp notes. Would you like me to sync them to Notion card #482?`;
      }
      setChatLog((prev) => [...prev, { role: 'assistant', text: aiReply }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Banner: Daily Tagline & Executive Focus */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-obsidian-900 to-purple-950/80 shadow-glow-indigo">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chief of Staff Daily Briefing</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
              {summary.dailyTagline}
            </h2>
            <p className="text-sm text-slate-300">
              Your AI Chief of Staff has synthesized your Outlook Calendar, Priority Emails, Notion Action Items, and Krisp Notes to maximize your influence today.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass-card p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-medium">Cal Density</span>
              <p className="text-xl font-extrabold text-cyan-400">{summary.calendarDensityPercentage}%</p>
            </div>
            <div className="glass-card p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-medium">Top Directives</span>
              <p className="text-xl font-extrabold text-indigo-400">{summary.topDirectives.length}</p>
            </div>
            <div className="glass-card p-3 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 font-medium">Focus Block</span>
              <p className="text-xl font-extrabold text-emerald-400">90 min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Top Directives & Energy Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Strategic Directives (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-base">Top Strategic Directives Today</h3>
            </div>
            <span className="text-xs text-indigo-400 font-medium">Auto-Synthesized</span>
          </div>

          <div className="space-y-3">
            {summary.topDirectives.map((directive, idx) => (
              <div
                key={idx}
                className="glass-card p-4 rounded-xl flex items-start gap-3 border border-indigo-500/20 hover:border-indigo-500/50"
              >
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-100">{directive}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-indigo-300 font-medium">Priority #1</span>
                    <span>•</span>
                    <span>Requires Executive Rationale</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('outlook')}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <span>Resolve</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Focus & Energy Curve */}
        <div className="glass-panel rounded-2xl p-5 space-y-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-base">Energy & Focus Density</h3>
              </div>
              <span className="text-xs text-cyan-400 font-semibold">Peak: 10:30 AM</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              AI recommendation: Schedule deep strategic thinking during your 10:30 AM focus window.
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEnergyData}>
                  <defs>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#11141D', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="energy" stroke="#22D3EE" strokeWidth={2} fillOpacity={1} fill="url(#energyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>Next Deep Work Window: 10:30 AM - 12:00 PM (Local Laptop KB Training)</span>
          </div>
        </div>
      </div>

      {/* Strategic Horizon Outlook Tabs (Today, Tomorrow, Week, Beyond) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-slate-100 text-lg">Strategic Horizon Outlook</h3>
          </div>

          {/* Horizon Switcher */}
          <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-slate-800">
            {(['today', 'tomorrow', 'week', 'beyond'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setActiveHorizon(h)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeHorizon === h
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {h === 'beyond' ? 'Beyond' : h}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {activeHorizon === 'today' && (
            <>
              <div className="glass-card p-4 rounded-xl space-y-3 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Must-Do Execution Items Today</span>
                </div>
                <ul className="space-y-2">
                  {summary.mustDoToday.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-4 rounded-xl space-y-3 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <ListTodo className="w-4 h-4" />
                  <span>Delegate or Defer Items</span>
                </div>
                <ul className="space-y-2">
                  {summary.delegateOrDefer.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeHorizon === 'tomorrow' && (
            <div className="col-span-2 glass-card p-4 rounded-xl space-y-3 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Calendar className="w-4 h-4" />
                <span>Tomorrow's Strategic Preparation Checklist</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {summary.tomorrowLookahead.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-obsidian-950/60 border border-slate-800 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-1">Step #{i + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeHorizon === 'week' && (
            <div className="col-span-2 glass-card p-4 rounded-xl space-y-3 border border-purple-500/20">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>This Week's Macro Strategic Goals</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {summary.weekLookahead.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-obsidian-950/60 border border-slate-800 text-xs text-slate-300">
                    <span className="text-purple-400 font-bold block mb-1">Goal #{i + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeHorizon === 'beyond' && (
            <div className="col-span-2 glass-card p-4 rounded-xl space-y-3 border border-gold-500/20">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Leadership Growth & Influence Beyond</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {summary.beyondLookahead.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-obsidian-950/60 border border-slate-800 text-xs text-slate-300">
                    <span className="text-amber-400 font-bold block mb-1">Pillar #{i + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive AI Chief of Staff Assistant Prompt */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-base">Chief of Staff Interactive AI Advisor</h3>
        </div>

        {/* Chat Stream */}
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 text-xs ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-xl ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-obsidian-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleSendPrompt} className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask your Chief of Staff to optimize schedule, draft email response, or analyze Krisp note..."
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-slate-100 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
