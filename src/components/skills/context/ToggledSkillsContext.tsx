import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { roleSkills } from '../data/roleSkills';
import { useCompetencyStore } from '../competency/CompetencyState';
import { useRoleStore } from '../../benchmark/RoleBenchmark';
import { getSkillProfileId, getBaseRole } from '../../utils/roleUtils';
import { useEmployeeStore } from '../../employee/store/employeeStore';

interface ToggledSkillsContextType {
  toggledSkills: Set<string>;
  setToggledSkills: (skills: Set<string>) => void;
}

const ToggledSkillsContext = createContext<ToggledSkillsContextType | undefined>(undefined);

const getInitialSkillsForRole = (roleId: string): Set<string> => {
  console.log('Getting initial skills for role:', roleId);
  
  if (!roleId) {
    console.log('No role ID provided');
    return new Set();
  }
  
  const currentRoleSkills = roleSkills[roleId as keyof typeof roleSkills];
  if (!currentRoleSkills) {
    console.log('No role skills found for role:', roleId);
    return new Set();
  }

  // Get all skills for the role
  const specializedSkills = currentRoleSkills.specialized?.map(s => s.title) || [];
  const commonSkills = currentRoleSkills.common?.map(s => s.title) || [];
  const certificationSkills = currentRoleSkills.certifications?.map(s => s.title) || [];

  // Create a set of all skills
  const skills = new Set([
    ...specializedSkills,
    ...commonSkills,
    ...certificationSkills
  ]);

  console.log('Initial skills for role:', roleId, Array.from(skills));
  return skills;
};

export const ToggledSkillsProvider = ({ children }: { children: ReactNode }) => {
  const { selectedRole } = useRoleStore();
  const { initializeStates } = useCompetencyStore();
  const { id } = useParams<{ id: string }>();
  const employees = useEmployeeStore((state) => state.employees);
  
  const [skillsByRole, setSkillsByRole] = useState<Record<string, Set<string>>>(() => {
    console.log('Initializing skills by role, selected role:', selectedRole);
    
    try {
      const savedSkills = localStorage.getItem('toggledSkillsByRole');
      if (savedSkills) {
        const parsed = JSON.parse(savedSkills);
        const result: Record<string, Set<string>> = {};
        
        Object.entries(parsed).forEach(([roleId, skills]) => {
          if (Array.isArray(skills)) {
            result[roleId] = new Set(skills.filter(skill => 
              typeof skill === 'string' && skill.length > 0
            ));
          }
        });

        // Always ensure we have skills for the selected role
        if (selectedRole && (!result[selectedRole] || result[selectedRole].size === 0)) {
          console.log('Initializing missing skills for selected role:', selectedRole);
          result[selectedRole] = getInitialSkillsForRole(selectedRole);
        }
        
        console.log('Loaded toggled skills by role:', result);
        return result;
      }
    } catch (error) {
      console.error('Error loading saved skills:', error);
    }
    
    return selectedRole ? { [selectedRole]: getInitialSkillsForRole(selectedRole) } : {};
  });

  // Initialize competency states and skills for all employees' roles on mount
  useEffect(() => {
    console.log('Initializing states for all employees and roles');
    
    // First initialize all predefined roles
    Object.keys(roleSkills).forEach(roleId => {
      console.log('Initializing states for predefined role:', roleId);
      initializeStates(roleId);
      
      setSkillsByRole(prev => {
        if (!prev[roleId] || prev[roleId].size === 0) {
          return {
            ...prev,
            [roleId]: getInitialSkillsForRole(roleId)
          };
        }
        return prev;
      });
    });

    // Then initialize for all employee roles
    employees.forEach(employee => {
      const roleId = getSkillProfileId(getBaseRole(employee.role));
      console.log('Initializing states for employee role:', {
        employee: employee.name,
        role: employee.role,
        roleId
      });
      
      initializeStates(roleId);
      
      setSkillsByRole(prev => {
        if (!prev[roleId] || prev[roleId].size === 0) {
          return {
            ...prev,
            [roleId]: getInitialSkillsForRole(roleId)
          };
        }
        return prev;
      });
    });
  }, [initializeStates, employees]); // Run when employees change

  // Initialize skills for new roles or when they're empty
  useEffect(() => {
    const currentRole = id || selectedRole;
    if (currentRole) {
      setSkillsByRole(prev => {
        if (!prev[currentRole] || prev[currentRole].size === 0) {
          console.log('Initializing skills for role:', currentRole);
          const newSkills = getInitialSkillsForRole(currentRole);
          return {
            ...prev,
            [currentRole]: newSkills
          };
        }
        return prev;
      });
    }
  }, [id, selectedRole]);

  const currentRole = id || selectedRole;
  const toggledSkills = currentRole ? (skillsByRole[currentRole] || new Set<string>()) : new Set<string>();

  const setToggledSkills = (newSkills: Set<string>) => {
    console.log('Setting toggled skills for role:', currentRole, Array.from(newSkills));
    if (currentRole) {
      setSkillsByRole(prev => ({
        ...prev,
        [currentRole]: newSkills
      }));
    }
  };

  useEffect(() => {
    try {
      const serializable = Object.fromEntries(
        Object.entries(skillsByRole).map(([roleId, skills]) => [
          roleId,
          Array.from(skills)
        ])
      );
      
      localStorage.setItem('toggledSkillsByRole', JSON.stringify(serializable));
      console.log('Saved toggled skills by role:', serializable);
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