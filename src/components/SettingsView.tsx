import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  FileCode,
  Zap,
  Share2,
  Power,
  Plus,
  Check,
  RefreshCw,
  Globe,
  Key,
  Database,
  Terminal,
  Shield,
  ShieldCheck,
  Bot,
  Sliders,
  Code,
  Grid,
  List,
  Radio,
  Sparkles,
  Mail,
  MessageSquare,
  FileText,
  Search,
  Lock,
  ArrowRight,
  HelpCircle,
  CheckSquare,
  Edit3,
  Folder,
  Layers,
  Info,
  Save,
  X,
} from 'lucide-react';
import { AppSettings, AIProviderConfig, CustomSkill, AutoConnectorSpec, ConnectorItem, SystemDiscoveredSkill } from '../types';
import { AutoConnectModal } from './AutoConnectModal';
import { ConnectorSetupWizardModal } from './ConnectorSetupWizardModal';
import { SkillEditorModal } from './SkillEditorModal';
import { LocalFilePathBadge } from './LocalFilePathBadge';
import { INITIAL_CONNECTORS_CATALOG } from '../services/connectorsCatalog';
import { DISCOVERED_SYSTEM_SKILLS } from '../services/systemSkillsScanner';
import { saveSkillToPersistentStorage, getPersistentSkills } from '../services/knowledgeBaseSync';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetMockData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetMockData,
}) => {
  const [subTab, setSubTab] = useState<'skills' | 'connectors' | 'ai-models' | 'claude-md' | 'system'>('skills');
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSyncInfoTooltip, setShowSyncInfoTooltip] = useState(false);
  const [kbSyncMessage, setKbSyncMessage] = useState<string | null>(null);

  // System Discovered Skills State
  const [systemSkills, setSystemSkills] = useState<SystemDiscoveredSkill[]>(
    settings.discoveredSystemSkills && settings.discoveredSystemSkills.length > 0
      ? settings.discoveredSystemSkills
      : DISCOVERED_SYSTEM_SKILLS
  );
  const [selectedSystemSource, setSelectedSystemSource] = useState<string>('All Systems');
  const [isScanningSystem, setIsScanningSystem] = useState(false);

  // Connectors State
  const [connectorsList, setConnectorsList] = useState<ConnectorItem[]>(
    settings.connectors && settings.connectors.length > 0 ? settings.connectors : INITIAL_CONNECTORS_CATALOG
  );
  const [connectorEcosystem, setConnectorEcosystem] = useState<string>('All');
  const [connectorSearch, setConnectorSearch] = useState('');
  const [selectedConnectorForSetup, setSelectedConnectorForSetup] = useState<ConnectorItem | null>(null);

  // TOP-LEVEL SKILLS VIEW MODE (TILES GRID VS COMPACT LIST)
  const [skillsViewMode, setSkillsViewMode] = useState<'grid' | 'list'>('grid');

  // Unified Skill Editor Modal State
  const [showSkillEditor, setShowSkillEditor] = useState(false);
  const [editingSkill, setEditingSkill] = useState<CustomSkill | null>(null);

  // AI Provider Form & Auto Connect Modal State
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [showAutoConnectModal, setShowAutoConnectModal] = useState(false);

  const [providerType, setProviderType] = useState<AIProviderConfig['provider']>('Ollama (Local)');
  const [providerEndpoint, setProviderEndpoint] = useState('http://localhost:11434');
  const [providerModel, setProviderModel] = useState('llama3.3:70b');
  const [providerApiKey, setProviderApiKey] = useState('');

  // Listen for real-time bi-directional Knowledge Base skill updates
  useEffect(() => {
    const handleKnowledgeBaseSync = (e: any) => {
      if (e.detail) {
        setFormData((prev) => ({ ...prev, customSkills: e.detail }));
      }
    };
    window.addEventListener('knowledge_base_skill_sync', handleKnowledgeBaseSync);
    return () => window.removeEventListener('knowledge_base_skill_sync', handleKnowledgeBaseSync);
  }, []);

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = { ...formData, connectors: connectorsList, discoveredSystemSkills: systemSkills };
    onSaveSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1200);
  };

  const handleSyncSkillsToKnowledgeBase = () => {
    (formData.customSkills || []).forEach((s) => {
      saveSkillToPersistentStorage(s);
    });
    setKbSyncMessage('All skills successfully upserted & synced to Knowledge Base!');
    setTimeout(() => setKbSyncMessage(null), 2500);
  };

  const handleScanSystem = () => {
    setIsScanningSystem(true);
    setTimeout(() => {
      setIsScanningSystem(false);
      setSystemSkills(DISCOVERED_SYSTEM_SKILLS);
    }, 700);
  };

  const handleSaveConnector = (updatedConnector: ConnectorItem) => {
    const updatedList = connectorsList.map((c) => (c.id === updatedConnector.id ? updatedConnector : c));
    setConnectorsList(updatedList);
    const updatedSettings = { ...formData, connectors: updatedList };
    setFormData(updatedSettings);
    onSaveSettings(updatedSettings);
  };

  const handleSaveSkill = (savedSkill: CustomSkill) => {
    const updatedPersistentSkills = saveSkillToPersistentStorage(savedSkill);
    const updated = { ...formData, customSkills: updatedPersistentSkills };
    setFormData(updated);
    onSaveSettings(updated);

    setKbSyncMessage(`Skill '${savedSkill.name}' upserted into Knowledge Base!`);
    setTimeout(() => setKbSyncMessage(null), 2500);
  };

  const handleOpenCreateSkill = () => {
    setEditingSkill(null);
    setShowSkillEditor(true);
  };

  const handleOpenEditSkill = (skill: CustomSkill) => {
    setEditingSkill(skill);
    setShowSkillEditor(true);
  };

  const handleAddAIProvider = (e: React.FormEvent) => {
    e.preventDefault();

    const prov: AIProviderConfig = {
      id: `prov-${Date.now()}`,
      provider: providerType,
      endpoint: providerEndpoint,
      selectedModel: providerModel,
      apiKey: providerApiKey || undefined,
      isDefault: false,
      connected: true,
    };

    const updated = { ...formData, aiProviders: [...(formData.aiProviders || []), prov] };
    setFormData(updated);
    onSaveSettings(updated);
    setShowAddProviderModal(false);
  };

  const handleAutoConnectSystem = (connector: AutoConnectorSpec) => {
    const prov: AIProviderConfig = {
      id: `prov-auto-${connector.id}`,
      provider: connector.name as any,
      endpoint: connector.endpoint,
      selectedModel: connector.type,
      isDefault: false,
      connected: true,
    };

    const updated = { ...formData, aiProviders: [...(formData.aiProviders || []), prov] };
    setFormData(updated);
    onSaveSettings(updated);
  };

  const toggleSkill = (id: string) => {
    const updatedSkills = (formData.customSkills || []).map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    const updated = { ...formData, customSkills: updatedSkills };
    setFormData(updated);
    onSaveSettings(updated);
  };

  const setDefaultProvider = (id: string) => {
    const updatedProviders = (formData.aiProviders || []).map((p) => ({
      ...p,
      isDefault: p.id === id,
    }));
    const updated = { ...formData, aiProviders: updatedProviders };
    setFormData(updated);
    onSaveSettings(updated);
  };

  const getConnectorIcon = (icon: string) => {
    switch (icon) {
      case 'Mail': return <Mail className="w-5 h-5 text-cyan-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-indigo-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'Code': return <Code className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-gold-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Database': return <Database className="w-5 h-5 text-purple-300" />;
      case 'CheckSquare': return <CheckSquare className="w-5 h-5 text-cyan-300" />;
      case 'Shield': return <Shield className="w-5 h-5 text-rose-400" />;
      default: return <Share2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filteredSystemSkills = systemSkills.filter(
    (s) => selectedSystemSource === 'All Systems' || s.sourceSystem === selectedSystemSource
  );

  const filteredConnectors = connectorsList.filter((c) => {
    const matchesEco = connectorEcosystem === 'All' || c.ecosystem === connectorEcosystem;
    const matchesSearch = c.name.toLowerCase().includes(connectorSearch.toLowerCase()) || c.description.toLowerCase().includes(connectorSearch.toLowerCase());
    return matchesEco && matchesSearch;
  });

  const ecosystemsList = ['All', 'Microsoft', 'Claude', 'ChatGPT', 'Google', 'n8n', 'Enterprise SaaS', 'Developer & Data'];
  const systemSourcesList = ['All Systems', 'Antigravity', 'Claude', 'Gemini', 'Cursor', 'ChatGPT', 'Perplexity', 'Google AI Studio'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-obsidian-900 via-indigo-950/60 to-purple-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Robust Settings & AI Architecture Hub</h2>
            <p className="text-xs text-slate-400">Persistent Knowledge Base skill storage & System Plugin Scanner across all AI tools.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAutoConnectModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse text-indigo-200" />
            <span>Auto-Connect Screen</span>
          </button>

          <button
            onClick={() => handleSaveAll()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>All Saved!</span>
              </>
            ) : (
              <span>Save Config</span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center justify-between bg-obsidian-900/90 p-1.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'skills', label: '⚡ Skills & System Plugins Hub', icon: <Zap className="w-4 h-4" /> },
            { id: 'connectors', label: '🔌 Connectors', icon: <Share2 className="w-4 h-4" /> },
            { id: 'ai-models', label: '🤖 AI Models & Local Machine', icon: <Cpu className="w-4 h-4" /> },
            { id: 'claude-md', label: '📜 CLAUDE.md & Instructions', icon: <FileCode className="w-4 h-4" /> },
            { id: 'system', label: '⚙️ System & Auto-Start', icon: <Power className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSubTab(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                subTab === item.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* TOP-LEVEL TILES GRID VS COMPACT LIST VIEW TOGGLE FOR SKILLS TAB */}
        {subTab === 'skills' && (
          <div className="flex items-center gap-1 bg-obsidian-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setSkillsViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                skillsViewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Global Tile Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Tiles</span>
            </button>
            <button
              onClick={() => setSkillsViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                skillsViewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Global Compact List View"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        )}
      </div>

      {/* SUB-TAB 3: SKILLS & SYSTEM PLUGINS HUB */}
      {subTab === 'skills' && (
        <div className="space-y-6">
          {/* SYNC NOTIFICATION BANNER */}
          {kbSyncMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-bold flex items-center gap-2 shadow-lg animate-pulse">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{kbSyncMessage}</span>
            </div>
          )}

          {/* SECTION 1: LOCAL SYSTEM DISCOVERED PLUGINS & SKILLS */}
          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100 text-base">Local Laptop System Installed Skills & Plugins</h3>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                    Scanned from Local Laptop Filesystem
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Plugins & Skills detected across Claude, ChatGPT, Perplexity, Gemini, Antigravity SDK, Cursor, & Google AI Studio.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleScanSystem}
                  disabled={isScanningSystem}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningSystem ? 'animate-spin' : ''}`} />
                  <span>{isScanningSystem ? 'Scanning System...' : '🔍 Scan Local Filesystem'}</span>
                </button>
              </div>
            </div>

            {/* System Source Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto bg-obsidian-900 p-1 rounded-xl border border-slate-800">
              {systemSourcesList.map((src) => (
                <button
                  key={src}
                  onClick={() => setSelectedSystemSource(src)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSystemSource === src ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>

            {/* Discovered System Skills (Grid vs Single-Row List View) */}
            {skillsViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSystemSkills.map((sysSkill) => (
                  <div
                    key={sysSkill.id}
                    className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                          {sysSkill.sourceSystem}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Installed</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-100 text-sm">{sysSkill.name}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{sysSkill.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold">Local Path:</span>
                      <LocalFilePathBadge path={sysSkill.path} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* SINGLE-ROW COMPACT LIST VIEW FOR SYSTEM SKILLS */
              <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
                {filteredSystemSkills.map((sysSkill) => (
                  <div key={sysSkill.id} className="p-3 hover:bg-slate-800/40 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold shrink-0">
                        {sysSkill.sourceSystem}
                      </span>
                      <h4 className="font-bold text-slate-100 text-xs shrink-0">{sysSkill.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate flex-1 min-w-0" title={sysSkill.description}>
                        {sysSkill.description}
                      </p>
                    </div>

                    <LocalFilePathBadge path={sysSkill.path} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: CUSTOM EXECUTIVE SKILLS (WITH SINGLE-ROW LIST VIEW & OPEN FOLDER BADGE) */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100 text-base">Custom Executive Skills (SKILL.md)</h3>
                  
                  {/* (i) HELP ICON BUTTON */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSyncInfoTooltip(!showSyncInfoTooltip)}
                      className="p-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/40 transition-all"
                      title="Click for Storage & Sync Info"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {/* TOOLTIP EXPLANATION BOX */}
                    {showSyncInfoTooltip && (
                      <div className="absolute left-0 top-6 z-40 w-80 p-3.5 rounded-xl glass-panel border border-purple-500/50 bg-obsidian-950/95 text-xs space-y-1.5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                          <span className="font-bold text-purple-300 flex items-center gap-1">
                            <Database className="w-3.5 h-3.5" />
                            <span>Persistent Storage & Sync</span>
                          </span>
                          <button onClick={() => setShowSyncInfoTooltip(false)} className="text-slate-400 hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-200 leading-relaxed">
                          ℹ️ All newly created or edited skills are automatically saved & upserted to your <strong>Local Laptop Knowledge Base & Storage Engine</strong>. When skills are updated by another tool (Claude, Cursor, Antigravity), changes sync in real-time!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400">Create, edit, or auto-generate skills with AI (Gemini Gems & Claude Custom Assistants).</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncSkillsToKnowledgeBase}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 text-purple-200 border border-purple-500/40 hover:bg-purple-600/50 font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Upsert & update skills to Knowledge Base"
                >
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>Sync to Knowledge Base</span>
                </button>

                <button
                  onClick={handleOpenCreateSkill}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create / Build with AI</span>
                </button>
              </div>
            </div>

            {/* SKILLS TILES GRID VIEW VS SINGLE-ROW LIST VIEW */}
            {skillsViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(formData.customSkills || []).map((skill) => (
                  <div
                    key={skill.id}
                    className={`p-5 rounded-2xl glass-card border transition-all space-y-3 ${
                      skill.enabled ? 'border-purple-500/40 bg-purple-950/10' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <h4 className="font-bold text-slate-100 text-sm">{skill.name}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditSkill(skill)}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
                          title="Edit Skill & SKILL.md"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => toggleSkill(skill.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            skill.enabled
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {skill.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">{skill.description}</p>

                    <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800 font-mono text-[11px] text-purple-200 overflow-x-auto">
                      <span className="text-slate-500 font-bold block mb-1">SKILL.md Definition:</span>
                      <pre className="whitespace-pre-wrap">{skill.skillMdContent}</pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* SINGLE-ROW COMPACT LIST VIEW FOR CUSTOM SKILLS */
              <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
                {(formData.customSkills || []).map((skill) => (
                  <div key={skill.id} className="p-3.5 hover:bg-slate-800/40 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                      <h4 className="font-bold text-slate-100 text-xs shrink-0">{skill.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate flex-1 min-w-0" title={skill.description}>
                        {skill.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-purple-300 text-[10px] font-semibold">
                        {skill.category}
                      </span>
                      <button
                        onClick={() => handleOpenEditSkill(skill)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => toggleSkill(skill.id)}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                          skill.enabled
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {skill.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: CONNECTORS (All legally vetted enterprise connectors) */}
      {subTab === 'connectors' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            {/* Header & Filter Pills */}
            <div className="flex flex-col space-y-3 border-b border-slate-800 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-base">Legally Vetted Enterprise Connectors Catalog</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>SOC2 / GDPR Verified</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Connectors for Microsoft Graph, Anthropic Claude, OpenAI ChatGPT, Google Workspace, n8n, Enterprise SaaS, & Data.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={connectorSearch}
                    onChange={(e) => setConnectorSearch(e.target.value)}
                    placeholder="Search all connectors..."
                    className="pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs w-56"
                  />
                </div>
              </div>

              {/* Ecosystem Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto bg-obsidian-900 p-1 rounded-xl border border-slate-800">
                {ecosystemsList.map((eco) => (
                  <button
                    key={eco}
                    onClick={() => setConnectorEcosystem(eco)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      connectorEcosystem === eco ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {eco}
                  </button>
                ))}
              </div>
            </div>

            {/* Connectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnectors.map((c) => {
                const isConn = c.status === 'Connected';
                return (
                  <div
                    key={c.id}
                    className={`p-5 rounded-2xl glass-card border transition-all space-y-3 flex flex-col justify-between ${
                      isConn ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-obsidian-950 border border-slate-800 shrink-0">
                            {getConnectorIcon(c.icon)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100 text-sm">{c.name}</h4>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">{c.ecosystem}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            isConn
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {isConn ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

                      <div className="p-2 rounded-lg bg-obsidian-950/80 border border-slate-800 text-[10px] text-emerald-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{c.complianceCert}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 space-y-2">
                      {isConn && c.connectedUser && (
                        <span className="text-[11px] text-emerald-400 font-medium block truncate">
                          User: <strong>{c.connectedUser}</strong>
                        </span>
                      )}

                      <button
                        onClick={() => setSelectedConnectorForSetup(c)}
                        className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isConn
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isConn ? 'Reconfigure IDP' : 'Sign In with IDP'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: AI MODELS & LOCAL MACHINE */}
      {subTab === 'ai-models' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-base">AI Model Provider Configuration</h3>
                <p className="text-xs text-slate-400">Configure local machine models (Ollama, LM Studio) or cloud AI providers (Claude, OpenAI, Gemini).</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAutoConnectModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Auto-Connect Screen</span>
                </button>
                <button
                  onClick={() => setShowAddProviderModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add AI Provider</span>
                </button>
              </div>
            </div>

            {/* Provider Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.aiProviders || []).map((prov) => (
                <div
                  key={prov.id}
                  className={`p-5 rounded-2xl glass-card border transition-all space-y-3 ${
                    prov.isDefault
                      ? 'border-indigo-500/50 bg-indigo-950/20 shadow-glow-indigo'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-bold text-slate-100 text-sm">{prov.provider}</h4>
                    </div>
                    {prov.isDefault ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                        Default Engine
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultProvider(prov.id)}
                        className="text-[11px] text-slate-400 hover:text-indigo-300 underline font-semibold"
                      >
                        Set Default
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 block">Endpoint URL:</span>
                    <code className="p-2 rounded-lg bg-obsidian-950 border border-slate-800 block text-indigo-300 font-mono text-[11px] truncate">
                      {prov.endpoint}
                    </code>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Model: <strong className="text-slate-100">{prov.selectedModel}</strong></span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CLAUDE.MD & SYSTEM INSTRUCTIONS */}
      {subTab === 'claude-md' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-100 text-base">CLAUDE.md & System Instructions Editor</h3>
              <p className="text-xs text-slate-400">Directly edit `CLAUDE.md` and custom executive directives for your Chief of Staff AI.</p>
            </div>
            <button
              onClick={() => handleSaveAll()}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Save CLAUDE.md
            </button>
          </div>

          <textarea
            rows={14}
            value={formData.claudeMdContent}
            onChange={(e) => setFormData({ ...formData, claudeMdContent: e.target.value })}
            className="w-full p-4 rounded-xl glass-input font-mono text-xs text-slate-200 leading-relaxed resize-none"
          />
        </div>
      )}

      {/* SUB-TAB 5: SYSTEM & AUTO-START */}
      {subTab === 'system' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-base">System Preferences & Auto-Start</h3>
            <p className="text-xs text-slate-400">Configure Windows startup settings and local laptop data storage.</p>
          </div>

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

          <div className="pt-2 flex justify-start">
            <button
              onClick={onResetMockData}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      )}

      {/* SETUP CONNECTOR WIZARD MODAL */}
      <ConnectorSetupWizardModal
        isOpen={Boolean(selectedConnectorForSetup)}
        onClose={() => setSelectedConnectorForSetup(null)}
        connector={selectedConnectorForSetup}
        onSaveConnector={handleSaveConnector}
      />

      {/* UNIFIED CREATE & EDIT SKILL MODAL (WITH AI GENERATOR) */}
      <SkillEditorModal
        isOpen={showSkillEditor}
        onClose={() => setShowSkillEditor(false)}
        skillToEdit={editingSkill}
        onSaveSkill={handleSaveSkill}
      />

      {/* ADD AI PROVIDER MODAL */}
      {showAddProviderModal && (
        <form onSubmit={handleAddAIProvider} className="glass-panel p-5 rounded-2xl border border-indigo-500/40 space-y-3">
          <h4 className="font-bold text-indigo-300 text-sm">Add New AI Model Provider</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={providerType}
              onChange={(e: any) => setProviderType(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input text-xs bg-obsidian-950"
            >
              <option value="Ollama (Local)">Ollama (Local Machine)</option>
              <option value="LM Studio (Local)">LM Studio (Local Machine)</option>
              <option value="Anthropic Claude">Anthropic Claude</option>
              <option value="OpenAI">OpenAI</option>
              <option value="Google Gemini">Google Gemini</option>
              <option value="Custom Local GPU">Custom Local GPU</option>
            </select>

            <input
              type="text"
              required
              value={providerEndpoint}
              onChange={(e) => setProviderEndpoint(e.target.value)}
              placeholder="Endpoint URL..."
              className="px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={providerModel}
              onChange={(e) => setProviderModel(e.target.value)}
              placeholder="Model Name..."
              className="px-3 py-2 rounded-xl glass-input text-xs"
            />
            <input
              type="password"
              value={providerApiKey}
              onChange={(e) => setProviderApiKey(e.target.value)}
              placeholder="API Key..."
              className="px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddProviderModal(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
            >
              Connect AI Provider
            </button>
          </div>
        </form>
      )}

      {/* AUTO CONNECT SCREEN MODAL */}
      <AutoConnectModal
        isOpen={showAutoConnectModal}
        onClose={() => setShowAutoConnectModal(false)}
        onConnectSystem={handleAutoConnectSystem}
      />
    </div>
  );
};
