import { create } from 'zustand';

interface SkillState {
  level: string;
  required: string;
}

interface CompetencyState {
  originalStates: Record<string, SkillState>;
  currentStates: Record<string, SkillState>;
  hasChanges: boolean;
  setSkillState: (skillName: string, level: string, required: string) => void;
  saveChanges: () => void;
  cancelChanges: () => void;
  initializeStates: (states: Record<string, SkillState>) => void;
}

export const useCompetencyStore = create<CompetencyState>((set) => ({
  originalStates: {},
  currentStates: {},
  hasChanges: false,
  setSkillState: (skillName, level, required) =>
    set((state) => {
      const newStates = {
        ...state.currentStates,
        [skillName]: { level, required },
      };
      const hasChanges = JSON.stringify(newStates) !== JSON.stringify(state.originalStates);
      return { currentStates: newStates, hasChanges };
    }),
  saveChanges: () =>
    set((state) => ({
      originalStates: { ...state.currentStates },
      hasChanges: false,
    })),
  cancelChanges: () =>
    set((state) => ({
      currentStates: { ...state.originalStates },
      hasChanges: false,
    })),
  initializeStates: (states) =>
    set(() => ({
      originalStates: states,
      currentStates: states,
      hasChanges: false,
    })),
}));