import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { SkillsMatrixHeader } from "./skills-matrix/SkillsMatrixHeader";
import { SkillsMatrixFilters } from "./skills-matrix/SkillsMatrixFilters";
import { SkillsMatrixTable } from "./skills-matrix/SkillsMatrixTable";
import { filterSkillsByCategory } from "./skills-matrix/skillCategories";
import { getEmployeeSkills } from "./skills-matrix/initialSkills";
import { useSkillsMatrixStore } from "./skills-matrix/SkillsMatrixState";
import { useToast } from "@/components/ui/use-toast";
import { SearchFilter } from "@/components/market/SearchFilter";
import { technicalSkills, softSkills } from '@/components/skillsData';
import { useSkillsMatrixSearch } from "../skills/context/SkillsMatrixSearchContext";

const ITEMS_PER_PAGE = 10;

export const SkillsMatrix = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedInterest, setSelectedInterest] = useState("all");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { id } = useParams<{ id: string }>();
  const observerTarget = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { saveChanges, cancelChanges, hasChanges: storeHasChanges, currentStates } = useSkillsMatrixStore();
  const { matrixSearchSkills, setMatrixSearchSkills } = useSkillsMatrixSearch();
  const allSkills = [...technicalSkills, ...softSkills];

  const employeeSkills = getEmployeeSkills(id || "");

  const getLevelPriority = (level: string) => {
    const priorities: { [key: string]: number } = {
      'unspecified': 0,
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    return priorities[level.toLowerCase()] ?? 0;
  };

  const getInterestPriority = (requirement: string) => {
    const priorities: { [key: string]: number } = {
      'required': 0,
      'skill_goal': 0,
      'preferred': 1,
      'not_interested': 2,
      'unknown': 3
    };
    return priorities[requirement.toLowerCase()] ?? 3;
  };

  const getRoleLevelPriority = (level: string) => {
    const priorities: { [key: string]: number } = {
      'unspecified': 0,
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    return priorities[level.toLowerCase()] ?? 0;
  };

  const filteredSkills = filterSkillsByCategory(employeeSkills, selectedCategory)
    .filter(skill => {
      let matchesLevel = true;
      let matchesInterest = true;
      let matchesSearch = true;

      const currentSkillState = currentStates[skill.title];
      const skillLevel = (currentSkillState?.level || skill.level || '').toLowerCase();
      const requirement = (currentSkillState?.requirement || skill.requirement || '').toLowerCase();

      if (selectedLevel !== 'all') {
        matchesLevel = skillLevel === selectedLevel.toLowerCase();
      }

      if (selectedInterest !== 'all') {
        switch (selectedInterest.toLowerCase()) {
          case 'skill_goal':
            matchesInterest = requirement === 'required' || requirement === 'skill_goal';
            break;
          case 'not_interested':
            matchesInterest = requirement === 'not_interested';
            break;
          case 'unknown':
            matchesInterest = !requirement || requirement === 'unknown';
            break;
          default:
            matchesInterest = requirement === selectedInterest.toLowerCase();
        }
      }

      if (matrixSearchSkills.length > 0) {
        matchesSearch = matrixSearchSkills.some(term => 
          skill.title.toLowerCase().includes(term.toLowerCase())
        );
      }

      return matchesLevel && matchesInterest && matchesSearch;
    })
    .sort((a, b) => {
      const aState = currentStates[a.title];
      const bState = currentStates[b.title];
      
      const aLevel = (aState?.level || a.level || 'unspecified').toLowerCase();
      const bLevel = (bState?.level || b.level || 'unspecified').toLowerCase();
      
      const levelDiff = getLevelPriority(bLevel) - getLevelPriority(aLevel);
      if (levelDiff !== 0) return levelDiff;

      const aInterest = (aState?.requirement || a.requirement || 'unknown').toLowerCase();
      const bInterest = (bState?.requirement || b.requirement || 'unknown').toLowerCase();
      const interestDiff = getInterestPriority(aInterest) - getInterestPriority(bInterest);
      if (interestDiff !== 0) return interestDiff;

      return a.title.localeCompare(b.title);
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

  const paginatedSkills = filteredSkills.slice(0, visibleItems);

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-6 animate-fade-in bg-white">
        <SkillsMatrixHeader 
          hasChanges={hasChanges}
          onSave={saveChanges}
          onCancel={cancelChanges}
        />
        
        <div className="space-y-4">
          <SearchFilter
            label=""
            placeholder="Search skills..."
            items={allSkills}
            selectedItems={matrixSearchSkills}
            onItemsChange={setMatrixSearchSkills}
          />
        </div>
        
        <SkillsMatrixFilters 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedInterest={selectedInterest}
          setSelectedInterest={setSelectedInterest}
        />

        <SkillsMatrixTable 
          filteredSkills={paginatedSkills}
          setHasChanges={setHasChanges}
        />
        
        {visibleItems < filteredSkills.length && (
          <div 
            ref={observerTarget} 
            className="h-10 flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </Card>
    </div>
  );
};
