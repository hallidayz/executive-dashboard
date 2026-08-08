import React, { useState } from 'react';
import { Bot, Sparkles, Shield, Send, Award, Target, Zap, Cpu, CheckCircle } from 'lucide-react';
import { KnowledgeEntry, LeadershipPersonaRule } from '../types';
import { simulateAICloneResponse } from '../services/chiefOfStaffEngine';

interface AILeadershipCloneProps {
  entries: KnowledgeEntry[];
  personaRules: LeadershipPersonaRule[];
  userName: string;
}

export const AILeadershipCloneView: React.FC<AILeadershipCloneProps> = ({
  entries,
  personaRules,
  userName,
}) => {
  const [scenarioInput, setScenarioInput] = useState('');
  const [simulationResult, setSimulationResult] = useState<{
    simulatedResponse: string;
    matchedRules: string[];
    strategicConfidence: number;
    recommendedAction: string;
  } | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioInput.trim()) return;

    const result = simulateAICloneResponse(scenarioInput, entries, personaRules, userName);
    setSimulationResult(result);
  };

  return (
    <div className="space-y-6">
      {/* Executive Persona Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 border brand-border bg-gradient-to-r from-obsidian-900 brand-ring">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full brand-bg-soft brand-text-secondary border brand-border text-xs font-semibold">
              <Bot className="w-4 h-4 brand-text-secondary" />
              <span>Personal Leadership AI Clone</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Executive Clone & Decision Simulation Engine
            </h2>
            <p className="text-sm text-slate-300">
              Simulates your leadership style, decision rationale, and strategic voice when you are not in the room. Trained on {entries.length} local laptop decision logs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="glass-card p-3 rounded-xl border brand-border text-center">
              <span className="text-[11px] text-slate-400 font-medium">Influence Score</span>
              <p className="text-2xl font-black brand-text-secondary">94/100</p>
            </div>
            <div className="glass-card p-3 rounded-xl border brand-border text-center">
              <span className="text-[11px] text-slate-400 font-medium">Logged Rules</span>
              <p className="text-2xl font-black brand-text">{personaRules.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Scenario Simulator & Persona Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Simulator ("What Would I Do?") (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 brand-text-secondary" />
              <h3 className="font-bold text-slate-100 text-base">"What Would I Do?" Scenario Testing</h3>
            </div>

            <form onSubmit={handleSimulate} className="space-y-3">
              <textarea
                rows={3}
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                placeholder="Enter an email, meeting dilemma, or strategic scenario (e.g. 'Engineering wants to delay Q3 release due to cloud migration costs')..."
                className="w-full px-4 py-3 rounded-xl glass-input text-xs resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl brand-gradient font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Cpu className="w-4 h-4" />
                <span>Simulate My Decision Stance</span>
              </button>
            </form>

            {/* Simulation Results */}
            {simulationResult && (
              <div className="p-5 rounded-2xl glass-card border brand-border space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold brand-text-secondary uppercase tracking-wider">
                    Simulated Executive Response
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full brand-bg-soft brand-text-secondary border brand-border text-[10px] font-bold">
                    Confidence: {simulationResult.strategicConfidence}%
                  </span>
                </div>

                <div className="text-xs text-slate-100 leading-relaxed font-sans whitespace-pre-line bg-obsidian-950 p-4 rounded-xl border border-slate-800">
                  {simulationResult.simulatedResponse}
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Persona Rules Applied</span>
                  <div className="space-y-1">
                    {simulationResult.matchedRules.map((rule, idx) => (
                      <div key={idx} className="text-xs brand-text-secondary flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 brand-text-secondary shrink-0" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Persona Trait Rules & Leadership Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-400" />
                <h3 className="font-bold text-slate-100 text-base">Leadership Persona Traits</h3>
              </div>
              <span className="text-xs text-gold-400 font-semibold">Trained Rules</span>
            </div>

            <div className="space-y-3">
              {personaRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl glass-card border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-100 text-sm">{rule.trait}</h4>
                    <span className="text-xs font-bold brand-text-secondary">{rule.influenceScore}% Alignment</span>
                  </div>
                  <p className="text-xs text-slate-300">{rule.ruleDescription}</p>
                  <div className="p-2.5 rounded-lg bg-obsidian-950 text-[11px] text-slate-400">
                    <span className="brand-text font-bold">Example: </span>
                    {rule.exampleScenario}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
