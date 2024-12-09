import { Skill, SkillWeight, SkillCategory } from '../types/SkillTypes';
import { aiSkills } from './skills/aiSkills';
import { backendSkills } from './skills/backendSkills';
import { commonSkills } from './skills/commonSkills';
import { certificationSkills } from './skills/certificationSkills';

// Helper function to determine skill category based on growth and type
const determineCategory = (growth: string, type: string): SkillWeight => {
  const growthValue = parseFloat(growth);
  if (growthValue >= 25) return 'Critical';
  if (type === 'specialized' || type === 'common') return 'Technical';
  return 'Necessary';
};

// Convert existing skills to new format
const convertSkill = (skill: any, type: SkillCategory): Skill => {
  console.log('Converting skill:', { title: skill.title, type });
  
  return {
    id: `SKILL_${skill.title.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`,
    title: skill.title,
    category: type,
    subcategory: skill.subcategory,
    type: determineCategory(skill.growth || '0%', type),
    level: skill.level || 'beginner',
    growth: skill.growth || '0%',
    salary: skill.salary || '$0',
    confidence: skill.confidence || 'medium',
    benchmarks: {
      B: true,
      R: true,
      M: true,
      O: true
    }
  };
};

// Combine and convert all skills
const consolidateSkills = (): Skill[] => {
  console.log('Starting skills consolidation...');
  
  const allSkills: Skill[] = [
    ...aiSkills.map(skill => convertSkill(skill, skill.category)),
    ...backendSkills.map(skill => convertSkill(skill, skill.category)),
    ...commonSkills.map(skill => convertSkill(skill, skill.category)),
    ...certificationSkills.map(skill => convertSkill(skill, skill.category))
  ];

  console.log('Consolidated skills count:', allSkills.length);
  return allSkills;
};

export const skillsDatabase = consolidateSkills();

// Helper functions
export const getSkillByTitle = (title: string): Skill | undefined => {
  return skillsDatabase.find(skill => skill.title === title);
};

export const getSkillsByCategory = (category: SkillWeight): Skill[] => {
  return skillsDatabase.filter(skill => skill.type === category.toLowerCase());
};

export const getSkillsByType = (type: SkillCategory): Skill[] => {
  return skillsDatabase.filter(skill => skill.category === type);
};