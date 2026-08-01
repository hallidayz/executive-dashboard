import { CustomSkill } from '../types';

const STORAGE_KEY = 'executive_dashboard_custom_skills_v1';

export const saveSkillToPersistentStorage = (skill: CustomSkill): CustomSkill[] => {
  const existing = getPersistentSkills();
  const index = existing.findIndex((s) => s.id === skill.id);

  let updated: CustomSkill[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = { ...skill, createdAt: new Date().toISOString() };
  } else {
    updated = [skill, ...existing];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // Trigger custom window event for real-time bi-directional sync across tabs & local tools
  window.dispatchEvent(new CustomEvent('knowledge_base_skill_sync', { detail: updated }));
  return updated;
};

export const getPersistentSkills = (): CustomSkill[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading persistent skills:', e);
    return [];
  }
};
