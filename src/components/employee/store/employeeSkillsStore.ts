import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmployeeSkill, EmployeeSkillState, EmployeeSkillsData } from '../types/employeeSkillTypes';
import { getUnifiedSkillData } from '../../skills/data/skillDatabaseService';

interface EmployeeSkillsStore {
  employeeSkills: Record<string, EmployeeSkillsData>;
  setEmployeeSkills: (employeeId: string, skills: EmployeeSkill[]) => void;
  getEmployeeSkills: (employeeId: string) => EmployeeSkill[];
  setSkillState: (employeeId: string, skillTitle: string, level: string, requirement: string) => void;
  getSkillState: (employeeId: string, skillTitle: string) => EmployeeSkillState;
  initializeEmployeeSkills: (employeeId: string) => void;
}

export const useEmployeeSkillsStore = create<EmployeeSkillsStore>()(
  persist(
    (set, get) => ({
      employeeSkills: {},

      setEmployeeSkills: (employeeId, skills) => {
        console.log('Setting skills for employee:', { 
          employeeId, 
          skillCount: skills.length,
          skills: skills.map(s => ({
            title: s.title,
            level: s.level,
            requirement: s.requirement
          }))
        });

        // Enrich skills with universal data
        const enrichedSkills = skills.map(skill => {
          const universalData = getUnifiedSkillData(skill.title);
          return {
            ...skill,
            growth: universalData?.growth || '0%',
            salary: universalData?.salary || 'N/A',
            confidence: universalData?.confidence || 'medium',
            benchmarks: universalData?.benchmarks || { B: false, R: false, M: false, O: false }
          };
        });

        set((state) => ({
          employeeSkills: {
            ...state.employeeSkills,
            [employeeId]: {
              skills: enrichedSkills,
              states: state.employeeSkills[employeeId]?.states || {}
            }
          }
        }));
      },

      getEmployeeSkills: (employeeId) => {
        const employeeData = get().employeeSkills[employeeId];
        if (!employeeData) {
          console.log('No skills found for employee:', employeeId);
          return [];
        }
        
        console.log('Retrieved skills for employee:', {
          employeeId,
          skillCount: employeeData.skills.length,
          skills: employeeData.skills.map(s => s.title)
        });
        
        return employeeData.skills;
      },

      setSkillState: (employeeId, skillTitle, level, requirement) => {
        console.log('Setting skill state:', {
          employeeId,
          skillTitle,
          level,
          requirement
        });

        set((state) => ({
          employeeSkills: {
            ...state.employeeSkills,
            [employeeId]: {
              skills: state.employeeSkills[employeeId]?.skills || [],
              states: {
                ...state.employeeSkills[employeeId]?.states,
                [skillTitle]: { level, requirement }
              }
            }
          }
        }));
      },

      getSkillState: (employeeId, skillTitle) => {
        const state = get().employeeSkills[employeeId]?.states[skillTitle];
        return state || { level: 'beginner', requirement: 'unknown' };
      },

      initializeEmployeeSkills: (employeeId) => {
        const currentSkills = get().employeeSkills[employeeId];
        if (!currentSkills) {
          console.log('Initializing skills for employee:', employeeId);
          set((state) => ({
            employeeSkills: {
              ...state.employeeSkills,
              [employeeId]: {
                skills: [],
                states: {}
              }
            }
          }));
        }
      }
    }),
    {
      name: 'employee-skills-storage',
      version: 1,
      partialize: (state) => ({
        employeeSkills: state.employeeSkills
      })
    }
  )
);