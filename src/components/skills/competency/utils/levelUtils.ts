export const getLevelPriority = (level: string = 'unspecified') => {
  const priorities: { [key: string]: number } = {
    'advanced': 4,
    'intermediate': 3,
    'beginner': 2,
    'unspecified': 1
  };
  return priorities[level.toLowerCase()] || 1;
};

export const normalizeLevel = (levelKey: string, roleId: string, track: string): string => {
  const key = levelKey.toLowerCase();
  
  // If the level already matches the track format, return it
  if (track === "Managerial" && key.startsWith('m')) {
    return key;
  }
  if (track === "Professional" && key.startsWith('p')) {
    return key;
  }

  // Convert between tracks
  const levelMap: { [key: string]: { [key: string]: string } } = {
    "Managerial": {
      // Map Professional levels to Managerial
      "p1": "m3",
      "p2": "m3",
      "p3": "m3",
      "p4": "m3",
      "p5": "m4",
      "p6": "m5"
    },
    "Professional": {
      // Map Managerial levels to Professional
      "m3": "p4",
      "m4": "p4",
      "m5": "p5",
      "m6": "p6"
    }
  };

  console.log('Normalizing level:', {
    originalLevel: levelKey,
    track,
    roleId,
    mappedLevel: levelMap[track]?.[key] || key
  });

  return levelMap[track]?.[key] || key;
};

// Helper function to check if a level is managerial
export const isManagerialLevel = (level: string): boolean => {
  return level.toLowerCase().startsWith('m');
};

// Helper function to check if a level is professional
export const isProfessionalLevel = (level: string): boolean => {
  return level.toLowerCase().startsWith('p');
};