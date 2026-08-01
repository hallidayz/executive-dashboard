import React, { useState } from 'react';
import { X, Settings, Key, Shield, Power, Database, RefreshCw, Check } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onResetMockData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetMockData,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 p-6 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Executive Dashboard Settings</h3>
              <p className="text-xs text-slate-400">Configure API Keys, Auto-Start behavior, and integrations.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Windows Auto-Start Toggle */}
          <div className="p-4 rounded-xl glass-card border border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Power className="w-4 h-4" />
                <span>Windows Auto-Start on Boot</span>
              </span>
              <p className="text-[11px] text-slate-300">
                Launch the dashboard automatically whenever your computer boots up or restarts.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoStartOnBoot}
                onChange={(e) => setFormData({ ...formData, autoStartOnBoot: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Microsoft Graph / Outlook Settings */}
          <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Key className="w-4 h-4" />
              <span>Microsoft Graph / Outlook Integration</span>
            </span>
            <input
              type="text"
              value={formData.outlookClientId}
              onChange={(e) => setFormData({ ...formData, outlookClientId: e.target.value })}
              placeholder="Azure AD Client Application ID..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Notion API Settings */}
          <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              <span>Notion Integration Settings</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.notionApiKey}
                onChange={(e) => setFormData({ ...formData, notionApiKey: e.target.value })}
                placeholder="Notion Secret API Key (secret_...)"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
              <input
                type="text"
                value={formData.notionDatabaseId}
                onChange={(e) => setFormData({ ...formData, notionDatabaseId: e.target.value })}
                placeholder="Action Database ID..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* Local LLM / OpenAI API Settings */}
          <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Local / Custom LLM API Key (For Chief of Staff & AI Clone)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.customLlmEndpoint}
                onChange={(e) => setFormData({ ...formData, customLlmEndpoint: e.target.value })}
                placeholder="API Endpoint (e.g. http://localhost:11434)"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
              <input
                type="password"
                value={formData.customLlmApiKey}
                onChange={(e) => setFormData({ ...formData, customLlmApiKey: e.target.value })}
                placeholder="API Key (Optional for Ollama / Local)"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* User Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="Your Full Name..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
            <input
              type="text"
              value={formData.userTitle}
              onChange={(e) => setFormData({ ...formData, userTitle: e.target.value })}
              placeholder="Your Leadership Title..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                onResetMockData();
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
