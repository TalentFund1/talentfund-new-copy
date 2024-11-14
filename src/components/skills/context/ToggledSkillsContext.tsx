import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ToggledSkillsContextType {
  toggledSkills: Set<string>;
  setToggledSkills: (skills: Set<string>) => void;
}

const ToggledSkillsContext = createContext<ToggledSkillsContextType | undefined>(undefined);

export const ToggledSkillsProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams<{ id: string }>();
  const [skillsByRole, setSkillsByRole] = useState<Record<string, Set<string>>>(() => {
    const savedSkills = localStorage.getItem('toggledSkillsByRole');
    if (!savedSkills) {
      // Initialize with default AI Engineer skills
      const defaultAISkills = new Set([
        "Deep Learning",
        "Computer Vision",
        "Machine Learning",
        "Natural Language Processing",
        "PyTorch",
        "Python",
        "TensorFlow",
        "Problem Solving",
        "Technical Writing",
        "AWS Certified Machine Learning - Specialty",
        "TensorFlow Developer Certificate",
        "Google Cloud Professional Machine Learning Engineer"
      ]);
      return { "123": defaultAISkills };
    }
    
    try {
      const parsed = JSON.parse(savedSkills);
      const result: Record<string, Set<string>> = {};
      
      // Convert the parsed arrays back to Sets
      Object.entries(parsed).forEach(([roleId, skills]) => {
        if (Array.isArray(skills)) {
          result[roleId] = new Set(skills.filter(skill => 
            typeof skill === 'string' && skill.length > 0
          ));
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error loading saved skills:', error);
      return {};
    }
  });

  // Get the current role's toggled skills
  const toggledSkills = skillsByRole[id || '123'] || new Set<string>();

  // Update skills for the current role
  const setToggledSkills = (newSkills: Set<string>) => {
    setSkillsByRole(prev => ({
      ...prev,
      [id || '123']: newSkills
    }));
  };

  // Save to localStorage whenever skillsByRole changes
  useEffect(() => {
    try {
      // Convert Sets to arrays for JSON serialization
      const serializable = Object.fromEntries(
        Object.entries(skillsByRole).map(([roleId, skills]) => [
          roleId,
          Array.from(skills)
        ])
      );
      
      localStorage.setItem('toggledSkillsByRole', JSON.stringify(serializable));
    } catch (error) {
      console.error('Error saving skills:', error);
    }
  }, [skillsByRole]);

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