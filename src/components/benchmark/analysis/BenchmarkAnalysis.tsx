import { useSkillsMatrixStore } from "../skills-matrix/SkillsMatrixState";
import { useCompetencyStateReader } from "../../skills/competency/CompetencyStateReader";
import { BenchmarkAnalysisCard } from "./BenchmarkAnalysisCard";
import { roleSkills } from "../../skills/data/roleSkills";
import { useToggledSkills } from "../../skills/context/ToggledSkillsContext";
import { getEmployeeSkills } from "../skills-matrix/initialSkills";
import { useEffect, useState, useMemo } from "react";

interface BenchmarkAnalysisProps {
  selectedRole: string;
  roleLevel: string;
  employeeId: string;
}

export const BenchmarkAnalysis = ({ selectedRole, roleLevel, employeeId }: BenchmarkAnalysisProps) => {
  const { currentStates } = useSkillsMatrixStore();
  const { getSkillCompetencyState } = useCompetencyStateReader();
  const { toggledSkills } = useToggledSkills();
  const [analysisData, setAnalysisData] = useState({
    skillMatch: { current: 0, total: 0 },
    competencyMatch: { current: 0, total: 0 },
    skillGoals: { current: 0, total: 0 }
  });

  // Memoize the role skills to prevent unnecessary recalculations
  const currentRoleSkills = useMemo(() => {
    const skills = roleSkills[selectedRole as keyof typeof roleSkills];
    if (!skills) {
      console.error('No role skills found for selected role:', selectedRole);
      return null;
    }
    return skills;
  }, [selectedRole]);

  // Memoize the employee skills
  const employeeSkills = useMemo(() => {
    return getEmployeeSkills(employeeId);
  }, [employeeId]);

  useEffect(() => {
    if (!currentRoleSkills) return;

    console.log('Recalculating benchmark analysis:', {
      selectedRole,
      roleLevel,
      toggledSkillsCount: toggledSkills.size,
      currentStatesCount: Object.keys(currentStates).length
    });

    // Get all required skills for the role
    const allRoleSkills = [
      ...currentRoleSkills.specialized,
      ...currentRoleSkills.common,
      ...currentRoleSkills.certifications
    ];

    // Filter to get only required skills based on role level
    const requiredRoleSkills = allRoleSkills.filter(skill => {
      const competencyState = getSkillCompetencyState(skill.title, roleLevel.toLowerCase());
      return competencyState?.required === 'required';
    });

    const totalRequiredSkills = requiredRoleSkills.length;
    console.log('Total required skills for role:', totalRequiredSkills);

    if (totalRequiredSkills === 0) {
      setAnalysisData({
        skillMatch: { current: 0, total: 0 },
        competencyMatch: { current: 0, total: 0 },
        skillGoals: { current: 0, total: 0 }
      });
      return;
    }

    // Calculate matching skills
    const matchingSkills = requiredRoleSkills.filter(roleSkill => {
      const employeeSkill = employeeSkills.find(empSkill => empSkill.title === roleSkill.title);
      return employeeSkill !== undefined;
    });

    // Calculate competency matches
    const competencyMatchingSkills = matchingSkills.filter(skill => {
      const roleSkillState = getSkillCompetencyState(skill.title, roleLevel.toLowerCase());
      if (!roleSkillState) return false;

      const employeeSkillLevel = currentStates[skill.title]?.level || skill.level || 'unspecified';
      const roleSkillLevel = roleSkillState.level;

      const getLevelPriority = (level: string = 'unspecified') => {
        const priorities: { [key: string]: number } = {
          'advanced': 3,
          'intermediate': 2,
          'beginner': 1,
          'unspecified': 0
        };
        return priorities[level.toLowerCase()] ?? 0;
      };

      const employeePriority = getLevelPriority(employeeSkillLevel);
      const rolePriority = getLevelPriority(roleSkillLevel);

      return employeePriority >= rolePriority;
    });

    // Calculate skill goal matches
    const skillGoalMatchingSkills = matchingSkills.filter(skill => {
      const skillState = currentStates[skill.title];
      if (!skillState) return false;
      return skillState.requirement === 'required' || 
             skillState.requirement === 'skill_goal';
    });

    console.log('Analysis results:', {
      totalSkills: totalRequiredSkills,
      matchingSkills: matchingSkills.length,
      competencyMatches: competencyMatchingSkills.length,
      skillGoalMatches: skillGoalMatchingSkills.length
    });

    setAnalysisData({
      skillMatch: {
        current: matchingSkills.length,
        total: totalRequiredSkills
      },
      competencyMatch: {
        current: competencyMatchingSkills.length,
        total: totalRequiredSkills
      },
      skillGoals: {
        current: skillGoalMatchingSkills.length,
        total: totalRequiredSkills
      }
    });
  }, [selectedRole, roleLevel, employeeId, toggledSkills, currentStates, currentRoleSkills, employeeSkills, getSkillCompetencyState]);

  return <BenchmarkAnalysisCard {...analysisData} />;
};