import { EmployeeSkillAchievement, SkillLevel } from '../../employee/types/employeeSkillTypes';
import { RoleSkillRequirement } from '../../skills/types/roleSkillTypes';
import { SkillComparison, SkillComparisonResult } from '../../skills/types/skillComparison';

export const getLevelPriority = (level: string = 'unspecified'): number => {
  const priorities: Record<string, number> = {
    'advanced': 3,
    'intermediate': 2,
    'beginner': 1,
    'unspecified': 0
  };
  return priorities[level.toLowerCase()] ?? 0;
};

export const compareSkillLevels = (
  employeeSkill: EmployeeSkillAchievement,
  roleRequirement: RoleSkillRequirement
): SkillComparison => {
  const employeePriority = getLevelPriority(employeeSkill.level);
  const requiredPriority = getLevelPriority(roleRequirement.minimumLevel);

  console.log('Comparing skill levels:', {
    skill: employeeSkill.title,
    employeeLevel: employeeSkill.level,
    requiredLevel: roleRequirement.minimumLevel,
    employeePriority,
    requiredPriority
  });

  const gapLevel = employeePriority - requiredPriority;
  const matchPercentage = (employeePriority / Math.max(requiredPriority, 1)) * 100;

  return {
    employeeSkill,
    roleRequirement,
    matchPercentage,
    gapLevel
  };
};

export const getSkillComparisonResult = (
  employeeSkills: EmployeeSkillAchievement[],
  roleRequirements: RoleSkillRequirement[]
): SkillComparisonResult => {
  if (roleRequirements.length === 0) {
    return {
      matches: [],
      totalMatchPercentage: 0,
      missingSkills: [],
      exceedingSkills: employeeSkills
    };
  }

  const matches: SkillComparison[] = [];
  const missingSkills: RoleSkillRequirement[] = [];
  const exceedingSkills: EmployeeSkillAchievement[] = [];

  // Find matching and missing skills
  roleRequirements.forEach(requirement => {
    const employeeSkill = employeeSkills.find(skill => skill.title === requirement.title);
    if (employeeSkill) {
      matches.push(compareSkillLevels(employeeSkill, requirement));
    } else {
      missingSkills.push(requirement);
    }
  });

  // Find exceeding skills
  employeeSkills.forEach(skill => {
    if (!roleRequirements.some(req => req.title === skill.title)) {
      exceedingSkills.push(skill);
    }
  });

  const totalMatchPercentage = matches.reduce((sum, match) => sum + match.matchPercentage, 0) / 
    (roleRequirements.length || 1);

  console.log('Calculated skill comparison result:', {
    totalMatches: matches.length,
    missingSkills: missingSkills.length,
    exceedingSkills: exceedingSkills.length,
    totalMatchPercentage
  });

  return {
    matches,
    totalMatchPercentage,
    missingSkills,
    exceedingSkills
  };
};