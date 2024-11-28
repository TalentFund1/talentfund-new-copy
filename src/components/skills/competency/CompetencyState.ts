import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompetencyState, SkillState } from './state/types';

export const useCompetencyStore = create<CompetencyState>()(
  persist(
    (set, get) => ({
      currentStates: {},
      originalStates: {},
      hasChanges: false,
      setSkillState: (skillName, level, levelKey, required) => {
        console.log('Setting competency state:', { 
          skillName, 
          level, 
          levelKey, 
          required,
          currentStates: get().currentStates
        });
        
        set((state) => {
          // Preserve existing states while updating the specific skill
          const existingSkillStates = state.currentStates[skillName] || {};
          
          const newStates = {
            ...state.currentStates,
            [skillName]: {
              ...existingSkillStates,
              [levelKey]: {
                level,
                required,
              },
            },
          };
          
          console.log('Updated states:', {
            previous: state.currentStates,
            new: newStates
          });
          
          const hasChanges = JSON.stringify(newStates) !== JSON.stringify(state.originalStates);
          
          return { 
            currentStates: newStates,
            hasChanges
          };
        });
      },
      setSkillProgression: (skillName, progression) => {
        console.log('Setting skill progression:', { 
          skillName, 
          progression,
          currentStates: get().currentStates 
        });
        
        set((state) => {
          const newStates = {
            ...state.currentStates,
            [skillName]: {
              ...state.currentStates[skillName],
              ...progression,
            },
          };
          
          return {
            currentStates: newStates,
            hasChanges: true
          };
        });
      },
      resetLevels: () => {
        console.log('Resetting all levels');
        set((state) => ({
          currentStates: {},
          originalStates: {},
          hasChanges: false
        }));
      },
      saveChanges: () => {
        console.log('Saving changes');
        set((state) => ({
          originalStates: { ...state.currentStates },
          hasChanges: false
        }));
      },
      cancelChanges: () => {
        console.log('Cancelling changes');
        set((state) => ({
          currentStates: { ...state.originalStates },
          hasChanges: false
        }));
      }
    }),
    {
      name: 'competency-storage',
      skipHydration: false,
      partialize: (state) => ({
        currentStates: state.currentStates,
        originalStates: state.originalStates
      })
    }
  )
);