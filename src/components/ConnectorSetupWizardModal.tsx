import React, { useEffect, useState } from "react";
import {
  X,
  Shield,
  HelpCircle,
  Lock,
  User,
  ArrowRight,
  Key,
} from "lucide-react";
import { ConnectorItem } from "../types";
import {
  approachLabel,
  approachShortLabel,
} from "../services/connectorApproaches";

interface ConnectorSetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  connector: ConnectorItem | null;
  onSaveConnector: (connector: ConnectorItem) => void;
}

type SetupMode = "IDP_LOGIN" | "CREDENTIALS";

export const ConnectorSetupWizardModal: React.FC<
  ConnectorSetupWizardModalProps
> = ({ isOpen, onClose, connector, onSaveConnector }) => {
  const supportsIdp = connector?.authType === "IDP_OAUTH";
  const [activeMode, setActiveMode] = useState<SetupMode>("CREDENTIALS");
  const [username, setUsername] = useState("alex.halliday@enterprise.com");
  const [password, setPassword] = useState("••••••••••••");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!connector) return;
    setActiveMode(connector.authType === "IDP_OAUTH" ? "IDP_LOGIN" : "CREDENTIALS");
    setFieldValues({ ...(connector.configValues || {}) });
    setIsAuthenticating(false);
  }, [connector]);

  if (!isOpen || !connector) return null;

  const finishConnect = (patch: Partial<ConnectorItem>) => {
    onSaveConnector({
      ...connector,
      status: "Connected",
      lastSynced: "Just now",
      configValues: { ...(connector.configValues || {}), ...fieldValues },
      ...patch,
    });
    onClose();
  };

  const handleIdpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      finishConnect({
        connectedUser: username || "user@enterprise.com",
      });
    }, 600);
  };

  const handleCredentialsSave = (e: React.FormEvent) => {
    e.preventDefault();
    finishConnect({});
  };

  const credentialsTitle =
    connector.authType === "WEBHOOK"
      ? "Webhook endpoint"
      : connector.authType === "MCP"
        ? "MCP server"
        : "API credentials";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border brand-border p-5 space-y-4 shadow-2xl relative">
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-100 text-base truncate">
                Connect {connector.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full brand-bg-soft brand-text border brand-border text-[10px] font-bold">
                {approachShortLabel(connector.approach)}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              {connector.description}
            </p>
            <p className="text-[10px] text-slate-500">
              {approachLabel(connector.approach)}
              {connector.surfaceRole ? ` · surface: ${connector.surfaceRole}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {supportsIdp && (
          <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveMode("IDP_LOGIN")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMode === "IDP_LOGIN"
                  ? "brand-button shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("CREDENTIALS")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMode === "CREDENTIALS"
                  ? "brand-button shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Manual fields
            </button>
          </div>
        )}

        {activeMode === "IDP_LOGIN" && supportsIdp && (
          <form onSubmit={handleIdpLogin} className="space-y-3">
            <div className="p-3 rounded-xl glass-card border brand-border space-y-3">
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <Shield className="w-4 h-4 brand-text shrink-0 mt-0.5" />
                <span>
                  Sign in with your {connector.ecosystem} account. OAuth tokens
                  are handled automatically.
                </span>
              </p>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
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
                className="px-5 py-2 rounded-xl brand-button font-bold text-xs flex items-center gap-2 brand-ring"
              >
                {isAuthenticating ? (
                  "Connecting…"
                ) : (
                  <>
                    Connect
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {activeMode === "CREDENTIALS" && (
          <form onSubmit={handleCredentialsSave} className="space-y-3">
            {connector.eli5Instructions.length > 0 && (
              <details className="rounded-xl border border-slate-800 bg-obsidian-950/60 open:pb-2">
                <summary className="px-3 py-2 text-xs font-semibold brand-text cursor-pointer flex items-center gap-1.5 list-none">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Setup help
                </summary>
                <ul className="px-3 pb-2 space-y-1 text-[11px] text-slate-300">
                  {connector.eli5Instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="brand-text font-bold">•</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {credentialsTitle}
              </p>
              {connector.fieldsRequired.map((field, idx) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    {field.label}
                  </label>
                  <input
                    type={field.isSecret ? "password" : "text"}
                    value={fieldValues[field.key] || ""}
                    onChange={(e) =>
                      setFieldValues({
                        ...fieldValues,
                        [field.key]: e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                    autoFocus={idx === 0 && !supportsIdp}
                    required={idx === 0}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl brand-button font-bold text-xs brand-ring flex items-center gap-1.5"
              >
                Connect
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
