import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSkillsMatrixStore } from "./skills-matrix/SkillsMatrixState";
import { useSkillsMatrixSearch } from "../skills/context/SkillsMatrixSearchContext";
import { SkillsMatrixView } from "./skills-matrix/SkillsMatrixView";
import { useSkillsMatrixState } from "./skills-matrix/SkillsMatrixState";
import { getUnifiedSkillData } from "../skills/data/skillDatabaseService";
import { getAllSkills } from "../skills/data/skills/allSkills";

const ITEMS_PER_PAGE = 10;

export const SkillsMatrix = () => {
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedInterest, setSelectedInterest] = useState("all");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { id } = useParams();
  const observerTarget = useRef<HTMLDivElement>(null);
  const { hasChanges: storeHasChanges } = useSkillsMatrixStore();
  const { matrixSearchSkills } = useSkillsMatrixSearch();

  const { filterAndSortSkills } = useSkillsMatrixState(
    "all",
    selectedLevel,
    selectedInterest
  );

  // Get employee skills from universal database
  const getEmployeeSkills = (employeeId: string) => {
    console.log('Getting skills for employee:', employeeId);
    const allSkills = getAllSkills();
    const employeeSkillStates = useSkillsMatrixStore.getState().currentStates;
    
    // Map skills to include employee-specific states
    return allSkills.map(skill => ({
      ...getUnifiedSkillData(skill.title),
      level: employeeSkillStates[skill.title]?.level || skill.level,
      requirement: employeeSkillStates[skill.title]?.requirement || 'preferred'
    }));
  };

  // Get employee skills
  const employeeSkills = getEmployeeSkills(id || "");

  // Custom sorting function
  const sortSkills = (skills: any[]) => {
    return skills.sort((a, b) => {
      const { currentStates } = useSkillsMatrixStore.getState();
      const stateA = currentStates[a.title] || { level: a.level || 'unspecified', requirement: a.requirement || 'unknown' };
      const stateB = currentStates[b.title] || { level: b.level || 'unspecified', requirement: b.requirement || 'unknown' };

      // Helper function to get priority for levels
      const getLevelPriority = (level: string) => {
        switch (level.toLowerCase()) {
          case 'advanced': return 0;
          case 'intermediate': return 2;
          case 'beginner': return 3;
          default: return 4;
        }
      };

      // Helper function to get priority for requirements
      const getRequirementPriority = (requirement: string) => {
        return requirement === 'required' || requirement === 'skill_goal' ? 0 : 1;
      };

      // First, compare levels
      const levelPriorityA = getLevelPriority(stateA.level);
      const levelPriorityB = getLevelPriority(stateB.level);
      
      if (levelPriorityA !== levelPriorityB) {
        return levelPriorityA - levelPriorityB;
      }

      // If levels are the same, compare requirements
      const reqPriorityA = getRequirementPriority(stateA.requirement);
      const reqPriorityB = getRequirementPriority(stateB.requirement);
      
      if (reqPriorityA !== reqPriorityB) {
        return reqPriorityA - reqPriorityB;
      }

      // If everything else is equal, sort alphabetically
      return a.title.localeCompare(b.title);
    });
  };

  // Apply filtering and sorting
  const filteredSkills = sortSkills(filterAndSortSkills(id || ""));

  console.log('Skills matrix state:', {
    totalSkills: employeeSkills.length,
    filteredSkills: filteredSkills.length,
    visibleItems,
    selectedLevel,
    selectedInterest
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleItems < filteredSkills.length) {
          setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredSkills.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visibleItems, filteredSkills.length]);

  useEffect(() => {
    setHasChanges(storeHasChanges);
  }, [storeHasChanges]);

  return (
    <div className="space-y-6">
      <SkillsMatrixView
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedInterest={selectedInterest}
        setSelectedInterest={setSelectedInterest}
        filteredSkills={filteredSkills}
        visibleItems={visibleItems}
        observerTarget={observerTarget}
        hasChanges={hasChanges}
        isRoleBenchmark={false}
      />
    </div>
  );
};