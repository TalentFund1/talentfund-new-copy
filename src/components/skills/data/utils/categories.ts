export const getSubcategory = (skillTitle: string): string => {
  const subcategories: { [key: string]: string } = {
    // Mobile & Frontend Development
    'React Native': 'Mobile Development',
    'Flutter': 'Mobile Development',
    'GraphQL': 'API Development',
    
    // AI & ML Skills
    'Machine Learning': 'AI & ML',
    'Deep Learning': 'AI & ML',
    'Natural Language Processing': 'AI Applications',
    'Computer Vision': 'AI Applications',
    'TensorFlow': 'ML Frameworks',
    'PyTorch': 'ML Frameworks',
    
    // Backend Skills
    'Node.js': 'Backend Development',
    'API Development': 'Backend Development',
    'Database Design': 'Data Management',
    
    // Architecture Skills
    'System Design': 'Software Architecture',
    'Technical Architecture': 'Architecture',
    
    // DevOps Skills
    'Docker': 'Container Technology',
    'Kubernetes': 'Container Orchestration',
    
    // Frontend Skills
    'React': 'Frontend Frameworks',
    'Next.js': 'Frontend Frameworks',
    
    // Development Tools & Practices
    'Git Version Control': 'Development Tools',
    'Problem Solving': 'Development Practices',
    'Code Review': 'Development Practices',
    'Agile Methodologies': 'Development Practices',
    
    // Soft Skills
    'Team Leadership': 'Leadership',
    'Project Management': 'Project Management',
    'Risk Management': 'Management',
    'Technical Writing': 'Communication',
    'Communication': 'Communication',
    'Strategic Planning': 'Management',
    'Stakeholder Management': 'Management',
    
    // Certifications
    'AWS Certified Machine Learning Specialty': 'AI Certification',
    'TensorFlow Developer Certification': 'AI Certification',
    'AWS Certified Solutions Architect': 'Cloud Certification',
    'AWS Certified Developer - Associate': 'Cloud Certification',
    'AWS Certified DevOps Engineer': 'Cloud Certification',
    'Certified Kubernetes Administrator': 'Container Certification',
    'HashiCorp Certified Terraform Associate': 'Infrastructure Certification',
    'Project Management Professional (PMP)': 'Management Certification',
    'Certified Scrum Master (CSM)': 'Agile Certification'
  };
  
  return subcategories[skillTitle] || 'Development Tools';
};

export const getBusinessCategory = (skillTitle: string): string => {
  const categories: { [key: string]: string } = {
    'React Native': 'Information Technology',
    'Flutter': 'Information Technology',
    'GraphQL': 'Information Technology',
    
    // Technical Skills
    'Amazon Web Services': 'Information Technology',
    'Machine Learning': 'Information Technology',
    'Deep Learning': 'Information Technology',
    'Python': 'Information Technology',
    'Docker': 'Information Technology',
    'Kubernetes': 'Information Technology',
    'Jenkins': 'Information Technology',
    'Terraform': 'Information Technology',
    'Linux Administration': 'Information Technology',
    'Node.js': 'Information Technology',
    'React': 'Information Technology',
    'Next.js': 'Information Technology',
    
    // Soft Skills
    'Communication': 'Media and Communications',
    'Technical Writing': 'Media and Communications',
    'Problem Solving': 'Physical and Inherent Abilities',
    'Team Leadership': 'Initiative and Leadership',
    'Project Management': 'Project Management',
    'Strategic Planning': 'Project Management',
    
    // Analysis Skills
    'Data Science': 'Analysis',
    'Computer Vision': 'Analysis',
    'Natural Language Processing': 'Analysis',
    
    // Management Skills
    'Risk Management': 'Risk and Compliance',
    'Stakeholder Management': 'Initiative and Leadership',
    
    // Architecture Skills
    'System Design': 'Information Technology',
    'Database Design': 'Information Technology',
    'Technical Architecture': 'Information Technology'
  };
  
  return categories[skillTitle] || 'Information Technology';
};

export const getSkillWeight = (skillTitle: string): 'critical' | 'technical' | 'necessary' => {
  console.log('Calculating weight for skill:', skillTitle);

  // Critical skills - high impact, core competencies
  const criticalSkills = [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Team Leadership',
    'Project Management',
    'Strategic Planning',
    'System Design',
    'Technical Architecture',
    'AWS Certified Solutions Architect',
    'AWS Certified Machine Learning - Specialty'
  ];

  // Technical skills - specialized technical competencies
  const technicalSkills = [
    'Python',
    'TensorFlow',
    'Computer Vision',
    'GraphQL',
    'Docker',
    'Kubernetes',
    'API Development',
    'Database Design',
    'Node.js',
    'React',
    'TypeScript',
    'Git Version Control',
    'Code Review',
    'Problem Solving',
    'Technical Writing'
  ];

  // Necessary skills - important but not core technical requirements
  const necessarySkills = [
    'Communication',
    'Agile Methodologies',
    'Documentation',
    'Collaboration',
    'Time Management'
  ];

  console.log('Determining weight category for:', skillTitle);

  if (criticalSkills.includes(skillTitle)) {
    console.log(`${skillTitle} identified as critical skill`);
    return 'critical';
  }

  if (technicalSkills.includes(skillTitle)) {
    console.log(`${skillTitle} identified as technical skill`);
    return 'technical';
  }

  if (necessarySkills.includes(skillTitle)) {
    console.log(`${skillTitle} identified as necessary skill`);
    return 'necessary';
  }

  // Default to technical if not explicitly categorized
  console.log(`${skillTitle} defaulting to technical skill`);
  return 'technical';
};