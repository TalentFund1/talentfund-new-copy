import { roleSkills } from '../../../data/roleSkills';
import { RoleState, SkillState } from '../types/competencyTypes';

export const initializeRoleState = (roleId: string): RoleState => {
  console.log('Initializing new state for role:', roleId);
  
  const currentRoleSkills = roleSkills[roleId as keyof typeof roleSkills];
  if (!currentRoleSkills) {
    console.warn('No skills found for role:', roleId);
    return {};
  }

  const allSkills = [
    ...currentRoleSkills.specialized,
    ...currentRoleSkills.common,
    ...currentRoleSkills.certifications
  ];

  const initialState: RoleState = {};
  
  allSkills.forEach(skill => {
    initialState[skill.title] = {};
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'm3', 'm4', 'm5', 'm6'].forEach(level => {
      initialState[skill.title][level] = {
        level: 'unspecified',
        required: 'preferred'
      };
    });
  });

  return initialState;
};