import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UnifiedSkill } from '../../skills/types/SkillTypes';
import { useEmployeeStore } from '../../employee/store/employeeStore';
import { filterSkillsByCategory } from '../skills-matrix/skillCategories';
import { EmployeeSkillAchievement, SkillLevel, SkillGoalStatus } from '../../employee/types/employeeSkillTypes';

interface SkillState {
  level: SkillLevel;
  requirement: SkillGoalStatus;
  lastUpdated: string;
}

interface SkillsMatrixState {
  currentStates: { [key: string]: SkillState };
  hasChanges: boolean;
  setSkillState: (skillTitle: string, level: SkillLevel, requirement: SkillGoalStatus) => void;
  resetSkills: () => void;
  initializeState: (skillTitle: string, level: SkillLevel, requirement: SkillGoalStatus) => void;
  saveChanges: () => void;
  cancelChanges: () => void;
}

export const useSkillsMatrixStore = create<SkillsMatrixState>()(
  persist(
    (set) => ({
      currentStates: {},
      hasChanges: false,

      setSkillState: (skillTitle, level, requirement) => {
        console.log('Setting skill state in matrix:', { skillTitle, level, requirement });
        
        set((state) => ({
          currentStates: {
            ...state.currentStates,
            [skillTitle]: { 
              level, 
              requirement,
              lastUpdated: new Date().toISOString()
            },
          },
          hasChanges: true,
        }));
      },

      resetSkills: () =>
        set(() => ({
          currentStates: {},
          hasChanges: false,
        })),

      initializeState: (skillTitle, level, requirement) =>
        set((state) => {
          if (!state.currentStates[skillTitle]) {
            console.log('Initializing skill state:', { skillTitle, level, requirement });
            return {
              currentStates: {
                ...state.currentStates,
                [skillTitle]: { 
                  level, 
                  requirement: requirement || 'unknown',
                  lastUpdated: new Date().toISOString()
                },
              },
            };
          }
          return state;
        }),

      saveChanges: () => {
        set(() => ({
          hasChanges: false,
        }));
      },

      cancelChanges: () =>
        set(() => ({
          hasChanges: false,
        })),
    }),
    {
      name: 'skills-matrix-storage',
      version: 2,
      partialize: (state) => ({
        currentStates: state.currentStates,
      }),
    }
  )
);

export const useSkillsMatrixState = (
  selectedCategory: string,
  selectedLevel: string,
  selectedInterest: string
) => {
  const { currentStates } = useSkillsMatrixStore();

  const filterAndSortSkills = (skills: UnifiedSkill[]) => {
    console.log('Filtering skills:', { 
      totalSkills: skills.length,
      selectedCategory,
      selectedLevel,
      selectedInterest 
    });

    let filteredSkills = [...skills];

    // Filter by category if not "all"
    if (selectedCategory !== "all") {
      filteredSkills = filterSkillsByCategory(filteredSkills, selectedCategory);
    }

    // Filter by level if not "all"
    if (selectedLevel !== "all") {
      filteredSkills = filteredSkills.filter((skill) => {
        return skill.level.toLowerCase() === selectedLevel.toLowerCase();
      });
    }

    // Filter by interest/requirement if not "all"
    if (selectedInterest !== "all") {
      filteredSkills = filteredSkills.filter((skill) => {
        if (!skill.requirement) return false;

        switch (selectedInterest.toLowerCase()) {
          case "skill_goal":
            return skill.requirement === "required" || skill.requirement === "skill_goal";
          case "not_interested":
            return skill.requirement === "not_interested";
          case "unknown":
            return !skill.requirement || skill.requirement === "unknown";
          default:
            return skill.requirement === selectedInterest.toLowerCase();
        }
      });
    }

    return filteredSkills.sort((a, b) => a.title.localeCompare(b.title));
  };

  return {
    filterAndSortSkills,
  };
};