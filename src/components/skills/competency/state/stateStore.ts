import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompetencyStateStore } from './types';
import { setSkillStateAction, setSkillProgressionAction } from './stateActions';
import { loadPersistedState } from './persistenceUtils';
import { initializeRoleState } from './initializeState';

export const useCompetencyStore = create<CompetencyStateStore>()(
  persist(
    (set, get) => ({
      roleStates: {},
      currentStates: {},
      originalStates: {},
      hasChanges: false,

      setSkillState: (skillName, level, levelKey, required, roleId) => {
        console.log('Setting skill state:', { skillName, level, levelKey, required, roleId });
        set((state) => {
          const result = setSkillStateAction(
            { roleStates: state.roleStates },
            skillName,
            level,
            levelKey,
            required,
            roleId
          );
          
          return {
            ...state,
            roleStates: result.roleStates,
            currentStates: {
              ...state.currentStates,
              [roleId]: result.roleStates[roleId]
            },
            hasChanges: result.hasChanges
          };
        });
      },

      setSkillProgression: (skillName, progression, roleId) => {
        console.log('Setting skill progression:', { skillName, progression, roleId });
        set((state) => {
          const result = setSkillProgressionAction(
            { roleStates: state.roleStates },
            skillName,
            progression,
            roleId
          );
          
          return {
            ...state,
            roleStates: result.roleStates,
            currentStates: {
              ...state.currentStates,
              [roleId]: result.roleStates[roleId]
            },
            hasChanges: result.hasChanges
          };
        });
      },

      resetLevels: (roleId) => {
        console.log('Resetting levels for role:', roleId);
        set((state) => {
          const freshState = initializeRoleState(roleId);
          return {
            roleStates: {
              ...state.roleStates,
              [roleId]: freshState
            },
            currentStates: {
              ...state.currentStates,
              [roleId]: freshState
            },
            hasChanges: true
          };
        });
      },

      saveChanges: (roleId) => {
        console.log('Saving changes for role:', roleId);
        set((state) => {
          const currentRoleState = state.roleStates[roleId];
          return {
            roleStates: state.roleStates,
            currentStates: state.currentStates,
            originalStates: {
              ...state.originalStates,
              [roleId]: { ...currentRoleState }
            },
            hasChanges: false
          };
        });
      },

      cancelChanges: (roleId) => {
        console.log('Canceling changes for role:', roleId);
        set((state) => {
          const originalRoleState = state.originalStates[roleId];
          return {
            roleStates: {
              ...state.roleStates,
              [roleId]: { ...originalRoleState }
            },
            currentStates: {
              ...state.currentStates,
              [roleId]: { ...originalRoleState }
            },
            hasChanges: false
          };
        });
      },

      initializeState: (roleId) => {
        const currentState = get().roleStates[roleId];
        if (!currentState) {
          console.log('Initializing state for role:', roleId);
          const savedState = loadPersistedState(roleId);
          
          if (savedState) {
            set((state) => ({
              roleStates: {
                ...state.roleStates,
                [roleId]: savedState
              },
              currentStates: {
                ...state.currentStates,
                [roleId]: savedState
              },
              originalStates: {
                ...state.originalStates,
                [roleId]: savedState
              }
            }));
          } else {
            const initialState = initializeRoleState(roleId);
            set((state) => ({
              roleStates: {
                ...state.roleStates,
                [roleId]: initialState
              },
              currentStates: {
                ...state.currentStates,
                [roleId]: initialState
              },
              originalStates: {
                ...state.originalStates,
                [roleId]: initialState
              }
            }));
          }
        }
      },

      getRoleState: (roleId) => {
        console.log('Getting role state for:', roleId);
        return get().roleStates[roleId] || {};
      }
    }),
    {
      name: 'competency-storage',
      version: 20,
      partialize: (state) => ({
        roleStates: state.roleStates,
        currentStates: state.currentStates,
        originalStates: state.originalStates
      }),
      merge: (persistedState: any, currentState: CompetencyStateStore) => {
        console.log('Merging states:', { persistedState, currentState });
        return {
          ...currentState,
          roleStates: {
            ...currentState.roleStates,
            ...persistedState.roleStates
          },
          currentStates: {
            ...currentState.currentStates,
            ...persistedState.currentStates
          },
          originalStates: {
            ...currentState.originalStates,
            ...persistedState.originalStates
          },
          hasChanges: false
        };
      }
    }
  )
);
