import { ConnectorItem } from '../types';

export const INITIAL_CONNECTORS_CATALOG: ConnectorItem[] = [
  // MICROSOFT CONNECTORS (SOC2 / ISO27001 VETTED)
  {
    id: 'conn-ms-outlook',
    name: 'Microsoft Outlook 365',
    ecosystem: 'Microsoft',
    icon: 'Mail',
    description: 'Sync calendar meetings, priority email streams, attendees, & RSVP statuses.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001 • HIPAA Ready',
    connectedUser: 'alex.halliday@enterprise.com',
    lastSynced: 'Just now',
    eli5Instructions: [
      'ELI5: Logging in with your work email acts as a keycard for Outlook.',
      'Step 1: Click "Sign In with Microsoft IDP".',
      'Step 2: Enter your work username and password in the secure popup.',
      'Step 3: Click "Approve Access" and we auto-fill all tokens for you!',
    ],
    fieldsRequired: [
      { key: 'clientId', label: 'Azure Application (Client) ID', placeholder: 'e.g. 00000000-0000-0000-0000-000000000000' },
      { key: 'tenantId', label: 'Directory (Tenant) ID', placeholder: 'e.g. common or enterprise-tenant-id' },
    ],
  },
  {
    id: 'conn-ms-teams',
    name: 'Microsoft Teams',
    ecosystem: 'Microsoft',
    icon: 'MessageSquare',
    description: 'Real-time VIP chat alerts, channel notifications, & meeting join links.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001 • FedRAMP High',
    connectedUser: 'alex.halliday@enterprise.com',
    lastSynced: '5 mins ago',
    eli5Instructions: [
      'ELI5: Teams sends a tap on your shoulder whenever a VIP messages you.',
      'Step 1: Click "Sign In with Microsoft IDP".',
      'Step 2: Authenticate with your Microsoft credentials.',
    ],
    fieldsRequired: [
      { key: 'clientId', label: 'Teams App Client ID', placeholder: 'e.g. 00000000-0000-0000-0000-000000000000' },
    ],
  },
  {
    id: 'conn-ms-sharepoint',
    name: 'Microsoft SharePoint Online',
    ecosystem: 'Microsoft',
    icon: 'FileText',
    description: 'Search corporate document libraries, executive decks, & board presentations.',
    authType: 'IDP_OAUTH',
    status: 'Not Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001',
    eli5Instructions: [
      'ELI5: Connects your company document filing cabinet to your local laptop AI.',
      'Step 1: Click "Sign In with Microsoft IDP".',
    ],
    fieldsRequired: [
      { key: 'siteUrl', label: 'SharePoint Site Web URL', placeholder: 'https://company.sharepoint.com/sites/Executive' },
    ],
  },
  {
    id: 'conn-ms-azure-devops',
    name: 'Azure DevOps & Boards',
    ecosystem: 'Microsoft',
    icon: 'Code',
    description: 'Pull sprint items, active engineering bugs, & release deployment status.',
    authType: 'IDP_OAUTH',
    status: 'Not Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001',
    eli5Instructions: [
      'ELI5: Links engineering sprint cards to your Head of Product launch heatmap.',
      'Step 1: Click "Sign In with Microsoft IDP".',
    ],
    fieldsRequired: [
      { key: 'orgName', label: 'Azure DevOps Org Name', placeholder: 'e.g. EnterpriseProductGroup' },
    ],
  },

  // CLAUDE CONNECTORS (ANTHROPIC SOC2 / GDPR VETTED)
  {
    id: 'conn-claude-workspace',
    name: 'Anthropic Claude Workspace',
    ecosystem: 'Claude',
    icon: 'Sparkles',
    description: 'Claude 3.7 Sonnet workspace, artifacts sync, & executive strategy prompts.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • GDPR • HIPAA Ready',
    connectedUser: 'alex.halliday@anthropic.user',
    lastSynced: '2 mins ago',
    eli5Instructions: [
      'ELI5: Connects your Claude account so your Chief of Staff can write artifacts.',
      'Step 1: Click "Sign In with Claude Account".',
    ],
    fieldsRequired: [
      { key: 'apiKey', label: 'Anthropic API Key', placeholder: 'sk-ant-api03-...', isSecret: true },
    ],
  },
  {
    id: 'conn-claude-code',
    name: 'Claude Code Interpreter & Artifacts',
    ecosystem: 'Claude',
    icon: 'Code',
    description: 'Execute Python/JS data analysis and build interactive UI artifacts.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001',
    lastSynced: '10 mins ago',
    eli5Instructions: [
      'ELI5: Gives your Chief of Staff a calculator and notebook to run scripts.',
    ],
    fieldsRequired: [
      { key: 'sandboxMode', label: 'Sandbox Isolation', placeholder: 'Enabled (Local Laptop)' },
    ],
  },

  // CHATGPT CONNECTORS (OPENAI ENTERPRISE VETTED)
  {
    id: 'conn-chatgpt-plugins',
    name: 'OpenAI ChatGPT & Custom Actions',
    ecosystem: 'ChatGPT',
    icon: 'Bot',
    description: 'ChatGPT Custom Actions, Web Browsing, & GPT-4o reasoning pipelines.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • GDPR • CCPA Compliant',
    connectedUser: 'alex.halliday@openai.user',
    lastSynced: '1 min ago',
    eli5Instructions: [
      'ELI5: Connect your ChatGPT account to run Custom GPT actions automatically.',
      'Step 1: Click "Sign In with OpenAI Account".',
    ],
    fieldsRequired: [
      { key: 'apiKey', label: 'OpenAI API Key', placeholder: 'sk-proj-...', isSecret: true },
    ],
  },

  // GOOGLE CONNECTORS (GOOGLE WORKSPACE ENTERPRISE VETTED)
  {
    id: 'conn-google-workspace',
    name: 'Google Workspace & Gmail',
    ecosystem: 'Google',
    icon: 'Globe',
    description: 'Gmail priority messages, Google Calendar sync, & Google Docs briefing.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001 • FedRAMP High',
    connectedUser: 'ahalliday@gmail.com',
    lastSynced: '15 mins ago',
    eli5Instructions: [
      'ELI5: Connects your Google Calendar and Gmail to your central dashboard.',
      'Step 1: Click "Sign In with Google IDP".',
    ],
    fieldsRequired: [
      { key: 'clientId', label: 'Google OAuth Client ID', placeholder: '...apps.googleusercontent.com' },
    ],
  },
  {
    id: 'conn-google-sheets',
    name: 'Google Sheets & Drive',
    ecosystem: 'Google',
    icon: 'FileText',
    description: 'Export OKR spreadsheets and read product metrics directly from Google Sheets.',
    authType: 'IDP_OAUTH',
    status: 'Not Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001',
    eli5Instructions: [
      'ELI5: Allows the dashboard to pull rows from your Google Sheets spreadsheets.',
    ],
    fieldsRequired: [
      { key: 'spreadsheetId', label: 'Target Google Sheet ID', placeholder: '1BxiMVs0XRA5nFMdKbBUI6y...' },
    ],
  },

  // N8N AUTOMATION CONNECTORS (SOC2 / OPEN SOURCE VETTED)
  {
    id: 'conn-n8n-webhook',
    name: 'n8n Automation Engine & Webhooks',
    ecosystem: 'n8n',
    icon: 'Zap',
    description: 'Trigger 100+ n8n workflow integrations (Postgres, Slack, GitHub, Jira, HubSpot).',
    authType: 'WEBHOOK',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001 • GDPR',
    lastSynced: 'Just now',
    eli5Instructions: [
      'ELI5: n8n is your automated robot helper that connects to 400+ external apps.',
      'Step 1: Enter your local n8n Webhook Endpoint.',
    ],
    fieldsRequired: [
      { key: 'webhookUrl', label: 'n8n Webhook Base URL', placeholder: 'http://localhost:5678/webhook/exec-dash' },
    ],
  },

  // ENTERPRISE SAAS CONNECTORS (LEGAL & COMPLIANCE VETTED)
  {
    id: 'conn-saas-salesforce',
    name: 'Salesforce Enterprise CRM',
    ecosystem: 'Enterprise SaaS',
    icon: 'Globe',
    description: 'Executive pipeline revenue, enterprise ARR forecasts, & key account status.',
    authType: 'IDP_OAUTH',
    status: 'Not Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001 • HIPAA',
    eli5Instructions: [
      'ELI5: Connect your sales deals to your Head of Product execution goals.',
      'Step 1: Click "Sign In with Salesforce IDP".',
    ],
    fieldsRequired: [
      { key: 'instanceUrl', label: 'Salesforce Instance URL', placeholder: 'https://company.my.salesforce.com' },
    ],
  },
  {
    id: 'conn-saas-jira',
    name: 'Atlassian Jira Software',
    ecosystem: 'Enterprise SaaS',
    icon: 'CheckSquare',
    description: 'Epic progress, release sprint velocity, & product roadmap blockers.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001 • GDPR',
    connectedUser: 'alex.halliday@atlassian.user',
    lastSynced: '12 mins ago',
    eli5Instructions: [
      'ELI5: Links engineering Jira tickets to your product launch readiness dashboard.',
      'Step 1: Click "Sign In with Atlassian IDP".',
    ],
    fieldsRequired: [
      { key: 'jiraDomain', label: 'Jira Cloud Domain', placeholder: 'company.atlassian.net' },
    ],
  },
  {
    id: 'conn-saas-servicenow',
    name: 'ServiceNow Enterprise ITSM',
    ecosystem: 'Enterprise SaaS',
    icon: 'Shield',
    description: 'Incident escalation tracking, P1 outage alerts, & change management approvals.',
    authType: 'IDP_OAUTH',
    status: 'Not Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • FedRAMP High • ISO 27001',
    eli5Instructions: [
      'ELI5: Automatically flags major system incidents in your Priority Alerts ticker.',
    ],
    fieldsRequired: [
      { key: 'instance', label: 'ServiceNow Instance Domain', placeholder: 'company.service-now.com' },
    ],
  },
  {
    id: 'conn-saas-slack',
    name: 'Slack Enterprise Grid',
    ecosystem: 'Enterprise SaaS',
    icon: 'MessageSquare',
    description: 'Post Chief of Staff daily summaries to #product-leadership & receive VIP alerts.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001 • HIPAA',
    connectedUser: 'alex.halliday@slack.user',
    lastSynced: '3 mins ago',
    eli5Instructions: [
      'ELI5: Click "Sign In with Slack IDP" to authorize workspace messaging.',
    ],
    fieldsRequired: [
      { key: 'workspaceUrl', label: 'Slack Workspace URL', placeholder: 'company.slack.com' },
    ],
  },

  // DEVELOPER & DATA INFRASTRUCTURE CONNECTORS
  {
    id: 'conn-dev-github',
    name: 'GitHub Enterprise Cloud',
    ecosystem: 'Developer & Data',
    icon: 'Code',
    description: 'Repository PR reviews, deployment workflow status, & release tag tracking.',
    authType: 'IDP_OAUTH',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001',
    connectedUser: 'ahalliday-gh',
    lastSynced: 'Just now',
    eli5Instructions: [
      'ELI5: Connect your GitHub repos so your AI Co-Pilot can track PR release readiness.',
    ],
    fieldsRequired: [
      { key: 'org', label: 'GitHub Org / Repo', placeholder: 'enterprise/product-core' },
    ],
  },
  {
    id: 'conn-dev-snowflake',
    name: 'Snowflake Data Cloud',
    ecosystem: 'Developer & Data',
    icon: 'Database',
    description: 'Query product usage analytics, active daily users (DAU), & retention metrics.',
    authType: 'API_KEY',
    status: 'Not Connected',
    isVettedLegal: true,
    complianceCert: 'SOC2 Type II • ISO 27001 • HIPAA',
    eli5Instructions: [
      'ELI5: Pull live product usage charts into your Executive Command Center.',
    ],
    fieldsRequired: [
      { key: 'account', label: 'Snowflake Account Identifier', placeholder: 'xy12345.us-east-1' },
      { key: 'warehouse', label: 'Warehouse Name', placeholder: 'COMPUTE_WH' },
    ],
  },
  {
    id: 'conn-dev-postgres',
    name: 'Local PostgreSQL & IndexedDB',
    ecosystem: 'Developer & Data',
    icon: 'Database',
    description: '100% Offline local laptop database for decision rationales and vector embeddings.',
    authType: 'API_KEY',
    status: 'Connected',
    isVettedLegal: true,
    complianceCert: 'Local Machine Isolation • Zero Cloud Exposure',
    lastSynced: 'Live (IndexedDB)',
    eli5Instructions: [
      'ELI5: Stored 100% locally on your laptop storage. Zero data leaves your computer.',
    ],
    fieldsRequired: [
      { key: 'connectionString', label: 'Local Connection String', placeholder: 'postgresql://localhost:5432/exec_dash' },
    ],
  },
];
