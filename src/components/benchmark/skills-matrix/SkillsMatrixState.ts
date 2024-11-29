import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCompetencyStore } from '../../skills/competency/CompetencyState';

interface SkillState {
  level: string;
  requirement: string;
}

interface SkillsMatrixState {
  originalStates: Record<string, SkillState>;
  currentStates: Record<string, SkillState>;
  hasChanges: boolean;
  setSkillState: (skillTitle: string, level: string, requirement: string) => void;
  saveChanges: () => void;
  cancelChanges: () => void;
  initializeState: (skillTitle: string, initialLevel: string, initialRequirement: string) => void;
}

export const useSkillsMatrixStore = create<SkillsMatrixState>()(
  persist(
    (set, get) => ({
      originalStates: {},
      currentStates: {},
      hasChanges: false,
      initializeState: (skillTitle, initialLevel, initialRequirement) => {
        const competencyStore = useCompetencyStore.getState();
        const currentState = competencyStore.currentStates[skillTitle];
        
        if (!currentState) {
          console.log('Initializing matrix skill state:', { 
            skillTitle, 
            initialLevel: initialLevel || 'unspecified',
            initialRequirement: initialRequirement || 'preferred'
          });
          
          set((state) => ({
            currentStates: {
              ...state.currentStates,
              [skillTitle]: {
                level: initialLevel || 'unspecified',
                requirement: initialRequirement || 'preferred'
              }
            },
            originalStates: {
              ...state.originalStates,
              [skillTitle]: {
                level: initialLevel || 'unspecified',
                requirement: initialRequirement || 'preferred'
              }
            }
          }));
        }
      },
      setSkillState: (skillTitle, level, requirement) => {
        console.log('Setting matrix skill state:', { skillTitle, level, requirement });
        const competencyStore = useCompetencyStore.getState();
        
        // Update both stores
        competencyStore.setSkillState(skillTitle, level, 'p4', requirement, '123');
        
        set((state) => {
          const newStates = {
            ...state.currentStates,
            [skillTitle]: { level, requirement },
          };
          
          const hasChanges = JSON.stringify(newStates) !== JSON.stringify(state.originalStates);
          
          return { 
            currentStates: newStates,
            hasChanges
          };
        });
      },
      saveChanges: () =>
        set((state) => {
          console.log('Saving matrix changes');
          const competencyStore = useCompetencyStore.getState();
          competencyStore.saveChanges('123');
          
          return {
            originalStates: { ...state.currentStates },
            hasChanges: false,
          };
        }),
      cancelChanges: () =>
        set((state) => {
          console.log('Cancelling matrix changes');
          const competencyStore = useCompetencyStore.getState();
          competencyStore.cancelChanges('123');
          
          return {
            currentStates: { ...state.originalStates },
            hasChanges: false,
          };
        }),
    }),
    {
      name: 'skills-matrix-storage',
      skipHydration: false,
      partialize: (state) => ({
        originalStates: state.originalStates,
        currentStates: state.currentStates,
      }),
    }
  )
);