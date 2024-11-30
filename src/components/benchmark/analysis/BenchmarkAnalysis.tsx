import { useSkillsMatrixStore } from "../skills-matrix/SkillsMatrixState";
import { useCompetencyStateReader } from "../../skills/competency/CompetencyStateReader";
import { BenchmarkAnalysisCard } from "./BenchmarkAnalysisCard";
import { roleSkills } from "../../skills/data/roleSkills";
import { useToggledSkills } from "../../skills/context/ToggledSkillsContext";
import { getEmployeeSkills } from "../skills-matrix/initialSkills";
import { useTrack } from "../../skills/context/TrackContext";
import { useParams } from "react-router-dom";
import { useRoleStore } from "../RoleBenchmark";

export const BenchmarkAnalysis = () => {
  const { currentStates } = useSkillsMatrixStore();
  const { getSkillCompetencyState } = useCompetencyStateReader();
  const { toggledSkills } = useToggledSkills();
  const { getTrackForRole } = useTrack();
  const { id } = useParams();
  const { selectedRole, selectedLevel } = useRoleStore();
  
  console.log('BenchmarkAnalysis - Selected Role Analysis:', {
    selectedRole,
    roleLevel: selectedLevel,
    employeeId: id,
    track: getTrackForRole(selectedRole),
    currentStates
  });

  const employeeSkills = getEmployeeSkills(id || "");
  console.log('Employee skills loaded for comparison:', employeeSkills);

  const currentRoleSkills = roleSkills[selectedRole as keyof typeof roleSkills];
  if (!currentRoleSkills) {
    console.error('No role skills found for selected role:', selectedRole);
    return null;
  }

  const allRoleSkills = [
    ...currentRoleSkills.specialized,
    ...currentRoleSkills.common,
    ...currentRoleSkills.certifications
  ];

  // First filter by toggled state and map to include required properties
  const processedSkills = allRoleSkills
    .filter(skill => toggledSkills.has(skill.title))
    .map(skill => {
      const employeeSkill = employeeSkills.find(empSkill => empSkill.title === skill.title);
      const roleSkillState = getSkillCompetencyState(skill.title, selectedLevel.toLowerCase(), selectedRole);
      
      return {
        ...skill,
        roleLevel: roleSkillState?.level || 'unspecified',
        employeeLevel: currentStates[skill.title]?.level || employeeSkill?.level || 'unspecified',
        requirement: currentStates[skill.title]?.requirement || 'unknown'
      };
    })
    .sort((a, b) => {
      const aRoleLevel = a.roleLevel;
      const bRoleLevel = b.roleLevel;
      
      // Sort by role level first
      const roleLevelDiff = getLevelPriority(aRoleLevel) - getLevelPriority(bRoleLevel);
      if (roleLevelDiff !== 0) return roleLevelDiff;

      // Then by employee level
      const employeeLevelDiff = getLevelPriority(a.employeeLevel) - getLevelPriority(b.employeeLevel);
      if (employeeLevelDiff !== 0) return employeeLevelDiff;

      // Then by requirement
      const requirementDiff = getSkillGoalPriority(a.requirement) - getSkillGoalPriority(b.requirement);
      if (requirementDiff !== 0) return requirementDiff;

      return a.title.localeCompare(b.title);
    });

  const totalToggledSkills = processedSkills.length;

  const matchingSkills = processedSkills.filter(skill => {
    const employeeSkill = employeeSkills.find(empSkill => empSkill.title === skill.title);
    return employeeSkill !== undefined;
  });

  const competencyMatchingSkills = matchingSkills.filter(skill => {
    const roleSkillState = getSkillCompetencyState(skill.title, selectedLevel.toLowerCase(), selectedRole);
    if (!roleSkillState) return false;

    const employeeSkillLevel = currentStates[skill.title]?.level || skill.level || 'unspecified';
    const roleSkillLevel = roleSkillState.level;

    const employeePriority = getLevelPriority(employeeSkillLevel);
    const rolePriority = getLevelPriority(roleSkillLevel);

    return employeePriority >= rolePriority;
  });

  const skillGoalMatchingSkills = matchingSkills.filter(skill => {
    const skillState = currentStates[skill.title];
    if (!skillState) return false;
    return skillState.requirement === 'required' || 
           skillState.requirement === 'skill_goal';
  });

  console.log('Selected role match calculations:', {
    roleId: selectedRole,
    skillMatches: matchingSkills.length,
    competencyMatches: competencyMatchingSkills.length,
    skillGoalMatches: skillGoalMatchingSkills.length,
    totalSkills: totalToggledSkills
  });

  return (
    <BenchmarkAnalysisCard 
      skillMatch={{
        current: matchingSkills.length,
        total: totalToggledSkills
      }}
      competencyMatch={{
        current: competencyMatchingSkills.length,
        total: totalToggledSkills
      }}
      skillGoals={{
        current: skillGoalMatchingSkills.length,
        total: totalToggledSkills
      }}
    />
  );
};

const getLevelPriority = (level: string = 'unspecified') => {
  const priorities: { [key: string]: number } = {
    'advanced': 0,
    'intermediate': 1,
    'beginner': 2,
    'unspecified': 3
  };
  return priorities[level.toLowerCase()] ?? 3;
};

const getSkillGoalPriority = (requirement: string = 'unknown') => {
  const priorities: { [key: string]: number } = {
    'required': 0,
    'skill_goal': 1,
    'preferred': 2,
    'not_interested': 3,
    'unknown': 4
  };
  return priorities[requirement.toLowerCase()] ?? 4;
};