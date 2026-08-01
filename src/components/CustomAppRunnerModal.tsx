import React, { useState } from 'react';
import { X, Code, Play, Plus, Globe, Sparkles, Terminal } from 'lucide-react';
import { CustomAppSpec } from '../types';

interface CustomAppRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomApp: (app: CustomAppSpec) => void;
}

export const CustomAppRunnerModal: React.FC<CustomAppRunnerModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomApp,
}) => {
  if (!isOpen) return null;

  const [appName, setAppName] = useState('');
  const [appCategory, setAppCategory] = useState<'Custom App' | 'Productivity' | 'Automation' | 'Developer'>('Custom App');
  const [appDescription, setAppDescription] = useState('');
  const [appType, setAppType] = useState<'code' | 'iframe' | 'webhook'>('code');
  const [codeSnippet, setCodeSnippet] = useState(`<!-- Custom Executive Micro-App -->
<div style="font-family: sans-serif; color: #34d399; padding: 10px;">
  <h3>🚀 Custom Product Calculator</h3>
  <p>Run instant release velocity estimates right inside your dashboard!</p>
  <button onclick="alert('Release Velocity: 94% Green!')" style="background:#6366f1; color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer;">
    Calculate Velocity
  </button>
</div>`);
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName) return;

    const newApp: CustomAppSpec = {
      id: `custom-app-${Date.now()}`,
      name: appName,
      category: appCategory,
      description: appDescription || 'Custom executive mini-app',
      icon: 'Code',
      appType,
      codeSnippet: appType === 'code' ? codeSnippet : undefined,
      url: appType !== 'code' ? url : undefined,
      launchCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveCustomApp(newApp);
    setAppName('');
    setAppDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-amber-500/40 p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-base">Write & Launch Custom Executive App</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="App Name (e.g. Velocity Calculator)..."
              className="px-3 py-2 rounded-xl glass-input text-xs"
            />
            <select
              value={appCategory}
              onChange={(e: any) => setAppCategory(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input text-xs bg-obsidian-950"
            >
              <option value="Custom App">Category: Custom App</option>
              <option value="Productivity">Category: Productivity</option>
              <option value="Automation">Category: Automation</option>
              <option value="Developer">Category: Developer</option>
            </select>
          </div>

          <input
            type="text"
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            placeholder="App Description..."
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />

          <div className="flex items-center gap-2 bg-obsidian-900 p-1 rounded-xl border border-slate-800">
            {(['code', 'iframe', 'webhook'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAppType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  appType === t ? 'bg-amber-500 text-obsidian-950 shadow-md font-bold' : 'text-slate-400'
                }`}
              >
                {t === 'code' ? 'HTML/JS Code' : t === 'iframe' ? 'Embed IFrame' : 'Webhook URI'}
              </button>
            ))}
          </div>

          {appType === 'code' ? (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase">Write Custom HTML / JS Code</span>
              <textarea
                rows={6}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full p-3 rounded-xl glass-input font-mono text-xs text-amber-200 resize-none"
              />
            </div>
          ) : (
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter App Web URL or Webhook Endpoint..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          )}

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
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-gold"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Save & Launch App</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
