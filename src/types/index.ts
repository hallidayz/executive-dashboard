export type TabType = 'command-center' | 'chief-of-staff' | 'product-portfolio' | 'outlook' | 'notion-krisp' | 'app-launcher' | 'priority-alerts' | 'knowledge-clone' | 'settings';

export type WorkspacePreset = 'execution' | 'meeting' | 'strategy' | 'custom';
export type ViewMode = 'grid' | 'list';

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
  ecosystem: 'Microsoft' | 'Claude' | 'ChatGPT' | 'Google' | 'n8n' | 'Enterprise SaaS' | 'Developer & Data' | 'Custom';
  icon: string;
  description: string;
  authType: 'IDP_OAUTH' | 'API_KEY' | 'WEBHOOK';
  status: 'Connected' | 'Not Connected';
  isVettedLegal: boolean;
  complianceCert: string;
  eli5Instructions: string[];
  fieldsRequired: { key: string; label: string; placeholder: string; isSecret?: boolean }[];
  connectedUser?: string;
  lastSynced?: string;
}

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
  provider: 'Ollama (Local)' | 'LM Studio (Local)' | 'Anthropic Claude' | 'OpenAI' | 'Google Gemini' | 'Custom Local GPU';
  endpoint: string;
  apiKey?: string;
  selectedModel: string;
  isDefault: boolean;
  connected: boolean;
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
  activePreset: WorkspacePreset;
  widgets: WidgetConfig[];
  viewMode: ViewMode;
  claudeMdContent: string;
  aiProviders: AIProviderConfig[];
  customSkills: CustomSkill[];
  connectors?: ConnectorItem[];
  discoveredSystemSkills?: SystemDiscoveredSkill[];
  connectedAccounts?: ConnectedAccount[];
}
