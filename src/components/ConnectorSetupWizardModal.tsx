import React, { useEffect, useState } from "react";
import {
  X,
  Shield,
  HelpCircle,
  ArrowRight,
  Key,
  AlertTriangle,
} from "lucide-react";
import { ConnectorItem } from "../types";
import {
  approachLabel,
  approachShortLabel,
} from "../services/connectorApproaches";
import {
  isSecretConfigKey,
  isSecretUnchanged,
} from "../services/secretsVault";

interface ConnectorSetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  connector: ConnectorItem | null;
  onSaveConnector: (connector: ConnectorItem) => void;
}

type SetupMode = "DEMO" | "CREDENTIALS";

export const ConnectorSetupWizardModal: React.FC<
  ConnectorSetupWizardModalProps
> = ({ isOpen, onClose, connector, onSaveConnector }) => {
  const supportsDemoIdp = connector?.authType === "IDP_OAUTH";
  const [activeMode, setActiveMode] = useState<SetupMode>("CREDENTIALS");
  const [demoLabel, setDemoLabel] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [hadSecrets, setHadSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!connector) return;
    setActiveMode(connector.authType === "IDP_OAUTH" ? "DEMO" : "CREDENTIALS");
    setDemoLabel(connector.connectedUser || "");
    const next: Record<string, string> = {};
    const secretsPresent: Record<string, boolean> = {};
    for (const field of connector.fieldsRequired) {
      const existing = connector.configValues?.[field.key];
      if (field.isSecret || isSecretConfigKey(field.key)) {
        secretsPresent[field.key] = Boolean(existing);
        next[field.key] = "";
      } else {
        next[field.key] = existing || "";
      }
    }
    setHadSecrets(secretsPresent);
    setFieldValues(next);
  }, [connector]);

  if (!isOpen || !connector) return null;

  const finishConnect = (patch: Partial<ConnectorItem>) => {
    const mergedConfig = { ...(connector.configValues || {}) };
    for (const [key, value] of Object.entries(fieldValues)) {
      if (isSecretConfigKey(key) || connector.fieldsRequired.find((f) => f.key === key)?.isSecret) {
        if (!isSecretUnchanged(value)) {
          mergedConfig[key] = value;
        }
        // blank → keep previous secret in vault via unchanged configValues key
      } else {
        mergedConfig[key] = value;
      }
    }

    onSaveConnector({
      ...connector,
      status: "Connected",
      lastSynced: "Local demo",
      connectionMode: "demo",
      liveVerified: false,
      configValues: mergedConfig,
      ...patch,
    });
    onClose();
  };

  const handleDemoEnable = (e: React.FormEvent) => {
    e.preventDefault();
    finishConnect({
      connectedUser: demoLabel.trim() || "Local demo user",
    });
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
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/30 text-[10px] font-bold">
                Local demo
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

        <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-100/90 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            This enables the tool locally only. There is no live OAuth or API
            verification yet — do not enter a real IdP password here.
          </span>
        </div>

        {supportsDemoIdp && (
          <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveMode("DEMO")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMode === "DEMO"
                  ? "brand-button shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Demo connect
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
              Store fields
            </button>
          </div>
        )}

        {activeMode === "DEMO" && supportsDemoIdp && (
          <form onSubmit={handleDemoEnable} className="space-y-3">
            <div className="p-3 rounded-xl glass-card border brand-border space-y-3">
              <p className="text-xs text-slate-300">
                Enable <strong>{connector.name}</strong> for local workspace
                surfaces. Optional label only — no password, no token exchange.
              </p>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Display label (optional)
                </label>
                <input
                  type="text"
                  value={demoLabel}
                  onChange={(e) => setDemoLabel(e.target.value)}
                  placeholder="e.g. Work account"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  autoFocus
                />
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
                className="px-5 py-2 rounded-xl brand-button font-bold text-xs flex items-center gap-2 brand-ring"
              >
                Enable local demo
                <ArrowRight className="w-3.5 h-3.5" />
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
              {connector.fieldsRequired.map((field, idx) => {
                const secret =
                  Boolean(field.isSecret) || isSecretConfigKey(field.key);
                return (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {field.label}
                      {secret && hadSecrets[field.key] && (
                        <span className="ml-2 text-[10px] text-slate-500 font-normal">
                          (saved — leave blank to keep)
                        </span>
                      )}
                    </label>
                    <input
                      type={secret ? "password" : "text"}
                      value={fieldValues[field.key] || ""}
                      onChange={(e) =>
                        setFieldValues({
                          ...fieldValues,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={
                        secret && hadSecrets[field.key]
                          ? "••••••••"
                          : field.placeholder
                      }
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                      autoFocus={idx === 0 && !supportsDemoIdp}
                      required={
                        !secret && idx === 0
                          ? true
                          : secret
                            ? !hadSecrets[field.key] && idx === 0
                            : false
                      }
                      autoComplete={secret ? "new-password" : "off"}
                    />
                  </div>
                );
              })}
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
                Save local demo
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
