import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ToggledSkillsContextType {
  toggledSkills: Set<string>;
  setToggledSkills: (skills: Set<string>) => void;
}

const ToggledSkillsContext = createContext<ToggledSkillsContextType | undefined>(undefined);

export const ToggledSkillsProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams<{ id: string }>();
  const [toggledSkills, setToggledSkills] = useState<Set<string>>(() => {
    const savedSkills = localStorage.getItem(`toggledSkills_${id}`);
    return savedSkills ? new Set(JSON.parse(savedSkills)) : new Set();
  });

  useEffect(() => {
    if (id) {
      localStorage.setItem(`toggledSkills_${id}`, JSON.stringify(Array.from(toggledSkills)));
    }
  }, [toggledSkills, id]);

  return (
    <ToggledSkillsContext.Provider value={{ toggledSkills, setToggledSkills }}>
      {children}
    </ToggledSkillsContext.Provider>
  );
};

export const useToggledSkills = () => {
  const context = useContext(ToggledSkillsContext);
  if (context === undefined) {
    throw new Error('useToggledSkills must be used within a ToggledSkillsProvider');
  }
  return context;
};