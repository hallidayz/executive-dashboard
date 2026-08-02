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
  Download,
  Upload,
  Monitor,
  Sun,
  Moon,
  Laptop,
  User,
  ImagePlus,
  Palette,
  Wand2,
} from 'lucide-react';
import {
  AppSettings,
  AIProviderConfig,
  CustomSkill,
  AutoConnectorSpec,
  ConnectorItem,
  SystemDiscoveredSkill,
  ThemePreference,
  BrandIntensity,
  BrandPresetId,
  FontPresetId,
  WidgetConfig,
  WorkspacePreset,
  SidebarNavId,
} from '../types';
import {
  BRAND_PRESETS,
  FONT_PRESETS,
  applyBranding,
  contrastOnAccent,
  stopsFromPair,
  suggestFontColorFromAccent,
} from '../services/brandingService';
import { applyThemePreference } from '../services/themeService';
import { hsvaToHex, isCompleteHex, normalizeHex } from '../services/colorUtils';
import { AutoConnectModal } from './AutoConnectModal';
import { ConnectorSetupWizardModal } from './ConnectorSetupWizardModal';
import { SkillEditorModal } from './SkillEditorModal';
import { LocalFilePathBadge } from './LocalFilePathBadge';
import { WorkspaceLayoutSettings } from './WorkspaceLayoutSettings';
import { ColorHexRow } from './ColorPickerPopover';
import { INITIAL_CONNECTORS_CATALOG } from '../services/connectorsCatalog';
import {
  detectHostPlatform,
  getDiscoveredSystemSkills,
  getHomeDirectory,
} from '../services/systemSkillsScanner';
import { saveSkillToPersistentStorage } from '../services/knowledgeBaseSync';
import { storageService } from '../services/storageService';

type SettingsSubTab =
  | 'general'
  | 'workspace'
  | 'skills'
  | 'connectors'
  | 'ai-models'
  | 'claude-md'
  | 'system';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetMockData: () => void;
  onReloadWorkspace?: () => void;
  onUpdateWidgets: (widgets: WidgetConfig[]) => void;
  onReorderModules: (order: SidebarNavId[]) => void;
  onSelectPreset: (preset: WorkspacePreset) => void;
  /** Open a specific settings sub-tab (e.g. from Command Center customize). */
  initialSubTab?: SettingsSubTab;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetMockData,
  onReloadWorkspace,
  onUpdateWidgets,
  onReorderModules,
  onSelectPreset,
  initialSubTab,
}) => {
  const [subTab, setSubTab] = useState<SettingsSubTab>(initialSubTab || 'general');

  useEffect(() => {
    if (initialSubTab) setSubTab(initialSubTab);
  }, [initialSubTab]);
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSyncInfoTooltip, setShowSyncInfoTooltip] = useState(false);
  const [kbSyncMessage, setKbSyncMessage] = useState<string | null>(null);
  const [workspaceTransferMessage, setWorkspaceTransferMessage] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [showPaletteHelp, setShowPaletteHelp] = useState(false);
  const hostPlatform = detectHostPlatform();
  const homeDirectory = getHomeDirectory();

  // System Discovered Skills State
  const [systemSkills, setSystemSkills] = useState<SystemDiscoveredSkill[]>(
    settings.discoveredSystemSkills && settings.discoveredSystemSkills.length > 0
      ? settings.discoveredSystemSkills
      : getDiscoveredSystemSkills()
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

  // Global settings density: tiles (grid) vs compact list — applies to all sub-tabs
  const [settingsViewMode, setSettingsViewMode] = useState<'grid' | 'list'>('grid');

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
    // Full personalization pack: theme mode + brand colors/buttons + fonts across the app.
    applyThemePreference(updated.theme || 'system');
    applyBranding(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1600);
  };

  const handleSavePersonalization = () => {
    handleSaveAll();
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
      // Rebuild paths for the current OS / VITE_HOME_DIR (still mock discovery).
      setSystemSkills(getDiscoveredSystemSkills());
    }, 700);
  };

  const handleExportWorkspace = () => {
    const payload = storageService.exportWorkspace();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exec-dash-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setWorkspaceTransferMessage('Workspace exported — copy this file to your other machine and Import.');
    setTimeout(() => setWorkspaceTransferMessage(null), 3500);
  };

  const handleImportWorkspace = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const ok = storageService.importWorkspace(parsed);
        if (!ok) {
          setWorkspaceTransferMessage('Import failed — file is not a valid workspace export.');
          setTimeout(() => setWorkspaceTransferMessage(null), 3500);
          return;
        }
        onReloadWorkspace?.();
        const next = storageService.getSettings();
        setFormData({ ...next });
        setSystemSkills(
          next.discoveredSystemSkills && next.discoveredSystemSkills.length > 0
            ? next.discoveredSystemSkills
            : getDiscoveredSystemSkills()
        );
        setConnectorsList(
          next.connectors && next.connectors.length > 0
            ? next.connectors
            : INITIAL_CONNECTORS_CATALOG
        );
        setWorkspaceTransferMessage('Workspace imported. Settings and mock data reloaded from file.');
        setTimeout(() => setWorkspaceTransferMessage(null), 3500);
      } catch {
        setWorkspaceTransferMessage('Import failed — could not parse JSON.');
        setTimeout(() => setWorkspaceTransferMessage(null), 3500);
      }
    };
    reader.readAsText(file);
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

  const persistPartial = (patch: Partial<AppSettings>) => {
    const updated = { ...formData, ...patch };
    setFormData(updated);
    onSaveSettings({ ...updated, connectors: connectorsList, discoveredSystemSkills: systemSkills });
    applyBranding(updated);
  };

  const applyThemeChoice = (theme: ThemePreference) => {
    persistPartial({ theme });
  };

  const applyBrandPreset = (presetId: BrandPresetId) => {
    const preset = BRAND_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    persistPartial({
      brandPreset: preset.id,
      accentColor: preset.accent,
      accentSecondary: preset.secondary,
      primaryContrastColor: preset.primaryContrast || contrastOnAccent(preset.accent),
      primaryFontColor: preset.font,
      primaryFontLinked: true,
      secondaryContrastColor: preset.secondaryContrast || contrastOnAccent(preset.secondary),
      secondaryFontColor: preset.secondaryFont,
      secondaryFontLinked: true,
      brandGradientStops: stopsFromPair(preset.accent, preset.secondary),
    });
  };

  type BrandColorField =
    | 'accentColor'
    | 'accentSecondary'
    | 'primaryFontColor'
    | 'secondaryFontColor'
    | 'primaryContrastColor'
    | 'secondaryContrastColor';

  const applyBrandColor = (field: BrandColorField, raw: string) => {
    if (!isCompleteHex(raw)) {
      setFormData((prev) => ({ ...prev, [field]: raw }));
      return;
    }
    const fallback =
      field === 'accentSecondary'
        ? '#9333EA'
        : field === 'primaryFontColor'
          ? '#818CF8'
          : field === 'secondaryFontColor'
            ? '#C084FC'
            : field === 'primaryContrastColor' || field === 'secondaryContrastColor'
              ? '#FFFFFF'
              : '#6366F1';
    const hex = normalizeHex(raw, fallback);
    const accent = field === 'accentColor' ? hex : formData.accentColor || '#6366F1';
    const secondary = field === 'accentSecondary' ? hex : formData.accentSecondary || '#9333EA';
    const patch: Partial<AppSettings> = {
      brandPreset: 'custom',
      [field]: hex,
      brandGradientStops: stopsFromPair(accent, secondary),
    };

    // Contrast always complements the fill; font only when still linked.
    if (field === 'accentColor') {
      patch.primaryContrastColor = contrastOnAccent(hex);
      if (formData.primaryFontLinked !== false) {
        patch.primaryFontColor = suggestFontColorFromAccent(hex);
        patch.primaryFontLinked = true;
      }
    }
    if (field === 'accentSecondary') {
      patch.secondaryContrastColor = contrastOnAccent(hex);
      if (formData.secondaryFontLinked !== false) {
        patch.secondaryFontColor = suggestFontColorFromAccent(hex);
        patch.secondaryFontLinked = true;
      }
    }
    if (field === 'primaryFontColor') {
      patch.primaryFontLinked = false;
    }
    if (field === 'secondaryFontColor') {
      patch.secondaryFontLinked = false;
    }
    persistPartial(patch);
  };

  const relinkPrimaryFont = (mode: 'tint' | 'contrast') => {
    const accent = formData.accentColor || '#6366F1';
    persistPartial({
      brandPreset: 'custom',
      primaryFontLinked: true,
      primaryFontColor:
        mode === 'contrast'
          ? formData.primaryContrastColor || contrastOnAccent(accent)
          : suggestFontColorFromAccent(accent),
    });
  };

  const relinkSecondaryFont = (mode: 'tint' | 'contrast') => {
    const secondary = formData.accentSecondary || '#9333EA';
    persistPartial({
      brandPreset: 'custom',
      secondaryFontLinked: true,
      secondaryFontColor:
        mode === 'contrast'
          ? formData.secondaryContrastColor || contrastOnAccent(secondary)
          : suggestFontColorFromAccent(secondary),
    });
  };

  /** Random harmonious custom palette (primary + secondary fills, contrasts, fonts). */
  const generateCustomPalette = () => {
    const hue = Math.floor(Math.random() * 360);
    const accent = hsvaToHex({ h: hue, s: 62 + Math.random() * 28, v: 72 + Math.random() * 18, a: 100 });
    const secondary = hsvaToHex({
      h: (hue + 28 + Math.floor(Math.random() * 40)) % 360,
      s: 55 + Math.random() * 30,
      v: 68 + Math.random() * 22,
      a: 100,
    });
    persistPartial({
      brandPreset: 'custom',
      accentColor: accent,
      accentSecondary: secondary,
      primaryContrastColor: contrastOnAccent(accent),
      primaryFontColor: suggestFontColorFromAccent(accent),
      primaryFontLinked: true,
      secondaryContrastColor: contrastOnAccent(secondary),
      secondaryFontColor: suggestFontColorFromAccent(secondary),
      secondaryFontLinked: true,
      brandGradientStops: stopsFromPair(accent, secondary),
      useBrandGradient: true,
    });
  };

  const themeOptions: { id: ThemePreference; label: string; icon: React.ReactNode; hint: string }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" />, hint: 'Bright surfaces' },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" />, hint: 'Obsidian UI' },
    { id: 'system', label: 'System', icon: <Laptop className="w-4 h-4" />, hint: 'Match OS' },
  ];

  const readImageAsDataUrl = (file: File | null, field: 'logoDataUrl' | 'markDataUrl') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose an image file (PNG, SVG, JPEG, or WebP).');
      return;
    }
    if (file.size > 600_000) {
      setLogoError('Keep logos under ~600KB so settings stay fast in localStorage.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoError(null);
      setFormData((prev) => ({ ...prev, [field]: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-obsidian-900 via-indigo-950/60 to-purple-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Settings & Config</h2>
            <p className="text-xs text-slate-400">
              Personalization, Command Center layout, skills, connectors, and system preferences — all in one place.
            </p>
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

      {/* Sub-Tab Navigation Bar + global Tiles/List toggle */}
      <div className="flex items-center justify-between gap-2 bg-obsidian-900/90 p-1.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 flex-1">
          {[
            { id: 'general', label: 'Personalization', icon: <Palette className="w-4 h-4" /> },
            { id: 'workspace', label: 'Workspace Layout', icon: <Sliders className="w-4 h-4" /> },
            { id: 'skills', label: 'Skills & Plugins', icon: <Zap className="w-4 h-4" /> },
            { id: 'connectors', label: 'Connectors', icon: <Share2 className="w-4 h-4" /> },
            { id: 'ai-models', label: 'AI Models', icon: <Cpu className="w-4 h-4" /> },
            { id: 'claude-md', label: 'CLAUDE.md', icon: <FileCode className="w-4 h-4" /> },
            { id: 'system', label: 'System', icon: <Power className="w-4 h-4" /> },
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

        <div className="flex items-center gap-1 bg-obsidian-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setSettingsViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              settingsViewMode === 'grid'
                ? 'brand-gradient shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tile / grid view for all settings sections"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Tiles</span>
          </button>
          <button
            type="button"
            onClick={() => setSettingsViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              settingsViewMode === 'list'
                ? 'brand-gradient shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Compact list view for all settings sections"
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* PERSONALIZATION: branding, CoS name, logos, theme, profile + keys */}
      {subTab === 'general' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Branding & Chief of Staff
              </h3>
              <p className="text-xs text-slate-400">
                Name your workspace and floating AI. Capabilities (skills, connectors, models) stay on the other tabs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Workspace name</label>
                <input
                  type="text"
                  value={formData.workspaceName || ''}
                  onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                  placeholder="Command Center"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
                <p className="text-[10px] text-slate-500">Shown in the top header and sidebar (replaces “Head of Product…”).</p>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Chief of Staff AI name</label>
                <input
                  type="text"
                  value={formData.chiefOfStaffName || ''}
                  onChange={(e) => setFormData({ ...formData, chiefOfStaffName: e.target.value })}
                  placeholder="Atlas"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
                <p className="text-[10px] text-slate-500">Used by the floating panel and the minimized header chip.</p>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Tagline / badge</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Execution Co-Pilot"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Personal touch</label>
                <input
                  type="text"
                  value={formData.personalTouch || ''}
                  onChange={(e) => setFormData({ ...formData, personalTouch: e.target.value })}
                  placeholder="e.g. Built for quiet focus mornings"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 p-3 rounded-xl border border-slate-800 glass-card">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <ImagePlus className="w-3.5 h-3.5" />
                  Primary logo
                </span>
                <p className="text-[10px] text-slate-500">Header wordmark. PNG / SVG / JPEG under ~600KB.</p>
                {formData.logoDataUrl ? (
                  <img src={formData.logoDataUrl} alt="Logo preview" className="h-10 w-auto max-w-full object-contain rounded" />
                ) : (
                  <div className="h-10 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                    No logo yet
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        readImageAsDataUrl(e.target.files?.[0] ?? null, 'logoDataUrl');
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {formData.logoDataUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoDataUrl: '' })}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-xl border border-slate-800 glass-card">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <ImagePlus className="w-3.5 h-3.5" />
                  Mark / AI avatar
                </span>
                <p className="text-[10px] text-slate-500">Compact icon for sidebar and the CoS chip.</p>
                {formData.markDataUrl ? (
                  <img src={formData.markDataUrl} alt="Mark preview" className="h-10 w-10 object-cover rounded-lg" />
                ) : (
                  <div className="h-10 w-10 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                    —
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        readImageAsDataUrl(e.target.files?.[0] ?? null, 'markDataUrl');
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {formData.markDataUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, markDataUrl: '' })}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            {logoError && <p className="text-[11px] text-rose-400 font-medium">{logoError}</p>}
          </div>

          {/* Appearance: light / dark / system */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Appearance
                <span className="text-[10px] font-bold uppercase tracking-wider brand-text">60% dominant</span>
              </h3>
              <p className="text-xs text-slate-400">
                Canvas and neutrals (backgrounds, cards, body text). This is your 60% dominant layer —
                light, dark, or match the OS.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themeOptions.map((opt) => {
                const selected = (formData.theme || 'system') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => applyThemeChoice(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selected
                        ? 'brand-border brand-bg-soft brand-ring'
                        : 'border-slate-800 glass-card hover:border-[var(--brand-accent-border)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={selected ? 'brand-text' : 'text-slate-400'}>{opt.icon}</span>
                      <span className="text-sm font-bold text-slate-100">{opt.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 brand-text ml-auto" />}
                    </div>
                    <p className="text-[11px] text-slate-400">{opt.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color & brand chrome */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                    <Palette className="w-4 h-4 brand-text" />
                    Color & brand chrome
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowPaletteHelp((open) => !open)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                      showPaletteHelp
                        ? 'brand-border brand-bg-soft brand-text'
                        : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                    aria-expanded={showPaletteHelp}
                    aria-controls="palette-help-panel"
                    title="Palette guidance: 60-30-10 rule"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Help</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Choose a preset or edit hex values. Click a color swatch to open the precision color picker.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={generateCustomPalette}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold shadow-sm transition-all brand-ring hover:opacity-95"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${formData.accentColor || '#6366F1'}, ${formData.accentSecondary || '#9333EA'})`,
                    color: formData.primaryContrastColor || '#FFFFFF',
                    borderColor: 'var(--brand-accent-border)',
                  }}
                  title="Generate a random custom primary + secondary palette"
                >
                  <Wand2
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: formData.primaryContrastColor || '#FFFFFF' }}
                  />
                  <span>Generate my own custom palette</span>
                  <span
                    className="ml-0.5 h-2.5 w-2.5 rounded-full border shrink-0"
                    style={{
                      backgroundColor: formData.primaryFontColor || '#818CF8',
                      borderColor: formData.primaryContrastColor || '#FFFFFF',
                    }}
                    title="Primary font"
                  />
                  <span
                    className="h-2.5 w-2.5 rounded-full border shrink-0"
                    style={{
                      backgroundColor: formData.secondaryFontColor || '#C084FC',
                      borderColor: formData.secondaryContrastColor || '#FFFFFF',
                    }}
                    title="Secondary font"
                  />
                </button>
                <span className="px-3 py-1.5 rounded-lg brand-badge text-xs font-bold">Primary</span>
                <span className="px-3 py-1.5 rounded-lg brand-badge-secondary text-xs font-bold">
                  Secondary
                </span>
                <span className="px-3 py-1.5 rounded-lg brand-gradient text-xs font-bold shadow-md">
                  CTA
                </span>
              </div>
            </div>

            {showPaletteHelp && (
              <div
                id="palette-help-panel"
                className="rounded-2xl border brand-border brand-bg-soft p-4 sm:p-5 space-y-4"
                role="region"
                aria-label="App color palette guidance"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">How to build a great app palette</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      A strong palette follows the <span className="text-slate-200 font-semibold">60-30-10 rule</span>
                      {' '}(60% dominant background, 30% secondary surfaces/cards, and 10% accent highlights or
                      call-to-actions), combined with <span className="text-slate-200 font-semibold">2 to 3 core colors</span>
                      {' '}plus neutrals.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaletteHelp(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 shrink-0"
                    aria-label="Close palette help"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Core structure of an app palette
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        share: '60%',
                        title: 'Dominant (Appearance)',
                        body: 'Light / Dark / System above sets canvas neutrals — backgrounds, cards, and body text.',
                      },
                      {
                        share: '30%',
                        title: 'Secondary (+ font & contrast)',
                        body: 'Supporting fill color, contrast text on that fill, and secondary font tint on neutrals.',
                      },
                      {
                        share: '10%',
                        title: 'Primary (+ font & contrast)',
                        body: 'CTA / active-nav fill, contrast on that fill, and primary font tint on neutrals.',
                      },
                      {
                        share: '—',
                        title: 'Contrast vs Font',
                        body: 'Contrast = text on the colored fill. Font = accent-tinted text on neutrals. They can match or diverge.',
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-3 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold brand-text tabular-nums">{item.share}</span>
                          <span className="text-xs font-bold text-slate-100">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <span className="text-slate-300 font-semibold">Appearance</span> = 60% dominant neutrals.{' '}
                  <span className="text-slate-300 font-semibold">Secondary</span> = 30% supporting fills + font on
                  neutrals. <span className="text-slate-300 font-semibold">Primary</span> = 10% CTAs. For each role,
                  Contrast is text <em>on</em> the fill; Font is tinted text <em>on</em> neutrals (can match contrast
                  or diverge).
                </p>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Palette presets
              </label>
              <div
                className={
                  settingsViewMode === 'grid'
                    ? 'mt-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2'
                    : 'mt-2 space-y-2'
                }
              >
                {BRAND_PRESETS.map((preset) => {
                  const selected = (formData.brandPreset || 'indigo') === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyBrandPreset(preset.id)}
                      className={`${
                        settingsViewMode === 'list'
                          ? 'p-3 flex items-center gap-3 w-full'
                          : 'p-3'
                      } rounded-xl border text-left transition-all ${
                        selected ? 'brand-border brand-bg-soft brand-ring' : 'border-slate-800 glass-card'
                      }`}
                    >
                      <div
                        className={
                          settingsViewMode === 'list'
                            ? 'h-2.5 w-16 rounded-full shrink-0'
                            : 'h-2.5 w-full rounded-full mb-2'
                        }
                        style={{
                          background: `linear-gradient(90deg, ${preset.accent}, ${preset.secondary})`,
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-100">{preset.label}</p>
                        <p className="text-[10px] text-slate-500 leading-snug">{preset.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 10% Primary */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 overflow-hidden">
                <div className="px-3 sm:px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-100">Primary · 10% accent</p>
                    <p className="text-[10px] text-slate-500">CTAs, active nav, critical highlights</p>
                  </div>
                  <span className="text-[10px] font-bold brand-text uppercase tracking-wider">10%</span>
                </div>
                <div className="px-3 sm:px-4">
                  <ColorHexRow
                    label="Color"
                    value={formData.accentColor || '#6366F1'}
                    fallback="#6366F1"
                    onChange={(hex) => applyBrandColor('accentColor', hex)}
                  />
                  <ColorHexRow
                    label="Contrast"
                    value={
                      formData.primaryContrastColor ||
                      contrastOnAccent(formData.accentColor || '#6366F1')
                    }
                    fallback="#FFFFFF"
                    onChange={(hex) => applyBrandColor('primaryContrastColor', hex)}
                  />
                  <ColorHexRow
                    label="Font"
                    value={
                      formData.primaryFontColor ||
                      suggestFontColorFromAccent(formData.accentColor || '#6366F1')
                    }
                    fallback="#818CF8"
                    onChange={(hex) => applyBrandColor('primaryFontColor', hex)}
                  />
                </div>
                <div className="px-3 sm:px-4 pb-3 flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-slate-500">
                    Font {formData.primaryFontLinked !== false ? 'linked' : 'custom'}
                  </span>
                  <button
                    type="button"
                    onClick={() => relinkPrimaryFont('tint')}
                    className="text-[10px] font-bold brand-text hover:underline"
                  >
                    Sync tint from color
                  </button>
                  <button
                    type="button"
                    onClick={() => relinkPrimaryFont('contrast')}
                    className="text-[10px] font-bold brand-text hover:underline"
                  >
                    Match contrast
                  </button>
                </div>
              </div>

              {/* 30% Secondary */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 overflow-hidden">
                <div className="px-3 sm:px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-100">Secondary · 30% support</p>
                    <p className="text-[10px] text-slate-500">Supporting fills, gradient end, soft chips</p>
                  </div>
                  <span className="text-[10px] font-bold brand-text-secondary uppercase tracking-wider">30%</span>
                </div>
                <div className="px-3 sm:px-4">
                  <ColorHexRow
                    label="Color"
                    value={formData.accentSecondary || '#9333EA'}
                    fallback="#9333EA"
                    onChange={(hex) => applyBrandColor('accentSecondary', hex)}
                  />
                  <ColorHexRow
                    label="Contrast"
                    value={
                      formData.secondaryContrastColor ||
                      contrastOnAccent(formData.accentSecondary || '#9333EA')
                    }
                    fallback="#FFFFFF"
                    onChange={(hex) => applyBrandColor('secondaryContrastColor', hex)}
                  />
                  <ColorHexRow
                    label="Font"
                    value={
                      formData.secondaryFontColor ||
                      suggestFontColorFromAccent(formData.accentSecondary || '#9333EA')
                    }
                    fallback="#C084FC"
                    onChange={(hex) => applyBrandColor('secondaryFontColor', hex)}
                  />
                </div>
                <div className="px-3 sm:px-4 pb-3 flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-slate-500">
                    Font {formData.secondaryFontLinked !== false ? 'linked' : 'custom'}
                  </span>
                  <button
                    type="button"
                    onClick={() => relinkSecondaryFont('tint')}
                    className="text-[10px] font-bold brand-text-secondary hover:underline"
                  >
                    Sync tint from color
                  </button>
                  <button
                    type="button"
                    onClick={() => relinkSecondaryFont('contrast')}
                    className="text-[10px] font-bold brand-text-secondary hover:underline"
                  >
                    Match contrast
                  </button>
                </div>
              </div>
            </div>

            {/* Live mock chrome — updates immediately with saved settings */}
            <div className="rounded-xl border border-slate-800 p-4 space-y-3 bg-slate-950/40">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Live preview (mock UI)
                </p>
                <span className="text-[10px] text-slate-500">
                  Changes apply across the app instantly
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-lg brand-button p-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase opacity-80">Primary fill</p>
                  <p className="text-[11px] font-bold mt-0.5">Contrast</p>
                </div>
                <div className="rounded-lg brand-secondary-fill p-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase opacity-80">Secondary fill</p>
                  <p className="text-[11px] font-bold mt-0.5">Contrast</p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-[var(--glass-card)] p-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase text-slate-500">On neutrals</p>
                  <p className="text-[11px] font-bold brand-text mt-0.5">Primary font</p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-[var(--glass-card)] p-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase text-slate-500">On neutrals</p>
                  <p className="text-[11px] font-bold brand-text-secondary mt-0.5">Secondary font</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-slate-800 bg-[var(--header-bg)]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-lg brand-gradient flex items-center justify-center text-[10px] font-bold shrink-0">
                      {(formData.workspaceName || 'CC').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-100 truncate">
                        {formData.workspaceName || 'Command Center'}
                      </p>
                      <p className="text-[10px] truncate">
                        <span className="brand-text">{formData.userTitle || 'Head of Product'}</span>
                        <span className="text-slate-500"> · </span>
                        <span className="brand-text-secondary">secondary label</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-1 rounded-lg brand-badge text-[10px] font-bold">Primary</span>
                    <span className="px-2 py-1 rounded-lg brand-badge-secondary text-[10px] font-bold">
                      Secondary
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[140px_1fr] min-h-[120px]">
                  <aside className="border-r border-slate-800 p-2 space-y-1 bg-[var(--sidebar-bg)]">
                    <div className="px-2 py-1.5 rounded-lg brand-gradient text-[10px] font-bold">
                      Active nav
                    </div>
                    <div className="px-2 py-1.5 rounded-lg brand-bg-secondary-soft brand-border-secondary border text-[10px] brand-text-secondary font-semibold">
                      Secondary chip
                    </div>
                    <div className="px-2 py-1.5 rounded-lg text-[10px] text-slate-400">Idle (60%)</div>
                  </aside>
                  <div className="p-3 space-y-2.5">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="px-3 py-1.5 rounded-lg brand-button text-[10px] font-bold">
                        Primary CTA
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg brand-secondary-fill text-[10px] font-bold"
                      >
                        Secondary CTA
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      <span className="brand-text font-semibold">Primary font</span>
                      {' · '}
                      <span className="brand-text-secondary font-semibold">Secondary font</span>
                      {' · '}
                      <span className="text-indigo-400 font-semibold">indigo remap</span>
                      {' · '}
                      <span className="text-purple-400 font-semibold">purple remap</span>
                    </p>
                    <div className="h-8 rounded-lg brand-gradient brand-ring" title="Gradient surface" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400">Brand intensity</label>
                <div className="flex gap-1.5">
                  {([
                    { id: 'soft', label: 'Soft' },
                    { id: 'balanced', label: 'Balanced' },
                    { id: 'bold', label: 'Bold' },
                  ] as { id: BrandIntensity; label: string }[]).map((opt) => {
                    const selected = (formData.brandIntensity || 'balanced') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => persistPartial({ brandIntensity: opt.id })}
                        className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          selected ? 'brand-gradient shadow-md' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400">Gradient accents</label>
                <button
                  type="button"
                  onClick={() => persistPartial({ useBrandGradient: !formData.useBrandGradient })}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                    formData.useBrandGradient !== false
                      ? 'brand-border brand-bg-soft brand-text'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <span>{formData.useBrandGradient !== false ? 'Two-tone gradient ON' : 'Solid accent (gradient OFF)'}</span>
                  <Check className={`w-3.5 h-3.5 ${formData.useBrandGradient !== false ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                <p className="text-[10px] text-slate-500">Applies to active nav items and primary brand surfaces.</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-800">
              <label className="text-[11px] font-semibold text-slate-400">Typography</label>
              <p className="text-[10px] text-slate-500">
                Font pack is applied to body text, buttons, inputs, and headings when you save personalization.
              </p>
              <div
                className={
                  settingsViewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'
                    : 'space-y-2'
                }
              >
                {FONT_PRESETS.map((pack) => {
                  const selected = (formData.fontPreset || 'inter-outfit') === pack.id;
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => persistPartial({ fontPreset: pack.id as FontPresetId })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settingsViewMode === 'list' ? 'flex items-center justify-between gap-3 w-full' : ''
                      } ${
                        selected ? 'brand-border brand-bg-soft brand-ring' : 'border-slate-800 glass-card'
                      }`}
                    >
                      <div className="min-w-0">
                        <p
                          className="text-sm font-bold text-slate-100 mb-0.5"
                          style={{ fontFamily: pack.display }}
                        >
                          {pack.label}
                        </p>
                        <p className="text-[10px] text-slate-500" style={{ fontFamily: pack.body }}>
                          {pack.description}
                        </p>
                      </div>
                      {selected && settingsViewMode === 'list' && (
                        <Check className="w-4 h-4 brand-text shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Profile
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Full name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Your Full Name..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Title</label>
                <input
                  type="text"
                  value={formData.userTitle}
                  onChange={(e) => setFormData({ ...formData, userTitle: e.target.value })}
                  placeholder="Your Leadership Title..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Integration keys
              </h3>
              <p className="text-xs text-slate-400">Capabilities stay the same — these keys are stored locally until wired live.</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400">Microsoft Graph / Outlook</span>
              <input
                type="text"
                value={formData.outlookClientId}
                onChange={(e) => setFormData({ ...formData, outlookClientId: e.target.value })}
                placeholder="Azure AD Client Application ID..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400">Notion</span>
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

            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-400">Local / Custom LLM</span>
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <p className="text-[11px] text-slate-500">
                Save applies brand colors to buttons & accents, loads the selected fonts, and persists the theme.
              </p>
              <button
                type="button"
                onClick={handleSavePersonalization}
                className="px-5 py-2.5 rounded-xl brand-button font-bold text-xs shadow-md brand-ring shrink-0"
              >
                {saveSuccess ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Colors, buttons & fonts applied
                  </span>
                ) : (
                  'Save personalization'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE LAYOUT: Command Center panels + left nav (single module order) */}
      {subTab === 'workspace' && (
        <WorkspaceLayoutSettings
          widgets={settings.widgets}
          activePreset={settings.activePreset}
          sidebarNavOrder={settings.sidebarNavOrder || []}
          settings={settings}
          viewMode={settingsViewMode}
          onUpdateWidgets={onUpdateWidgets}
          onReorderModules={onReorderModules}
          onSelectPreset={onSelectPreset}
        />
      )}

      {/* SUB-TAB: SKILLS & SYSTEM PLUGINS HUB */}
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
            {settingsViewMode === 'grid' ? (
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
            {settingsViewMode === 'grid' ? (
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

            {/* Connectors: Tiles vs List */}
            {settingsViewMode === 'grid' ? (
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
            ) : (
              <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
                {filteredConnectors.map((c) => {
                  const isConn = c.status === 'Connected';
                  return (
                    <div
                      key={c.id}
                      className="p-3 hover:bg-slate-800/40 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-obsidian-950 border border-slate-800 shrink-0">
                          {getConnectorIcon(c.icon)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-100 text-xs truncate">{c.name}</h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                isConn
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isConn ? 'Connected' : 'Not Connected'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{c.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedConnectorForSetup(c)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 ${
                          isConn ? 'bg-slate-800 text-slate-300' : 'brand-button'
                        }`}
                      >
                        {isConn ? 'Reconfigure' : 'Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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

            {/* Provider cards: Tiles vs List */}
            {settingsViewMode === 'grid' ? (
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
                      <span className="text-slate-400">
                        Model: <strong className="text-slate-100">{prov.selectedModel}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
                {(formData.aiProviders || []).map((prov) => (
                  <div
                    key={prov.id}
                    className="p-3 hover:bg-slate-800/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-100 text-xs">{prov.provider}</h4>
                          {prov.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate font-mono">{prov.endpoint}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-300">{prov.selectedModel}</span>
                      {!prov.isDefault && (
                        <button
                          onClick={() => setDefaultProvider(prov.id)}
                          className="text-[11px] brand-text underline font-semibold"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            rows={settingsViewMode === 'list' ? 8 : 14}
            value={formData.claudeMdContent}
            onChange={(e) => setFormData({ ...formData, claudeMdContent: e.target.value })}
            className="w-full p-4 rounded-xl glass-input font-mono text-xs text-slate-200 leading-relaxed resize-none"
          />
        </div>
      )}

      {/* SUB-TAB 5: SYSTEM & AUTO-START */}
      {subTab === 'system' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-slate-100 text-base">System Preferences & Dual-Machine Setup</h3>
            <p className="text-xs text-slate-400 mt-1">
              Day-to-day use <span className="text-slate-200 font-semibold">npm run dev</span> (Vite) on Mac or Windows.
              Electron packaging is optional — see <span className="font-mono text-slate-300">npm run electron</span>.
            </p>
          </div>

          <div
            className={
              settingsViewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                : 'space-y-4'
            }
          >
          <div className="p-4 rounded-xl glass-card border border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Monitor className="w-4 h-4" />
              <span>Detected host</span>
            </span>
            <p className="text-[11px] text-slate-300">
              Platform: <span className="font-semibold text-slate-100">{hostPlatform}</span>
              {' · '}
              Home for skill paths:{' '}
              <span className="font-mono text-indigo-300">{homeDirectory}</span>
            </p>
            <p className="text-[10px] text-slate-500">
              Override with <span className="font-mono">VITE_HOME_DIR</span> or{' '}
              <span className="font-mono">VITE_USERNAME</span> in a local <span className="font-mono">.env</span> (not committed).
              Skill paths are mock catalog URLs — they do not prove folders exist on disk.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-card border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Power className="w-4 h-4" />
                <span>Auto-Start on Login</span>
              </span>
              <p className="text-[11px] text-slate-300">
                Preference only in the browser. Real login-item registration requires the Electron shell
                (<span className="font-mono">npm run electron</span> after <span className="font-mono">npm run build</span>).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={formData.autoStartOnBoot}
                onChange={(e) => setFormData({ ...formData, autoStartOnBoot: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="p-4 rounded-xl glass-card border border-indigo-500/30 space-y-3">
            <div>
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span>Move browser state between machines</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Settings, mock data, and skills live in this browser&apos;s localStorage. Mac Chrome ≠ Windows Chrome —
                export a JSON file here, copy it over, then import on the other machine.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportWorkspace}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Workspace</span>
              </button>
              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import Workspace</span>
                <input
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    handleImportWorkspace(e.target.files?.[0] ?? null);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
            {workspaceTransferMessage && (
              <p className="text-[11px] text-emerald-400 font-medium">{workspaceTransferMessage}</p>
            )}
          </div>

          <div className="pt-2 flex justify-start md:col-span-2">
            <button
              onClick={onResetMockData}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
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
