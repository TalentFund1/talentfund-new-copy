import { Skills, getAllSkills as getSkillsFromSource } from './skills/data/skills/allSkills';
import { UnifiedSkill } from './skills/types/SkillTypes';
import { normalizeSkillTitle } from './skills/utils/normalization';
import { getSkillSalary } from './skills/data/utils/metrics';

// Get all skills and normalize their titles
const skills: UnifiedSkill[] = getSkillsFromSource().map(skill => ({
  ...skill,
  title: normalizeSkillTitle(skill.title),
  salary: skill.salary || getSkillSalary(skill.title) // Ensure salary is always set
}));

// Helper function to get unique skills by title
const getUniqueSkills = (skillsArray: UnifiedSkill[]) => {
  const seen = new Set();
  return skillsArray.filter(skill => {
    const normalizedTitle = normalizeSkillTitle(skill.title);
    const duplicate = seen.has(normalizedTitle);
    seen.add(normalizedTitle);
    return !duplicate;
  });
};

// Get all unique skills without filtering by category
export const allSkillsList = getUniqueSkills(skills);

// Export skill titles and objects
export const technicalSkills = allSkillsList.map(skill => skill.title);
export const softSkills = allSkillsList.map(skill => skill.title);
export const technicalSkillObjects = allSkillsList;
export const softSkillObjects = allSkillsList;
export const allSkillObjects = allSkillsList;

// Export the complete skills array
export const getAllSkills = (): UnifiedSkill[] => skills;

console.log('Loaded skills:', {
  total: skills.length,
  allUnique: allSkillsList.length,
  technical: technicalSkills.length,
  soft: softSkills.length
});