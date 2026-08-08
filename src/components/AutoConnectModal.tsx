import React, { useState } from "react";
import {
  X,
  Cpu,
  Zap,
  Check,
  RefreshCw,
  Radio,
  Bot,
  Layers,
  Sparkles,
} from "lucide-react";
import { AutoConnectorSpec } from "../types";

interface AutoConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSystem: (connector: AutoConnectorSpec) => void;
}

export const MOCK_DISCOVERABLE_SYSTEMS: AutoConnectorSpec[] = [
  {
    id: "conn-1",
    name: "n8n Automation Engine",
    category: "Automation System",
    type: "n8n Workflow",
    endpoint: "http://localhost:5678",
    status: "Auto-Discovered",
    description:
      "Local n8n workflow orchestrator running 4 executive automation pipelines.",
    icon: "Share2",
    autoConnect: true,
  },
  {
    id: "conn-2",
    name: "Hermes Executive Agent",
    category: "Autonomous Agent",
    type: "Hermes Agent",
    endpoint: "http://localhost:8080/v1/hermes",
    status: "Auto-Discovered",
    description: "Autonomous research & strategic task delegation subagent.",
    icon: "Bot",
    autoConnect: true,
  },
  {
    id: "conn-3",
    name: "ClawCode & OpenClaw Orchestrator",
    category: "Autonomous Agent",
    type: "ClawCode",
    endpoint: "http://localhost:9090",
    status: "Auto-Discovered",
    description:
      "Local code synthesis & repository refactoring subagent system.",
    icon: "Code",
    autoConnect: true,
  },
  {
    id: "conn-4",
    name: "OpenAI ChatGPT API (v1)",
    category: "AI Model Platform",
    type: "ChatGPT",
    endpoint: "https://api.openai.com/v1",
    status: "Auto-Discovered",
    description: "GPT-4o & o3 model endpoints for complex reasoning.",
    icon: "Sparkles",
    autoConnect: true,
  },
  {
    id: "conn-5",
    name: "Anthropic Claude API",
    category: "AI Model Platform",
    type: "Claude",
    endpoint: "https://api.anthropic.com/v1",
    status: "Auto-Discovered",
    description:
      "Claude 3.7 Sonnet for executive document analysis and coding.",
    icon: "Sparkles",
    autoConnect: true,
  },
  {
    id: "conn-6",
    name: "Google Gemini API",
    category: "AI Model Platform",
    type: "Gemini",
    endpoint: "https://generativelanguage.googleapis.com",
    status: "Auto-Discovered",
    description: "Gemini 2.5 Pro multimodal reasoning endpoint.",
    icon: "Sparkles",
    autoConnect: true,
  },
];

export const AutoConnectModal: React.FC<AutoConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectSystem,
}) => {
  if (!isOpen) return null;

  const [systems, setSystems] = useState<AutoConnectorSpec[]>(
    MOCK_DISCOVERABLE_SYSTEMS,
  );
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
  };

  const handleToggleConnect = (id: string) => {
    const updated = systems.map((s) => {
      if (s.id === id) {
        const isConn = s.status === "Connected";
        const newStatus = isConn ? ("Idle" as const) : ("Connected" as const);
        const item = { ...s, status: newStatus };
        if (!isConn) onConnectSystem(item);
        return item;
      }
      return s;
    });
    setSystems(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border brand-border p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl brand-gradient brand-ring">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">
                Universal Model & Agent Auto-Connect Screen
              </h3>
              <p className="text-xs text-slate-400">
                Auto-discovers local ports, ChatGPT, Claude, Gemini, Hermes,
                ClawCode, OpenClaw & n8n.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Bar */}
        <div className="p-3.5 rounded-xl glass-card border brand-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
            <Sparkles className="w-4 h-4 brand-text" />
            <span>
              Scanning local machine ports (11434, 1234, 5678, 8080, 9090)...
            </span>
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-3.5 py-1.5 rounded-lg brand-button text-xs font-bold flex items-center gap-1.5 brand-ring transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`}
            />
            <span>{isScanning ? "Scanning..." : "Rescan Systems"}</span>
          </button>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {systems.map((sys) => {
            const isConn = sys.status === "Connected";
            return (
              <div
                key={sys.id}
                className={`p-4 rounded-xl glass-card border transition-all space-y-2 ${
                  isConn
                    ? "border-emerald-500/50 bg-emerald-950/20"
                    : "border-slate-800 hover:brand-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 brand-text" />
                    <h4 className="font-bold text-slate-100 text-sm">
                      {sys.name}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isConn
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "brand-bg-soft brand-text border brand-border"
                    }`}
                  >
                    {sys.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{sys.description}</p>
                <code className="text-[10px] p-1.5 rounded bg-obsidian-950 brand-text block font-mono truncate">
                  {sys.endpoint}
                </code>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleToggleConnect(sys.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      isConn
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "brand-button brand-ring"
                    }`}
                  >
                    {isConn ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <span>1-Click Auto-Connect</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl brand-button font-bold text-xs brand-ring"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
