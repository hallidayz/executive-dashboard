import {
  CalendarEvent,
  EmailMessage,
  NotionActionItem,
  KrispTranscription,
  AppShortcut,
  PriorityAlert,
  KnowledgeEntry,
  LeadershipPersonaRule,
  AppSettings,
  ProductLine,
  WidgetConfig,
  AIProviderConfig,
  CustomSkill,
} from '../types';
import { DEFAULT_SIDEBAR_NAV_ORDER } from './navOrder';
import { INITIAL_CONNECTORS_CATALOG } from './connectorsCatalog';
import { normalizeConnectorsCatalog } from './connectorApproaches';

export const INITIAL_WIDGETS: WidgetConfig[] = [
  { id: 'w-heatmap', title: 'Product Portfolio Heatmap', description: 'Launch readiness & sprint velocity across products', category: 'Execution', enabled: true, order: 1, size: 'full' },
  { id: 'w-chief', title: 'Chief of Staff Directives', description: 'Daily AI directives & strategic horizon', category: 'Intelligence', enabled: true, order: 2, size: 'large' },
  { id: 'w-triage', title: 'Unified Priority Stream', description: 'Aggregated Teams, Email & Notion alerts', category: 'Communication', enabled: true, order: 3, size: 'medium' },
  { id: 'w-outlook', title: 'Outlook Calendar & Prep', description: 'Day schedule & meeting prep notes', category: 'Communication', enabled: true, order: 4, size: 'medium' },
  { id: 'w-notion', title: 'Notion Deliverables', description: 'High-impact Notion cards & status', category: 'Execution', enabled: true, order: 5, size: 'medium' },
  { id: 'w-krisp', title: 'Krisp Meeting Intelligence', description: 'AI parsed meeting takeaways & decisions', category: 'Intelligence', enabled: true, order: 6, size: 'medium' },
  { id: 'w-apps', title: 'Active App Launcher', description: 'One-click shortcuts to daily execution apps', category: 'Execution', enabled: true, order: 7, size: 'medium' },
  { id: 'w-clone', title: 'AI Leadership Clone', description: 'Local KB & scenario decision simulator', category: 'Knowledge', enabled: true, order: 8, size: 'full' },
];

export const INITIAL_AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'prov-1',
    provider: 'Ollama (Local)',
    endpoint: 'http://localhost:11434',
    selectedModel: 'llama3.3:70b',
    isDefault: true,
    connected: true,
    tier: 'local',
  },
  {
    id: 'prov-2',
    provider: 'LM Studio (Local)',
    endpoint: 'http://localhost:1234/v1',
    selectedModel: 'qwen2.5-coder-32b',
    isDefault: false,
    connected: true,
    tier: 'local',
  },
  {
    id: 'prov-3',
    provider: 'Anthropic Claude',
    endpoint: 'https://api.anthropic.com/v1',
    selectedModel: 'claude-3-7-sonnet-latest',
    isDefault: false,
    connected: false,
    tier: 'paid',
  },
  {
    id: 'prov-4',
    provider: 'OpenAI',
    endpoint: 'https://api.openai.com/v1',
    selectedModel: 'gpt-4o',
    isDefault: false,
    connected: false,
    tier: 'paid',
  },
];

export const INITIAL_CUSTOM_SKILLS: CustomSkill[] = [
  {
    id: 'skill-1',
    name: 'Executive Decision Log Extractor',
    description: 'Extracts strategic decisions & rationales directly from raw meeting transcripts into Local KB format.',
    category: 'Strategy',
    enabled: true,
    createdAt: '2026-08-01',
    skillMdContent: `# Executive Decision Log Extractor SKILL.md
Analyze raw meeting text and isolate:
1. Context & Problem Statement
2. Exact Strategic Decision Made
3. Trade-offs & Rationale
4. Follow-up Notion Action Items
Format output into Local Laptop KB JSON schema.`,
  },
  {
    id: 'skill-2',
    name: 'Launch Readiness Risk Evaluator',
    description: 'Evaluates product line readiness scores against active engineering blockers and target release dates.',
    category: 'Productivity',
    enabled: true,
    createdAt: '2026-08-01',
    skillMdContent: `# Launch Readiness Risk Evaluator SKILL.md
Inspect product execution portfolio items:
- Calculate Sprint Velocity %
- Highlight active blocker dependencies
- Flag items below 80% readiness score for executive escalation.`,
  },
];

export const INITIAL_CLAUDE_MD = `# CLAUDE.md - Executive Assistant System Instructions & Rules

## Identity & Role
You are the Executive Chief of Staff and Leadership AI Clone for Alex Halliday (Head of Product Execution).

## Core Principles
1. **Strategic Clarity First**: Evaluate proposals against top 3 quarterly OKRs.
2. **Local Data Privacy**: All decision rationales and leadership logs must stay 100% on the local laptop.
3. **High Accountability & Speed**: Rapid decision-making with transparent rationale logging.
4. **1-Click Execution**: Generate actionable responses for Outlook, Notion, and Krisp.
`;

export const MOCK_PRODUCT_LINES: ProductLine[] = [
  {
    id: 'prod-1',
    name: 'Executive AI Co-Pilot & Clone Engine',
    lead: 'Marcus Vance (VP Eng)',
    status: 'Launching Soon',
    readinessScore: 92,
    sprintVelocity: 95,
    activeBlockers: 1,
    targetReleaseDate: '2026-08-15',
    keyDeliverable: '100% Local Laptop Storage & Scenario Simulator',
    okrProgress: 88,
  },
  {
    id: 'prod-2',
    name: 'Enterprise Notion & Graph Integration Hub',
    lead: 'David Chen (Principal Arch)',
    status: 'On Track',
    readinessScore: 88,
    sprintVelocity: 90,
    activeBlockers: 0,
    targetReleaseDate: '2026-08-22',
    keyDeliverable: 'Real-Time Webhook & Dual Sync Adapter',
    okrProgress: 82,
  },
  {
    id: 'prod-3',
    name: 'Krisp Voice & Transcript Extraction Engine',
    lead: 'Sarah Jenkins (CEO)',
    status: 'On Track',
    readinessScore: 94,
    sprintVelocity: 92,
    activeBlockers: 0,
    targetReleaseDate: '2026-08-10',
    keyDeliverable: 'Automated Action Item Parser into Notion',
    okrProgress: 91,
  },
  {
    id: 'prod-4',
    name: 'Cross-Departmental Analytics & Security Shield',
    lead: 'Alex Halliday (Head of Product)',
    status: 'At Risk',
    readinessScore: 74,
    sprintVelocity: 78,
    activeBlockers: 2,
    targetReleaseDate: '2026-09-01',
    keyDeliverable: 'Zero-Trust Encryption & Audit Logs',
    okrProgress: 65,
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  autoStartOnBoot: true,
  outlookClientId: 'ms-graph-client-id-sample',
  outlookConnected: true,
  notionApiKey: '',
  notionDatabaseId: '',
  notionConnected: false,
  krispAutoSync: false,
  customLlmEndpoint: 'http://localhost:11434',
  customLlmApiKey: '',
  useMockData: true,
  userName: 'Alex Halliday',
  userTitle: 'Head of Product Execution',
  workspaceName: 'Command Center',
  chiefOfStaffName: 'Atlas',
  tagline: 'Execution Co-Pilot',
  logoDataUrl: '',
  markDataUrl: '',
  personalTouch: '',
  brandPreset: 'executive',
  accentColor: '#FDA700',
  accentSecondary: '#02295B',
  primaryContrastColor: '#02295B',
  primaryFontColor: '#02295B',
  primaryFontLinked: true,
  secondaryContrastColor: '#D6D6D6',
  secondaryFontColor: '#333F3F',
  secondaryFontLinked: true,
  brandGradientType: 'linear',
  brandGradientAngle: 135,
  brandGradientStops: [
    { id: 'stop-start', color: '#FDA700', position: 0, alpha: 100 },
    { id: 'stop-end', color: '#02295B', position: 100, alpha: 100 },
  ],
  brandIntensity: 'balanced',
  useBrandGradient: true,
  fontPreset: 'inter-outfit',
  activePreset: 'execution',
  widgets: INITIAL_WIDGETS,
  viewMode: 'list',
  theme: 'light',
  sidebarCollapsed: false,
  sidebarNavOrder: [...DEFAULT_SIDEBAR_NAV_ORDER],
  claudeMdContent: INITIAL_CLAUDE_MD,
  aiProviders: INITIAL_AI_PROVIDERS,
  customSkills: INITIAL_CUSTOM_SKILLS,
  connectors: normalizeConnectorsCatalog(undefined, INITIAL_CONNECTORS_CATALOG),
};

export const MOCK_CALENDAR: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Product Delivery Review: Launch Readiness & Release Blockers',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    date: new Date().toISOString().split('T')[0],
    attendees: ['CEO Sarah Jenkins', 'VP Eng Marcus Vance', 'Head of Product (You)'],
    location: 'Executive Boardroom & Teams',
    isVirtual: true,
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/executive-sync',
    status: 'Needs Prep',
    agenda: 'Align on Q3 launch readiness (92%), review active blockers on Security Shield, approve release cadence.',
    prepNotes: 'Bring Notion action item breakdown & Krisp notes from yesterday\'s architecture review.',
  },
  {
    id: 'cal-2',
    title: 'Focus Block: Local AI Leadership Clone Scenario Training',
    startTime: '10:30 AM',
    endTime: '12:00 PM',
    date: new Date().toISOString().split('T')[0],
    attendees: ['Deep Work (Solo)'],
    location: 'Private Office',
    isVirtual: false,
    status: 'Confirmed',
    agenda: 'Log decision records into Local KB and fine-tune AI Clone decision simulation rules.',
    prepNotes: 'Review top 5 strategic decisions made this month across product lines.',
  },
  {
    id: 'cal-3',
    title: '1:1 with Principal Architect on Multi-Cloud Cost Optimization',
    startTime: '01:30 PM',
    endTime: '02:15 PM',
    date: new Date().toISOString().split('T')[0],
    attendees: ['Principal Architect David Chen', 'Head of Product (You)'],
    location: 'Microsoft Teams',
    isVirtual: true,
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/arch-1on1',
    status: 'Confirmed',
    agenda: 'Review cloud architecture cost optimizations and Krisp notes from last week.',
    prepNotes: 'Verify Notion card #482 (Cloud Migration Plan).',
  },
  {
    id: 'cal-4',
    title: 'All-Hands Product Execution Sync & Release Alignment',
    startTime: '03:30 PM',
    endTime: '04:30 PM',
    date: new Date().toISOString().split('T')[0],
    attendees: ['All Product & Engineering Leads (42 attendees)'],
    location: 'Main Auditorium & Live Stream',
    isVirtual: true,
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/all-hands-strategy',
    status: 'Confirmed',
    agenda: 'Present vision for upcoming strategic quarter, highlight team achievements, Q&A.',
    prepNotes: 'Prepare Chief of Staff closing remarks.',
  },
];

export const MOCK_EMAILS: EmailMessage[] = [
  {
    id: 'em-1',
    sender: 'CEO Sarah Jenkins',
    senderEmail: 'sarah.jenkins@enterprise.com',
    subject: 'URGENT: Board Release Deck & Q3 Product Readiness',
    preview: 'Alex, loved the Krisp summary from yesterday. Please review product readiness scores before 2 PM today so we can finalize the strategic messaging...',
    receivedTime: '08:15 AM',
    isPriority: true,
    category: 'VIP Sender',
    isRead: false,
    flagged: true,
  },
  {
    id: 'em-2',
    sender: 'Notion Sync Engine',
    senderEmail: 'notifications@notion.so',
    subject: '3 High-Impact Product Cards assigned to you in Execution Board',
    preview: 'Items: [1] Approve Q3 AI Budget, [2] Review Executive Clone System Architecture, [3] Confirm Stakeholder Matrix.',
    receivedTime: '07:45 AM',
    isPriority: true,
    category: 'Action Required',
    isRead: true,
    flagged: false,
  },
  {
    id: 'em-3',
    sender: 'Marcus Vance (VP Eng)',
    senderEmail: 'marcus.vance@enterprise.com',
    subject: 'Engineering Resource Allocation for Product Line #4',
    preview: 'Hey Alex, we have 4 senior engineers ready to clear the security shield blockers. Let us touch base during our 1:1 or afternoon sync.',
    receivedTime: '07:10 AM',
    isPriority: false,
    category: 'Urgent',
    isRead: true,
    flagged: false,
  },
  {
    id: 'em-4',
    sender: 'Industry Tech Digest',
    senderEmail: 'newsletter@techdigest.io',
    subject: 'Weekly Product Execution Digest: Scaling Strategic Influence',
    preview: 'Insights on executive presence, delegating decision frameworks, and building trusted AI clones for leadership scalability...',
    receivedTime: '06:30 AM',
    isPriority: false,
    category: 'Read Later',
    isRead: false,
    flagged: false,
  },
];

export const MOCK_NOTION_ACTIONS: NotionActionItem[] = [
  {
    id: 'notion-1',
    title: 'Approve Q3 Product Execution Budget & Resource Allocation',
    project: 'Executive Operations',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date().toISOString().split('T')[0],
    impactScore: 10,
  },
  {
    id: 'notion-2',
    title: 'Finalize Executive AI Clone Decision Playbook',
    project: 'Leadership Growth',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date().toISOString().split('T')[0],
    impactScore: 9,
  },
  {
    id: 'notion-3',
    title: 'Review Krisp Transcriptions for Key Product Line Blockers',
    project: 'Meeting Intelligence',
    priority: 'Medium',
    status: 'To Do',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    impactScore: 8,
  },
  {
    id: 'notion-4',
    title: 'Publish Monthly Product Roadmap Update to Tech Leads',
    project: 'Product Delivery',
    priority: 'Medium',
    status: 'To Do',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    impactScore: 7,
  },
  {
    id: 'notion-5',
    title: 'Conduct Quarterly Leadership Persona & Growth Assessment',
    project: 'Personal Development',
    priority: 'Low',
    status: 'Done',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    impactScore: 8,
  },
];

export const MOCK_KRISP_TRANSCRIPTS: KrispTranscription[] = [
  {
    id: 'krisp-1',
    title: 'Product Strategy & AI Architecture Review with Engineering',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    duration: '45 mins',
    rawText: `Alex: Let's discuss our vision for the personal dashboard and executive AI clone. We need local persistence for privacy and high speed.
Marcus: Agreed. Using LocalStorage/IndexedDB for local decision logs guarantees data ownership.
David: We should also build a Krisp parser that extracts action items directly into Notion format.
Alex: Perfect. Decision made: All strategic decision logs will stay 100% on the user's laptop in an offline-capable database.
Action items: Alex to write the leadership decision framework, David to finalize Krisp parser, Marcus to approve engineering resources.`,
    summary: 'Aligned on 100% local persistence for decision logs and privacy-first local AI clone knowledge repository.',
    decisions: [
      'Store all executive decision logs & KB 100% locally on the user laptop.',
      'Adopt Vite + React + IndexedDB for desktop dashboard speed and privacy.',
    ],
    actionItems: [
      'Alex: Draft leadership decision rules for AI Clone training.',
      'David: Build automated Krisp note parser.',
      'Marcus: Finalize Q3 engineering allocation.',
    ],
    keyTakeaways: [
      'Privacy and local control are non-negotiable for executive decision records.',
      'Integration with Outlook and Notion boosts day-to-day workflow by 5x.',
    ],
  },
  {
    id: 'krisp-2',
    title: 'Quarterly OKR & Product Execution Alignment Call',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    duration: '30 mins',
    rawText: `Sarah: Alex, your strategic direction on product execution tools is driving high impact across teams.
Alex: Thanks Sarah. We are focusing on empowering leaders to scale their presence through structured decision playbooks.
Sarah: Let's ensure we present this to the board next month.`,
    summary: 'CEO approved strategic focus on executive productivity and AI clone decision playbooks.',
    decisions: ['Include Executive AI Clone capabilities in board presentation.'],
    actionItems: ['Prepare board slide deck preview by Thursday.'],
    keyTakeaways: ['Executive board is extremely supportive of AI leadership productivity tools.'],
  },
];

export const MOCK_APP_SHORTCUTS: AppShortcut[] = [
  {
    id: 'app-1',
    name: 'Outlook (Web & App)',
    category: 'Communication',
    icon: 'Mail',
    url: 'https://outlook.office.com/mail/',
    isLocalUri: false,
    pinned: true,
    launchCount: 42,
  },
  {
    id: 'app-2',
    name: 'Microsoft Teams',
    category: 'Communication',
    icon: 'MessageSquare',
    url: 'https://teams.microsoft.com',
    isLocalUri: false,
    pinned: true,
    launchCount: 38,
  },
  {
    id: 'app-3',
    name: 'Notion Workspace',
    category: 'Productivity',
    icon: 'FileText',
    url: 'https://notion.so',
    isLocalUri: false,
    pinned: true,
    launchCount: 55,
  },
  {
    id: 'app-4',
    name: 'Krisp Transcriptions',
    category: 'Productivity',
    icon: 'Mic',
    url: 'https://krisp.ai',
    isLocalUri: false,
    pinned: true,
    launchCount: 29,
  },
  {
    id: 'app-5',
    name: 'Figma Design Hub',
    category: 'Design & Code',
    icon: 'Layout',
    url: 'https://figma.com',
    isLocalUri: false,
    pinned: true,
    launchCount: 21,
  },
  {
    id: 'app-6',
    name: 'GitHub Enterprise',
    category: 'Design & Code',
    icon: 'Code',
    url: 'https://github.com',
    isLocalUri: false,
    pinned: false,
    launchCount: 19,
  },
  {
    id: 'app-7',
    name: 'Jira Software',
    category: 'Productivity',
    icon: 'CheckSquare',
    url: 'https://atlassian.net',
    isLocalUri: false,
    pinned: false,
    launchCount: 14,
  },
  {
    id: 'app-8',
    name: 'ChatGPT / Claude AI',
    category: 'Custom',
    icon: 'Bot',
    url: 'https://chatgpt.com',
    isLocalUri: false,
    pinned: true,
    launchCount: 64,
  },
];

export const MOCK_PRIORITY_ALERTS: PriorityAlert[] = [
  {
    id: 'alert-1',
    source: 'Teams',
    sender: 'CEO Sarah Jenkins',
    message: 'Alex, can you hop on a quick 5-min call regarding the Board Deck release scores?',
    timestamp: '10 mins ago',
    urgency: 'Critical',
    handled: false,
    actionUrl: 'https://teams.microsoft.com',
  },
  {
    id: 'alert-2',
    source: 'Outlook',
    sender: 'David Chen (Principal Architect)',
    message: 'Flagged Email: Q3 Architecture Cost & Security Review ready for your sign-off.',
    timestamp: '25 mins ago',
    urgency: 'High',
    handled: false,
    actionUrl: 'https://outlook.office.com',
  },
  {
    id: 'alert-3',
    source: 'Notion',
    sender: 'Notion Bot',
    message: 'Action Item "Approve Q3 Budget" due today at 5:00 PM.',
    timestamp: '1 hour ago',
    urgency: 'Medium',
    handled: true,
  },
];

export const MOCK_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'kb-1',
    title: 'Framework for 100% Local Executive AI Data Privacy',
    category: 'Framework',
    date: '2026-07-28',
    context: 'Evaluating third-party vs local AI models for executive strategic decision logs.',
    decisionMade: 'All decision logs and AI clone rules will stay strictly local on laptop storage.',
    rationale: 'Protects proprietary corporate strategy, employee feedback, and high-level leadership insights.',
    outcome: 'Built high trust with executive board and engineering leadership.',
    tags: ['Privacy', 'Architecture', 'AI Clone', 'Security'],
    impactRating: 5,
  },
  {
    id: 'kb-2',
    title: 'Delegation vs Direct Intervention Strategy in Cross-Functional Conflicts',
    category: 'Influence',
    date: '2026-07-20',
    context: 'Disagreement between Product Management and Engineering on launch timing.',
    decisionMade: 'Empowered Lead Architect to make technical trade-off decisions with strict guardrails.',
    rationale: 'Builds long-term leadership ownership rather than creating top-down bottlenecks.',
    outcome: 'Product shipped 3 days early with zero team friction.',
    tags: ['Leadership', 'Delegation', 'Influence', 'Teamwork'],
    impactRating: 5,
  },
  {
    id: 'kb-3',
    title: 'Krisp Transcriptions into Notion Action Engine Integration',
    category: 'Strategy',
    date: '2026-07-15',
    context: 'High overhead converting verbal meeting decisions into actionable tasks.',
    decisionMade: 'Automate Krisp note parsing with direct export into Notion & Chief of Staff briefing.',
    rationale: 'Saves 4 hours weekly per executive and eliminates dropped action items.',
    outcome: 'Action item completion rate increased by 40%.',
    tags: ['Productivity', 'Notion', 'Krisp', 'Automation'],
    impactRating: 4,
  },
];

export const MOCK_PERSONA_RULES: LeadershipPersonaRule[] = [
  {
    id: 'rule-1',
    trait: 'Strategic Clarity First',
    ruleDescription: 'When evaluating any proposal, always ask: "Does this advance our top 3 strategic priorities for the quarter, or is it a distraction?"',
    exampleScenario: 'Team brings a new shiny AI tool request. Response: Measure against Q3 OKRs first.',
    influenceScore: 95,
  },
  {
    id: 'rule-2',
    trait: 'Empathy + High Accountability',
    ruleDescription: 'Support team members by providing resources and aircover, but expect clear commitments and ownership.',
    exampleScenario: 'Project deadline at risk. Response: Offer strategic help while keeping accountability with project owner.',
    influenceScore: 90,
  },
  {
    id: 'rule-3',
    trait: 'Decisive & Transparent Rationale',
    ruleDescription: 'Make decisions rapidly with available data, log the exact rationale in Local KB, and communicate clearly.',
    exampleScenario: 'Debating cloud vendors under time pressure. Response: Pick option with lowest technical debt and document rationale.',
    influenceScore: 92,
  },
];
