export const getStorageKey = (roleId: string) => `roleToggledSkills-${roleId}`;

export const loadToggledSkills = (roleId: string): string[] => {
  try {
    if (!roleId) {
      console.error('Cannot load toggled skills: No role ID provided');
      return [];
    }

    const savedState = localStorage.getItem(getStorageKey(roleId));
    if (savedState) {
      const parsedSkills = JSON.parse(savedState);
      if (Array.isArray(parsedSkills)) {
        console.log('Loaded saved toggle state:', {
          roleId,
          skillCount: parsedSkills.length,
          skills: parsedSkills
        });
        return parsedSkills;
      }
    }
  } catch (error) {
    console.error('Error loading toggled skills:', error);
  }
  return [];
};

export const saveToggledSkills = (roleId: string, skills: string[]) => {
  try {
    if (!roleId) {
      console.error('Cannot save toggled skills: No role ID provided');
      return;
    }
    
    const storageKey = getStorageKey(roleId);
    localStorage.setItem(storageKey, JSON.stringify(skills));
    
    console.log('Saved toggled skills:', {
      roleId,
      skillCount: skills.length,
      skills,
      storageKey
    });
  } catch (error) {
    console.error('Error saving toggled skills:', error);
    throw error;
  }
};