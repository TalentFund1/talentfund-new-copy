import { UnifiedSkill } from '../types/SkillTypes';
import { universalSkillsDatabase, getAllSkills, getSkillByTitle } from './skills/universalSkillsDatabase';

const generateSkillId = (title: string): string => {
  const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SKILL_${cleanTitle}_${randomNum}`;
};

export const getUnifiedSkillData = (skillTitle: string | undefined): UnifiedSkill => {
  if (!skillTitle) {
    console.warn('Attempted to get unified skill data with undefined title');
    return createDefaultSkill('unknown');
  }

  const skill = getSkillByTitle(skillTitle);
  if (skill) {
    return {
      ...skill,
      id: skill.id || generateSkillId(skill.title),
      minimumLevel: 'beginner',
      requirementLevel: 'required',
      skillScore: 0,
      metrics: {
        growth: skill.growth,
        salary: skill.salary,
        skillScore: 0
      }
    };
  }

  console.log(`Skill not found in database: ${skillTitle}, creating new entry`);
  return createDefaultSkill(skillTitle);
};

const createDefaultSkill = (title: string): UnifiedSkill => ({
  id: generateSkillId(title),
  title: title,
  subcategory: 'General',
  category: 'common',
  businessCategory: 'Information Technology',
  weight: 'necessary',
  level: 'intermediate',
  growth: '10%',
  salary: '$0',
  skillScore: 0,
  minimumLevel: 'beginner',
  requirementLevel: 'required',
  metrics: {
    growth: '10%',
    salary: '$0',
    skillScore: 0
  },
  benchmarks: { B: true, R: true, M: true, O: true }
});

export const getAllUnifiedSkills = (): UnifiedSkill[] => {
  return getAllSkills();
};

console.log('Skill database service initialized');