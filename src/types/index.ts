export type TabType = 'command-center' | 'chief-of-staff' | 'product-portfolio' | 'outlook' | 'notion-krisp' | 'app-launcher' | 'priority-alerts' | 'knowledge-clone' | 'settings';

/** Main left-rail tabs (Settings stays pinned at the bottom). */
export type SidebarNavId = Exclude<TabType, 'settings'>;

export type WorkspacePreset = 'execution' | 'meeting' | 'strategy' | 'custom';
export type ViewMode = 'grid' | 'list';
export type ThemePreference = 'light' | 'dark' | 'system';
export type BrandIntensity = 'soft' | 'balanced' | 'bold';
export type BrandPresetId = 'executive' | 'indigo' | 'ocean' | 'forest' | 'sunset' | 'slate' | 'custom';
export type FontPresetId = 'inter-outfit' | 'dm-fraunces' | 'source' | 'plex' | 'system';
export type BrandGradientType = 'linear' | 'radial';

/** One color stop in the brand gradient editor (cssgradient-style). */
export interface BrandGradientStop {
  id: string;
  color: string;
  position: number;
  /** Opacity 0–100 */
  alpha: number;
}

export interface ConnectedAccount {
  id: string;
  name: string;
  email: string;
  provider: 'Microsoft Outlook 365' | 'Gmail / Google Workspace' | 'Apple iCloud Mail' | 'Yahoo Mail' | 'ProtonMail' | 'IMAP / CalDAV Custom';
  color: string;
  unreadEmailsCount: number;
  eventsTodayCount: number;
  connected: boolean;
  isDefault: boolean;
}

export interface SystemDiscoveredSkill {
  id: string;
  name: string;
  sourceSystem: 'Antigravity' | 'Claude' | 'Gemini' | 'Cursor' | 'ChatGPT' | 'Perplexity' | 'Google AI Studio';
  path: string;
  description: string;
  category: 'System Plugin' | 'Development' | 'Browser' | 'Database' | 'Intelligence';
  isInstalled: boolean;
  status: 'Active' | 'Discovered';
  version?: string;
}

export interface ConnectorItem {
  id: string;
  name: string;
  ecosystem:
    | 'Microsoft'
    | 'Claude'
    | 'ChatGPT'
    | 'Google'
    | 'n8n'
    | 'Enterprise SaaS'
    | 'Developer & Data'
    | 'Custom'
    | 'iPaaS'
    | 'MCP'
    | 'AI Assistant';
  icon: string;
  description: string;
  authType: 'IDP_OAUTH' | 'API_KEY' | 'WEBHOOK' | 'MCP';
  status: 'Connected' | 'Not Connected';
  isVettedLegal: boolean;
  complianceCert: string;
  eli5Instructions: string[];
  fieldsRequired: { key: string; label: string; placeholder: string; isSecret?: boolean }[];
  connectedUser?: string;
  lastSynced?: string;
  /** How this connector is wired (see connectorApproaches.ts). */
  approach: ConnectorApproach;
  /** Which workspace surface this tool powers when Connected. */
  surfaceRole?: ConnectorSurfaceRole;
  startsAutonomously?: boolean;
  multiAppInOneMotion?: boolean;
  setupBurden?: 'low' | 'medium' | 'high';
  /** User-filled field values from the connect wizard (non-secret). Secrets → secretsVault. */
  configValues?: Record<string, string>;
  /**
   * demo = local-only enablement (no live OAuth/API verify).
   * live = real integration verified (future).
   */
  connectionMode?: 'demo' | 'live';
  /** True only after a successful live health-check / OAuth. */
  liveVerified?: boolean;
}

/** Integration wiring model — drives Settings + Tools workspace. */
export type ConnectorApproach =
  | 'native_vendor'
  | 'mcp'
  | 'ipaas'
  | 'ai_assistant'
  | 'direct_api';

/** Workspace pane this connector can drive when connected. */
export type ConnectorSurfaceRole =
  | 'actions'
  | 'transcripts'
  | 'calendar'
  | 'automation'
  | 'assistant'
  | 'data'
  | 'messaging'
  | 'generic';

export interface AutoConnectorSpec {
  id: string;
  name: string;
  category: 'Autonomous Agent' | 'AI Model Platform' | 'Automation System';
  type: 'Hermes Agent' | 'ClawCode' | 'OpenClaw' | 'n8n Workflow' | 'ChatGPT' | 'Claude' | 'Gemini' | 'Custom Agent';
  endpoint: string;
  status: 'Auto-Discovered' | 'Connected' | 'Idle';
  description: string;
  icon: string;
  autoConnect: boolean;
}

export interface CustomSkill {
  id: string;
  name: string;
  description: string;
  skillMdContent: string;
  enabled: boolean;
  category: 'Productivity' | 'Development' | 'Strategy' | 'Automation';
  createdAt: string;
}

export interface CustomAppSpec {
  id: string;
  name: string;
  category: 'Custom App' | 'Productivity' | 'Automation' | 'Developer';
  description: string;
  icon: string;
  appType: 'code' | 'iframe' | 'webhook';
  codeSnippet?: string;
  url?: string;
  launchCount: number;
  createdAt: string;
}

export interface AIProviderConfig {
  id: string;
  /** Display name — local engines, paid APIs, or curated free gateways */
  provider: string;
  endpoint: string;
  apiKey?: string;
  selectedModel: string;
  isDefault: boolean;
  connected: boolean;
  /** Set when connected from the free-tier catalog */
  freeSourceId?: string;
  tier?: 'local' | 'paid' | 'free';
  /** demo until a live ping succeeds */
  connectionMode?: 'demo' | 'live';
  liveVerified?: boolean;
}

export interface ProductLine {
  id: string;
  name: string;
  lead: string;
  status: 'On Track' | 'At Risk' | 'Blocked' | 'Launching Soon';
  readinessScore: number;
  sprintVelocity: number;
  activeBlockers: number;
  targetReleaseDate: string;
  keyDeliverable: string;
  okrProgress: number;
}

export interface WidgetConfig {
  id: string;
  title: string;
  description: string;
  category: 'Execution' | 'Communication' | 'Intelligence' | 'Knowledge';
  enabled: boolean;
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  attendees: string[];
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  status: 'Confirmed' | 'Tentative' | 'Needs Prep';
  agenda?: string;
  prepNotes?: string;
  accountEmail?: string;
  accountName?: string;
  provider?: string;
}

export interface EmailMessage {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  receivedTime: string;
  isPriority: boolean;
  category: 'Urgent' | 'Action Required' | 'VIP Sender' | 'Read Later';
  isRead: boolean;
  flagged: boolean;
  accountEmail?: string;
  accountName?: string;
  provider?: string;
}

export interface NotionActionItem {
  id: string;
  title: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string;
  impactScore: number;
}

export interface KrispTranscription {
  id: string;
  title: string;
  date: string;
  duration: string;
  rawText: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  keyTakeaways: string[];
}

export interface AppShortcut {
  id: string;
  name: string;
  category: 'Communication' | 'Productivity' | 'Design & Code' | 'Custom';
  icon: string;
  url: string;
  isLocalUri: boolean;
  pinned: boolean;
  launchCount: number;
  customAppId?: string;
}

export interface PriorityAlert {
  id: string;
  source: 'Teams' | 'Outlook' | 'System' | 'Notion';
  sender: string;
  message: string;
  timestamp: string;
  urgency: 'Critical' | 'High' | 'Medium';
  handled: boolean;
  actionUrl?: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: 'Decision' | 'Strategy' | 'Influence' | 'Reflection' | 'Framework';
  date: string;
  context: string;
  decisionMade: string;
  rationale: string;
  outcome?: string;
  tags: string[];
  impactRating: number;
}

export interface LeadershipPersonaRule {
  id: string;
  trait: string;
  ruleDescription: string;
  exampleScenario: string;
  influenceScore: number;
}

export interface ChiefOfStaffSummary {
  dailyTagline: string;
  topDirectives: string[];
  mustDoToday: string[];
  delegateOrDefer: string[];
  tomorrowLookahead: string[];
  weekLookahead: string[];
  beyondLookahead: string[];
  calendarDensityPercentage: number;
}

export interface AppSettings {
  autoStartOnBoot: boolean;
  outlookClientId: string;
  outlookConnected: boolean;
  notionApiKey: string;
  notionDatabaseId: string;
  notionConnected: boolean;
  krispAutoSync: boolean;
  customLlmEndpoint: string;
  customLlmApiKey: string;
  useMockData: boolean;
  userTitle: string;
  userName: string;
  /** Product / workspace title shown in the header (e.g. "Command Center"). */
  workspaceName: string;
  /** Display name for the floating Chief of Staff AI assistant. */
  chiefOfStaffName: string;
  /** Short badge / tagline under branding (e.g. "Execution Co-Pilot"). */
  tagline: string;
  /** Optional primary logo as a data URL (PNG/SVG/JPEG). */
  logoDataUrl: string;
  /** Optional compact mark / avatar for the AI chip and sidebar. */
  markDataUrl: string;
  /** Freeform personal note shown as a soft branding touch. */
  personalTouch: string;
  /** Named color pair preset; `custom` uses accentColor / accentSecondary. */
  brandPreset: BrandPresetId;
  /** Primary brand accent (hex) — ~10% CTAs / highlights. */
  accentColor: string;
  /** Secondary brand accent (hex) — ~30% supporting surfaces / gradient end. */
  accentSecondary: string;
  /** Text/icon color on primary fills (buttons, active nav). */
  primaryContrastColor: string;
  /** Accent-tinted text on neutrals for primary meaning (links, labels). */
  primaryFontColor: string;
  /** When true, primary font auto-follows primary color changes. */
  primaryFontLinked: boolean;
  /** Text/icon color on secondary fills. */
  secondaryContrastColor: string;
  /** Accent-tinted text on neutrals for secondary meaning. */
  secondaryFontColor: string;
  /** When true, secondary font auto-follows secondary color changes. */
  secondaryFontLinked: boolean;
  /** Linear vs radial brand gradient (cssgradient-style editor). */
  brandGradientType: BrandGradientType;
  /** Angle in degrees for linear gradients (0–360). */
  brandGradientAngle: number;
  /** Ordered color stops that drive --brand-gradient. */
  brandGradientStops: BrandGradientStop[];
  /** How strongly brand color is applied to chrome. */
  brandIntensity: BrandIntensity;
  /** When true, active nav / CTAs use a two-tone brand gradient. */
  useBrandGradient: boolean;
  /** UI typeface pack applied across body, buttons, and headings. */
  fontPreset: FontPresetId;
  activePreset: WorkspacePreset;
  widgets: WidgetConfig[];
  viewMode: ViewMode;
  theme: ThemePreference;
  sidebarCollapsed: boolean;
  /** Ordered left-rail destinations (Settings remains pinned under Configuration). */
  sidebarNavOrder: SidebarNavId[];
  claudeMdContent: string;
  aiProviders: AIProviderConfig[];
  customSkills: CustomSkill[];
  connectors?: ConnectorItem[];
  discoveredSystemSkills?: SystemDiscoveredSkill[];
  connectedAccounts?: ConnectedAccount[];
}
