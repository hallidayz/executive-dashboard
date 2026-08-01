import React, { useState } from 'react';
import { Brain, Plus, Search, Tag, Shield, Star, Award, Layers } from 'lucide-react';
import { KnowledgeEntry } from '../types';

interface KnowledgeBaseProps {
  entries: KnowledgeEntry[];
  onAddEntry: (entry: KnowledgeEntry) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseProps> = ({ entries, onAddEntry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Decision' | 'Strategy' | 'Influence' | 'Reflection' | 'Framework'>('Decision');
  const [context, setContext] = useState('');
  const [decisionMade, setDecisionMade] = useState('');
  const [rationale, setRationale] = useState('');
  const [outcome, setOutcome] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !decisionMade) return;

    onAddEntry({
      id: `kb-${Date.now()}`,
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      context,
      decisionMade,
      rationale,
      outcome,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      impactRating: 5,
    });

    setTitle('');
    setContext('');
    setDecisionMade('');
    setRationale('');
    setOutcome('');
    setTagsInput('');
    setShowAddModal(false);
  };

  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags)));

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.decisionMade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.context.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || e.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header & Local Security Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">Local Laptop Knowledge Base</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                100% Offline & Secured
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tracks your strategic decisions, rationales, and influence outcomes locally on your laptop to train your executive AI clone.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Executive Decision</span>
        </button>
      </div>

      {/* Search & Tag Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search decisions, context, rationale..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto bg-obsidian-900/80 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto">
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              selectedTag === 'All' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedTag === tag ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Log Decision Form */}
      {showAddModal && (
        <form onSubmit={handleAddSubmit} className="glass-panel p-5 rounded-2xl border border-purple-500/40 space-y-3">
          <h4 className="font-bold text-purple-300 text-sm">Log New Executive Decision & Rationale</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Decision Title (e.g. Approved Local DB Architecture)..."
              className="px-3 py-2 rounded-xl glass-input text-xs"
            />
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input text-xs bg-obsidian-950"
            >
              <option value="Decision">Category: Decision</option>
              <option value="Strategy">Category: Strategy</option>
              <option value="Influence">Category: Influence</option>
              <option value="Reflection">Category: Reflection</option>
              <option value="Framework">Category: Framework</option>
            </select>
          </div>

          <textarea
            rows={2}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Context & Background situation..."
            className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
          />
          <textarea
            rows={2}
            value={decisionMade}
            onChange={(e) => setDecisionMade(e.target.value)}
            placeholder="Exact Decision Made & Stance..."
            className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
          />
          <textarea
            rows={2}
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Strategic Rationale & Trade-offs considered..."
            className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
          />
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Comma-separated tags (e.g. Privacy, Architecture, Leadership)..."
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500"
            >
              Save Decision Record
            </button>
          </div>
        </form>
      )}

      {/* Decision Entries Cards */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-purple-500/40 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                  {entry.category}
                </span>
                <h3 className="font-bold text-slate-100 text-base">{entry.title}</h3>
              </div>
              <span className="text-xs text-slate-400">{entry.date}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Context</span>
                <p className="text-slate-300">{entry.context}</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                <span className="text-[10px] font-bold text-purple-300 uppercase">Decision Made</span>
                <p className="text-purple-100 font-semibold">{entry.decisionMade}</p>
              </div>

              <div className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rationale</span>
                <p className="text-slate-300">{entry.rationale}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 pt-1">
              {entry.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
