import {
  CalendarEvent,
  EmailMessage,
  NotionActionItem,
  KrispTranscription,
  KnowledgeEntry,
  LeadershipPersonaRule,
  ChiefOfStaffSummary,
} from '../types';

export function generateChiefOfStaffSummary(
  calendar: CalendarEvent[],
  emails: EmailMessage[],
  notion: NotionActionItem[],
  krisp: KrispTranscription[]
): ChiefOfStaffSummary {
  const urgentEmails = emails.filter(e => e.isPriority || e.category === 'VIP Sender' || e.category === 'Urgent');
  const highImpactNotion = notion.filter(n => n.status !== 'Done' && (n.priority === 'High' || n.impactScore >= 8));
  const todayEvents = calendar.filter(c => c.status !== 'Tentative');

  const topDirectives: string[] = [];
  if (urgentEmails.length > 0) {
    topDirectives.push(`VIP Email from ${urgentEmails[0].sender}: "${urgentEmails[0].subject}" requires your strategic review.`);
  }
  if (highImpactNotion.length > 0) {
    topDirectives.push(`High Impact Action Item: "${highImpactNotion[0].title}" (Impact Score: ${highImpactNotion[0].impactScore}/10).`);
  }
  if (krisp.length > 0 && krisp[0].decisions.length > 0) {
    topDirectives.push(`Latest Krisp Decision: "${krisp[0].decisions[0]}" ready to publish to Notion.`);
  }

  const mustDoToday = [
    `Complete prep notes for ${todayEvents.length} scheduled leadership syncs.`,
    ...highImpactNotion.slice(0, 2).map(n => `Notion Task: ${n.title}`),
  ];

  const delegateOrDefer = [
    `Defer newsletter & non-urgent email digests (${emails.filter(e => e.category === 'Read Later').length} pending).`,
    `Delegate technical routine review to Engineering Leads.`,
  ];

  const tomorrowLookahead = [
    `Review preliminary Q3 OKR deck before morning leadership call.`,
    `Verify Notion action item status for cross-functional initiatives.`,
    `Schedule 1:1 prep for afternoon stakeholder alignment.`,
  ];

  const weekLookahead = [
    `Finalize board presentation deck & executive clone decision framework.`,
    `Conduct mid-week leadership reflection & log decision rationales into Local KB.`,
    `Review total meeting energy load vs deep focus hours.`,
  ];

  const beyondLookahead = [
    `Quarterly strategic growth evaluation: Assess personal impact as a leader & strategist.`,
    `Expand AI clone training dataset with 10+ new logged decisions.`,
    `Strengthen cross-departmental influence and executive presence.`,
  ];

  const calendarDensity = Math.min(100, Math.round((todayEvents.length * 1.5 / 8) * 100));

  return {
    dailyTagline: `Focus today on Strategic Execution & Board Alignment (${todayEvents.length} Meetings, ${urgentEmails.length} Priority Alerts).`,
    topDirectives,
    mustDoToday,
    delegateOrDefer,
    tomorrowLookahead,
    weekLookahead,
    beyondLookahead,
    calendarDensityPercentage: calendarDensity,
  };
}

export function simulateAICloneResponse(
  scenarioQuery: string,
  kbEntries: KnowledgeEntry[],
  personaRules: LeadershipPersonaRule[],
  userName: string = 'Alex Halliday'
): {
  simulatedResponse: string;
  matchedRules: string[];
  strategicConfidence: number;
  recommendedAction: string;
} {
  const queryLower = scenarioQuery.toLowerCase();
  
  const matchedRules = personaRules
    .filter(r => queryLower.includes(r.trait.toLowerCase()) || queryLower.includes('decision') || queryLower.includes('strategy') || queryLower.includes('priority'))
    .map(r => `${r.trait}: ${r.ruleDescription}`);

  let simulatedResponse = `As ${userName}, when faced with this scenario: "${scenarioQuery}", my core stance is to lead with strategic clarity and maintain absolute accountability.`;

  if (queryLower.includes('budget') || queryLower.includes('cost') || queryLower.includes('resource')) {
    simulatedResponse += `\n\n1. Rationale: I prioritize initiatives that yield measurable impact (8+/10 impact score) and protect team bandwidth.\n2. Action: Require a 1-page business justification before approving additional allocation, and log the decision rationale in our Local KB.`;
  } else if (queryLower.includes('conflict') || queryLower.includes('delay') || queryLower.includes('deadline')) {
    simulatedResponse += `\n\n1. Rationale: I provide strategic aircover for the team while holding clear ownership. Never compromise on core quality or security.\n2. Action: Empower lead owners to resolve trade-offs, but establish daily 15-min syncs until green.`;
  } else {
    simulatedResponse += `\n\n1. Rationale: Evaluate against our top 3 quarterly goals. Eliminate non-essential noise and defer low-impact tasks.\n2. Action: Document decision in Notion and notify key stakeholders via Outlook with explicit next steps.`;
  }

  return {
    simulatedResponse,
    matchedRules: matchedRules.length > 0 ? matchedRules : [`Strategic Clarity First`, `High Accountability + Empathy`],
    strategicConfidence: 94,
    recommendedAction: `Log this simulated decision into Local Knowledge Base to continuously refine your Executive AI Clone.`,
  };
}
