import React, { useState } from 'react';
import {
  X,
  Key,
  Shield,
  Check,
  HelpCircle,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Mail,
  Bot,
  MessageSquare,
  Code,
  FileText,
} from 'lucide-react';
import { ConnectorItem } from '../types';

interface ConnectorSetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  connector: ConnectorItem | null;
  onSaveConnector: (connector: ConnectorItem) => void;
}

export const ConnectorSetupWizardModal: React.FC<ConnectorSetupWizardModalProps> = ({
  isOpen,
  onClose,
  connector,
  onSaveConnector,
}) => {
  if (!isOpen || !connector) return null;

  const [activeMode, setActiveMode] = useState<'IDP_LOGIN' | 'ELI5_MANUAL'>('IDP_LOGIN');

  // IDP Login State
  const [username, setUsername] = useState('alex.halliday@enterprise.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Manual Form Field Values
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const handleIdpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      const updated: ConnectorItem = {
        ...connector,
        status: 'Connected',
        connectedUser: username || 'user@enterprise.com',
        lastSynced: 'Just now',
      };
      onSaveConnector(updated);
      onClose();
    }, 800);
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ConnectorItem = {
      ...connector,
      status: 'Connected',
      lastSynced: 'Just now',
    };
    onSaveConnector(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-indigo-500/40 p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-glow-indigo">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Setup Connector: {connector.name}</h3>
              <p className="text-xs text-slate-400">1-Click IDP OAuth Login or ELI5 Step-by-Step Credentials Helper.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex items-center gap-2 bg-obsidian-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('IDP_LOGIN')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'IDP_LOGIN'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>1-Click Sign In with IDP (Recommended)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('ELI5_MANUAL')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'ELI5_MANUAL'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ELI5 Step-by-Step Credentials</span>
          </button>
        </div>

        {/* MODE 1: 1-CLICK IDP OAUTH LOGIN SCREEN */}
        {activeMode === 'IDP_LOGIN' && (
          <form onSubmit={handleIdpLogin} className="space-y-4 pt-2">
            <div className="p-4 rounded-xl glass-card border border-indigo-500/30 space-y-3 bg-gradient-to-b from-indigo-950/40 to-obsidian-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span>{connector.ecosystem} Identity Provider (IDP) OAuth Screen</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Zero Technical Setup Required
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Log in with your normal username and password. We handle OAuth code exchange, Client ID generation, and token authorization automatically!
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 block">Username / Email Address</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. user@enterprise.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>
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
                disabled={isAuthenticating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                {isAuthenticating ? (
                  <span>Authenticating with IDP...</span>
                ) : (
                  <>
                    <span>Sign In & Connect Automatically</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: ELI5 STEP-BY-STEP MANUAL CREDENTIALS */}
        {activeMode === 'ELI5_MANUAL' && (
          <form onSubmit={handleManualSave} className="space-y-4 pt-2">
            {/* ELI5 Instructions Box */}
            <div className="p-4 rounded-xl bg-obsidian-950 border border-purple-500/30 space-y-2 text-xs">
              <span className="font-bold text-purple-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>ELI5 ("Explain Like I'm 5") Step-by-Step Guide</span>
              </span>
              <div className="space-y-1 text-slate-300">
                {connector.eli5Instructions.map((inst, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{inst}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Field Inputs */}
            <div className="space-y-3">
              {connector.fieldsRequired.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">{field.label}</label>
                  <input
                    type={field.isSecret ? 'password' : 'text'}
                    value={fieldValues[field.key] || ''}
                    onChange={(e) => setFieldValues({ ...fieldValues, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
              ))}
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
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
              >
                Save Credentials
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
