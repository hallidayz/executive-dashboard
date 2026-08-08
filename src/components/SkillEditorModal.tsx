import React, { useState, useEffect } from 'react';
import { X, Zap, Sparkles, Code, Check, Bot, RefreshCw } from 'lucide-react';
import { CustomSkill } from '../types';

interface SkillEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillToEdit: CustomSkill | null;
  onSaveSkill: (skill: CustomSkill) => void;
}

export const SkillEditorModal: React.FC<SkillEditorModalProps> = ({
  isOpen,
  onClose,
  skillToEdit,
  onSaveSkill,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(skillToEdit);

  const [name, setName] = useState(skillToEdit?.name || '');
  const [category, setCategory] = useState<'Productivity' | 'Development' | 'Strategy' | 'Automation'>(
    skillToEdit?.category || 'Strategy'
  );
  const [description, setDescription] = useState(skillToEdit?.description || '');
  const [skillMdContent, setSkillMdContent] = useState(
    skillToEdit?.skillMdContent ||
      `# Executive Skill Instruction Set (SKILL.md)
---
name: Custom Skill
category: Strategy
---

## Instructions
- Trigger: Automatically when analyzing raw meeting transcripts or product cards
- Action: Extract strategic decision rationales & risk ratings
- Output: Format into Local Laptop Knowledge Base JSON schema.`
  );

  // AI Generator Prompt State (Gemini Gems / Claude / ChatGPT Style)
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name);
      setCategory(skillToEdit.category);
      setDescription(skillToEdit.description);
      setSkillMdContent(skillToEdit.skillMdContent);
    } else {
      setName('');
      setCategory('Strategy');
      setDescription('');
      setSkillMdContent(`# Executive Skill Instruction Set (SKILL.md)\n---\nname: New Custom Skill\n---\n\n## Instructions\n- Trigger: Automatically on executive directive\n- Action: Perform deep synthesis & log decision rationale.`);
    }
  }, [skillToEdit]);

  const handleGenerateWithAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const generatedName = aiPrompt.length > 25 ? `${aiPrompt.substring(0, 25)}...` : aiPrompt;
      setName(generatedName.charAt(0).toUpperCase() + generatedName.slice(1));
      setDescription(`AI-generated executive skill for: ${aiPrompt}`);
      setSkillMdContent(`# SKILL.md - ${generatedName}
---
name: ${generatedName}
category: ${category}
generatedBy: Chief of Staff AI Engine
---

## Executive Directive & Purpose
${aiPrompt}

## Trigger Rules
1. Automatically execute when user inputs raw transcripts or asks for product execution analysis.
2. Evaluate against top 3 quarterly OKRs and active blockers.

## Action & Output Schema
- Isolate context, core decision made, and trade-off rationale.
- Format response with high-impact executive summaries.
- Log output directly into Local Laptop Knowledge Base.`);

      setAiPrompt('');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const skill: CustomSkill = {
      id: skillToEdit ? skillToEdit.id : `skill-custom-${Date.now()}`,
      name,
      category,
      description: description || 'Custom executive skill',
      skillMdContent,
      enabled: skillToEdit ? skillToEdit.enabled : true,
      createdAt: skillToEdit ? skillToEdit.createdAt : new Date().toISOString().split('T')[0],
    };

    onSaveSkill(skill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border brand-border p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white brand-ring">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                {isEditing ? `Edit Skill: ${skillToEdit?.name}` : 'Create New Executive Skill (SKILL.md)'}
              </h3>
              <p className="text-xs text-slate-400">
                Define instructions or use AI to generate skills like Gemini Gems, Claude Custom Assistants, & ChatGPT GPTs.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI SKILL BUILDER / GENERATOR BOX (Gemini Gems / Claude / ChatGPT style) */}
        <div className="p-4 rounded-xl glass-card border brand-border brand-bg-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold brand-text-secondary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 brand-text-secondary animate-pulse" />
              <span>Generate / Refine Skill with AI (Gemini Gems & Claude Assistant Builder)</span>
            </span>
            <span className="text-[10px] brand-text-secondary font-semibold">AI Assistant Co-Pilot</span>
          </div>

          <form onSubmit={handleGenerateWithAI} className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe intent (e.g. 'Build a skill that parses Krisp notes and outputs board deck summaries')..."
              className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl brand-gradient font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating...' : '✨ Auto-Generate SKILL.md'}</span>
            </button>
          </form>
        </div>

        {/* Skill Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Skill Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Skill Name (e.g. Risk Evaluator)..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-obsidian-950"
              >
                <option value="Strategy">Strategy</option>
                <option value="Productivity">Productivity</option>
                <option value="Development">Development</option>
                <option value="Automation">Automation</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-level description of what this skill accomplishes..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold brand-text-secondary block flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 brand-text-secondary" />
              <span>SKILL.md Instruction Content</span>
            </label>
            <textarea
              rows={8}
              value={skillMdContent}
              onChange={(e) => setSkillMdContent(e.target.value)}
              placeholder="Write or edit markdown instructions..."
              className="w-full p-4 rounded-xl glass-input font-mono text-xs brand-text-secondary leading-relaxed resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl brand-secondary-fill font-bold text-xs shadow-md"
            >
              {isEditing ? 'Update Skill' : 'Save & Enable Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
