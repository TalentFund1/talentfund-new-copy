import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompetencyStore } from "./CompetencyState";
import { SkillCell } from "./SkillCell";
import { roleSkills } from "../data/roleSkills";
import { professionalLevels, managerialLevels } from "../../benchmark/data/levelData";
import { useParams } from "react-router-dom";

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
  const { roleStates } = useCompetencyStore();
  const { id: roleId } = useParams<{ id: string }>();

  const getLevelsForTrack = () => {
    return track === "Managerial" ? Object.keys(managerialLevels) : Object.keys(professionalLevels);
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

  const skills = getSkillsByCategory();
  const levels = getLevelsForTrack();

  // New sorting logic based on competency levels
  const sortedSkills = skills
    .map(skill => ({
      title: skill.title,
      advancedCount: countSkillLevels(skill.title, levels, 'advanced'),
      intermediateCount: countSkillLevels(skill.title, levels, 'intermediate'),
      beginnerCount: countSkillLevels(skill.title, levels, 'beginner'),
      unspecifiedCount: countSkillLevels(skill.title, levels, 'unspecified')
    }))
    .sort((a, b) => {
      // First sort by number of advanced levels
      const advancedDiff = b.advancedCount - a.advancedCount;
      if (advancedDiff !== 0) return advancedDiff;
      
      // Then by number of intermediate levels
      const intermediateDiff = b.intermediateCount - a.intermediateCount;
      if (intermediateDiff !== 0) return intermediateDiff;
      
      // Then by number of beginner levels
      const beginnerDiff = b.beginnerCount - a.beginnerCount;
      if (beginnerDiff !== 0) return beginnerDiff;
      
      // Finally alphabetically
      return a.title.localeCompare(b.title);
    })
    .map(skill => skill.title);

  console.log('Sorted skills with level counts:', skills.map(skill => ({
    title: skill.title,
    advanced: countSkillLevels(skill.title, levels, 'advanced'),
    intermediate: countSkillLevels(skill.title, levels, 'intermediate'),
    beginner: countSkillLevels(skill.title, levels, 'beginner'),
    unspecified: countSkillLevels(skill.title, levels, 'unspecified')
  })));

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden mb-8">
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
          {sortedSkills.map((skillName) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};