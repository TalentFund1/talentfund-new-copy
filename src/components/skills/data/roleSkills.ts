import { RoleSkillData } from '../types/SkillTypes';
import { loadRoleSkills, saveRoleSkills, initializeRoleSkills } from './roles/roleStorage';
import { getUnifiedSkillData } from './skillDatabaseService';

// Initialize roleSkills object
export const roleSkills: { [key: string]: RoleSkillData } = {};

// Initialize all roles
const roleIds = ["123", "124", "125", "126", "127", "128"];

roleIds.forEach(id => {
  const savedSkills = loadRoleSkills(id);
  roleSkills[id] = savedSkills || initializeRoleSkills(id);
  
  console.log(`Initialized role ${id}:`, {
    title: roleSkills[id].title,
    skillsCount: roleSkills[id].skills.length
  });
});

// Export helper functions
export { saveRoleSkills, loadRoleSkills };

// Helper function to get category for a skill in a role
export const getRoleSkillCategory = (skillTitle: string): string => {
  const skillData = getUnifiedSkillData(skillTitle);
  return skillData.category;
};