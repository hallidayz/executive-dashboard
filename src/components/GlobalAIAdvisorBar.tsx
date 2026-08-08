import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Send,
  Zap,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import { ChiefOfStaffSummary } from "../types";

interface GlobalAIAdvisorBarProps {
  summary: ChiefOfStaffSummary;
  onNavigateTab: (tab: any) => void;
}

export const GlobalAIAdvisorBar: React.FC<GlobalAIAdvisorBarProps> = ({
  summary,
  onNavigateTab,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [chatLog, setChatLog] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: `Chief of Staff Advisory: ${summary.dailyTagline}`,
    },
  ]);

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    setChatLog((prev) => [...prev, { role: "user", text: userText }]);
    setAiPrompt("");

    setTimeout(() => {
      let reply = `Chief of Staff Co-Pilot: Regarding "${userText}", I recommend prioritizing your top 3 launch readiness blockers, protecting your 10:30 AM focus window, and logging the rationale in your Local KB.`;
      if (
        userText.toLowerCase().includes("email") ||
        userText.toLowerCase().includes("outlook")
      ) {
        reply = `Chief of Staff Co-Pilot: Analyzed priority emails. CEO Sarah's board deck request is top priority for 2 PM.`;
      } else if (
        userText.toLowerCase().includes("krisp") ||
        userText.toLowerCase().includes("notion")
      ) {
        reply = `Chief of Staff Co-Pilot: Extracted decisions from latest Krisp note are ready for Notion sync.`;
      }
      setChatLog((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 500);
  };

  return (
    <div className="glass-panel rounded-2xl border brand-border bg-gradient-to-r from-obsidian-900 p-4 brand-ring transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl brand-gradient p-0.5 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 brand-text animate-pulse" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">
                Chief of Staff AI Advisor
              </span>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full brand-bg-soft brand-text border brand-border uppercase">
                Live Co-Pilot
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate">
              {chatLog[chatLog.length - 1]?.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 transition-all"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isExpanded ? "Collapse" : "Ask AI"}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Prompt & Interactive Stream */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
          <form onSubmit={handleSendPrompt} className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask Chief of Staff AI to optimize schedule, draft email reply, or analyze product blockers..."
              className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl brand-button font-semibold text-xs flex items-center gap-1.5 brand-ring transition-all shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
