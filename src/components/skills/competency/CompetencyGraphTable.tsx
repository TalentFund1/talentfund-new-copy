import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompetencyStore } from "./CompetencyState";
import { SkillCell } from "./SkillCell";
import { roleSkills } from "../data/roleSkills";
import { professionalLevels, managerialLevels } from "../../benchmark/data/levelData";
import { useParams } from "react-router-dom";
import { CompetencyLoadingState } from "../../benchmark/loading/CompetencyLoadingState";
import { useEffect, useState } from "react";

interface CompetencyGraphTableProps {
  currentRoleId: string;
  track: "Professional" | "Managerial";
  selectedCategory: string;
  toggledSkills: Set<string>;
}

export const CompetencyGraphTable = ({
  currentRoleId,
  track,
  selectedCategory,
  toggledSkills
}: CompetencyGraphTableProps) => {
  const { roleStates, initializeState } = useCompetencyStore();
  const { id: roleId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state and handle loading
  useEffect(() => {
    setIsLoading(true);
    initializeState(currentRoleId);
    
    // Brief timeout to ensure state is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentRoleId, initializeState]);

  const getLevelsForTrack = () => {
    return track === "Managerial" ? Object.keys(managerialLevels) : Object.keys(professionalLevels);
  };

  const getSkillsByCategory = () => {
    const currentRoleSkills = roleSkills[currentRoleId as keyof typeof roleSkills] || roleSkills["123"];
    
    const filterSkillsByCategory = (category: 'specialized' | 'common' | 'certifications') => {
      return currentRoleSkills[category]?.filter(skill => toggledSkills.has(skill.title)) || [];
    };
    
    if (selectedCategory === "all") {
      return [
        ...filterSkillsByCategory('specialized'),
        ...filterSkillsByCategory('common'),
        ...filterSkillsByCategory('certifications')
      ];
    }
    
    if (selectedCategory === "specialized") {
      return filterSkillsByCategory('specialized');
    }
    
    if (selectedCategory === "common") {
      return filterSkillsByCategory('common');
    }
    
    if (selectedCategory === "certification") {
      return filterSkillsByCategory('certifications');
    }
    
    return [];
  };

  const getSkillDetails = (skillName: string, level: string) => {
    const currentRoleSkills = roleSkills[currentRoleId as keyof typeof roleSkills] || roleSkills["123"];
    const allSkills = [
      ...currentRoleSkills.specialized,
      ...currentRoleSkills.common,
      ...currentRoleSkills.certifications
    ];
    
    const skill = allSkills.find(s => s.title === skillName);
    if (!skill) return { level: "-", required: "-" };
    
    return {
      level: skill.level || "-",
      required: "required"
    };
  };

  const countSkillLevels = (skillName: string, levels: string[], targetLevel: string) => {
    let count = 0;
    const roleState = roleStates[roleId || "123"];
    
    if (roleState && roleState[skillName]) {
      levels.forEach(level => {
        const skillState = roleState[skillName][level.toLowerCase()];
        if (skillState && typeof skillState.level === 'string') {
          const currentLevel = skillState.level.toLowerCase();
          if (currentLevel === targetLevel.toLowerCase()) {
            count++;
          }
        }
      });
    }
    return count;
  };

  const skills = getSkillsByCategory();
  const levels = getLevelsForTrack();

  const sortedSkills = skills
    .map(skill => ({
      title: skill.title,
      advancedCount: countSkillLevels(skill.title, levels, 'advanced'),
      intermediateCount: countSkillLevels(skill.title, levels, 'intermediate'),
      beginnerCount: countSkillLevels(skill.title, levels, 'beginner'),
      unspecifiedCount: countSkillLevels(skill.title, levels, 'unspecified')
    }))
    .sort((a, b) => {
      const advancedDiff = b.advancedCount - a.advancedCount;
      if (advancedDiff !== 0) return advancedDiff;
      
      const intermediateDiff = b.intermediateCount - a.intermediateCount;
      if (intermediateDiff !== 0) return intermediateDiff;
      
      const beginnerDiff = b.beginnerCount - a.beginnerCount;
      if (beginnerDiff !== 0) return beginnerDiff;
      
      const unspecifiedDiff = a.unspecifiedCount - b.unspecifiedCount;
      if (unspecifiedDiff !== 0) return unspecifiedDiff;
      
      return a.title.localeCompare(b.title);
    })
    .map(skill => skill.title);

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px] font-semibold bg-background/80 border-r border-border">
              Skill
            </TableHead>
            {levels.map((level, index) => (
              <TableHead 
                key={level} 
                className={`text-center bg-background/80 ${index !== levels.length - 1 ? 'border-r' : ''} border-border`}
              >
                <div className="font-semibold">{level.toUpperCase()}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <CompetencyLoadingState />
          ) : (
            sortedSkills.map((skillName) => (
              <TableRow key={skillName} className="hover:bg-background/30 transition-colors">
                <TableCell className="font-medium border-r border-border">
                  {skillName}
                </TableCell>
                {levels.map((level, index) => (
                  <SkillCell 
                    key={level}
                    skillName={skillName}
                    details={getSkillDetails(skillName, level)}
                    isLastColumn={index === levels.length - 1}
                    levelKey={level.toLowerCase()}
                  />
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
