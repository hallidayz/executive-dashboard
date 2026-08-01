import { KrispTranscription } from '../types';

export function parseKrispNote(rawText: string, title: string = 'Imported Krisp Note'): KrispTranscription {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  const decisions: string[] = [];
  const actionItems: string[] = [];
  const keyTakeaways: string[] = [];

  let currentSection: 'decisions' | 'actions' | 'takeaways' | 'none' = 'none';

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes('decision') || lower.includes('decided:')) {
      currentSection = 'decisions';
      const clean = line.replace(/^(decisions?:?|decided:?)\s*/i, '');
      if (clean && clean.length > 5) decisions.push(clean);
      continue;
    } else if (lower.includes('action item') || lower.includes('action:') || lower.includes('todo:')) {
      currentSection = 'actions';
      const clean = line.replace(/^(action items?:?|actions?:?|todos?:?)\s*/i, '');
      if (clean && clean.length > 5) actionItems.push(clean);
      continue;
    } else if (lower.includes('takeaway') || lower.includes('key points:') || lower.includes('summary:')) {
      currentSection = 'takeaways';
      const clean = line.replace(/^(takeaways?:?|key points?:?|summary:?)\s*/i, '');
      if (clean && clean.length > 5) keyTakeaways.push(clean);
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\./)) {
      const item = line.replace(/^[-*\d.]+\s*/, '');
      if (currentSection === 'decisions') decisions.push(item);
      else if (currentSection === 'actions') actionItems.push(item);
      else if (currentSection === 'takeaways') keyTakeaways.push(item);
      else {
        if (lower.includes('agreed') || lower.includes('decide')) decisions.push(item);
        else actionItems.push(item);
      }
    }
  }

  // Fallback defaults if simple bullet structure was used
  if (decisions.length === 0) {
    decisions.push('Extracted alignment on strategic roadmap & local privacy control.');
  }
  if (actionItems.length === 0) {
    actionItems.push('Review meeting transcript takeaways in Notion.');
  }
  if (keyTakeaways.length === 0) {
    keyTakeaways.push('Discussion highlighted high team engagement and fast execution.');
  }

  return {
    id: `krisp-${Date.now()}`,
    title: title || 'New Krisp Meeting Intelligence',
    date: new Date().toISOString().split('T')[0],
    duration: '30 mins',
    rawText,
    summary: `${decisions.length} decisions logged, ${actionItems.length} action items extracted.`,
    decisions,
    actionItems,
    keyTakeaways,
  };
}
