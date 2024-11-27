import { useCompetencyStore } from "./CompetencyState";
import { useToggledSkills } from "../context/ToggledSkillsContext";
import { roleSkills } from "../data/roleSkills";

interface SkillCompetencyState {
  level: string;
  required: string;
  requirement?: string;
}

export const useCompetencyStateReader = () => {
  const { currentStates } = useCompetencyStore();
  const { toggledSkills } = useToggledSkills();

  const normalizeLevel = (level: string = ""): string => {
    if (!level) return "p4";
    
    const match = level.toLowerCase().match(/[pm][1-6]/);
    if (match) {
      return match[0];
    }

    if (level.match(/^[1-6]$/)) {
      return `p${level}`;
    }

    return level.toLowerCase().trim();
  };

  const getDefaultState = (skillName: string, roleId: string): SkillCompetencyState => {
    console.log('Getting default state for:', { skillName, roleId });
    
    const roleData = roleSkills[roleId as keyof typeof roleSkills];
    if (!roleData) {
      console.log('No role data found for role:', roleId);
      return { level: 'advanced', required: 'required' };
    }

    const allSkills = [
      ...roleData.specialized,
      ...roleData.common,
      ...roleData.certifications
    ];

    const skillData = allSkills.find(skill => skill.title === skillName);
    console.log('Found skill data:', { skillName, skillData, roleId });
    
    return {
      level: skillData?.level || 'advanced',
      required: skillData?.requirement || 'required'
    };
  };

  const getSkillCompetencyState = (
    skillName: string, 
    levelKey: string = 'p4', 
    targetRoleId?: string
  ): SkillCompetencyState | null => {
    console.log('Reading competency state:', { 
      skillName, 
      levelKey, 
      targetRoleId,
      currentStates,
      hasToggledSkill: toggledSkills.has(skillName)
    });
    
    if (!toggledSkills.has(skillName)) {
      console.log('Skill not toggled:', skillName);
      return null;
    }

    // Use target role ID if provided, otherwise use the first available role
    const effectiveRoleId = targetRoleId || Object.keys(currentStates)[0];
    if (!effectiveRoleId) {
      console.error('No role ID provided');
      return getDefaultState(skillName, targetRoleId || "123");
    }

    console.log('Using effective role ID:', effectiveRoleId);

    const roleStates = currentStates[effectiveRoleId];
    if (!roleStates || !roleStates[skillName]) {
      console.log('No state found for skill:', { skillName, effectiveRoleId });
      return getDefaultState(skillName, effectiveRoleId);
    }

    const normalizedLevelKey = normalizeLevel(levelKey);
    console.log('Normalized level key:', { 
      original: levelKey, 
      normalized: normalizedLevelKey,
      availableLevels: Object.keys(roleStates[skillName])
    });
    
    let levelState = roleStates[skillName][normalizedLevelKey];

    if (!levelState) {
      console.log('No exact level state found, searching for matching level...');
      const availableLevels = Object.keys(roleStates[skillName]);
      
      const exactMatch = availableLevels.find(level => 
        normalizeLevel(level) === normalizedLevelKey
      );

      if (exactMatch) {
        console.log('Found exact matching level:', exactMatch);
        levelState = roleStates[skillName][exactMatch];
      } else {
        const partialMatch = availableLevels.find(level => 
          normalizeLevel(level).includes(normalizedLevelKey) || 
          normalizedLevelKey.includes(normalizeLevel(level))
        );

        if (partialMatch) {
          console.log('Found partial matching level:', partialMatch);
          levelState = roleStates[skillName][partialMatch];
        }
      }

      if (!levelState) {
        console.log('No matching level found, using default state');
        return getDefaultState(skillName, effectiveRoleId);
      }
    }

    console.log('Using level state:', { 
      skillName, 
      level: levelState.level, 
      required: levelState.required,
      roleId: effectiveRoleId
    });
    
    return {
      level: levelState.level || getDefaultState(skillName, effectiveRoleId).level,
      required: levelState.required || getDefaultState(skillName, effectiveRoleId).required
    };
  };

  const getAllSkillStatesForLevel = (
    levelKey: string = 'p4',
    targetRoleId?: string
  ): Record<string, SkillCompetencyState> => {
    console.log('Getting all skill states for level:', { levelKey, targetRoleId });
    const states: Record<string, SkillCompetencyState> = {};
    
    const effectiveRoleId = targetRoleId || Object.keys(currentStates)[0];
    if (!effectiveRoleId) {
      console.error('No role ID available');
      return states;
    }

    const roleData = roleSkills[effectiveRoleId as keyof typeof roleSkills];
    
    if (roleData) {
      const allSkills = [
        ...roleData.specialized,
        ...roleData.common,
        ...roleData.certifications
      ];

      allSkills.forEach(skill => {
        if (toggledSkills.has(skill.title)) {
          const competencyState = getSkillCompetencyState(skill.title, levelKey, effectiveRoleId);
          if (competencyState) {
            states[skill.title] = competencyState;
          }
        }
      });
    }

    console.log('Retrieved all skill states:', { 
      roleId: effectiveRoleId,
      level: levelKey,
      states 
    });
    
    return states;
  };

  return {
    getSkillCompetencyState,
    getAllSkillStatesForLevel
  };
};