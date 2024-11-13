import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEmployeeSkills } from "./skills-matrix/initialSkills";
import { roleSkills } from "../skills/data/roleSkills";
import { useToggledSkills } from "../skills/context/ToggledSkillsContext";
import { useCompetencyStore } from "../skills/competency/CompetencyState";

interface MissingSkillsProps {
  roleId: string;
  employeeId: string;
  selectedLevel: string;
}

export const MissingSkills = ({ roleId, employeeId, selectedLevel }: MissingSkillsProps) => {
  const { toggledSkills } = useToggledSkills();
  const { currentStates } = useCompetencyStore();
  const employeeSkills = getEmployeeSkills(employeeId);
  const currentRoleSkills = roleSkills[roleId as keyof typeof roleSkills] || roleSkills["123"];

  // Get all required and preferred skills for the role
  const allRoleSkills = [
    ...currentRoleSkills.specialized,
    ...currentRoleSkills.common,
    ...currentRoleSkills.certifications
  ];

  // Find missing skills by comparing with employee skills, but only for toggled skills
  const missingSkills = allRoleSkills.filter(roleSkill => {
    const hasSkill = employeeSkills.some(empSkill => empSkill.title === roleSkill.title);
    return !hasSkill && toggledSkills.has(roleSkill.title);
  });

  const getLevelColor = (skillTitle: string) => {
    const level = selectedLevel.toLowerCase();
    const levelNum = parseInt(level.substring(1));
    const isManagerialTrack = level.startsWith('m');

    // AI Engineer specific progression
    if (roleId === "123") {
      if (["Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision"].includes(skillTitle)) {
        if (levelNum <= 2) return "bg-[#008000]"; // Beginner for P1-P2
        if (levelNum === 3) return "bg-primary-icon"; // Intermediate for P3
        return "bg-primary-accent"; // Advanced for P4+
      }
    }

    // Backend Engineer specific progression
    if (roleId === "124") {
      if (["Node.js", "Database Design", "API Development", "System Architecture"].includes(skillTitle)) {
        if (levelNum <= 2) return "bg-[#008000]"; // Beginner for P1-P2
        if (levelNum === 3) return "bg-primary-icon"; // Intermediate for P3
        return "bg-primary-accent"; // Advanced for P4+
      }
    }

    // Frontend Engineer specific progression (already working well)
    if (roleId === "125") {
      if (skillTitle === "React") {
        if (levelNum <= 2) return "bg-[#008000]"; // Beginner for P1-P2
        if (levelNum === 3) return "bg-gray-300"; // Unspecified for P3
        return "bg-primary-accent"; // Advanced for P4+
      }
      if (skillTitle === "TypeScript") {
        if (levelNum <= 3) return "bg-gray-300"; // Unspecified for P1-P3
        if (levelNum === 4) return "bg-primary-icon"; // Intermediate for P4
        return "bg-gray-300"; // Unspecified for P5-P6
      }
    }

    // Engineering Manager specific progression
    if (roleId === "126") {
      if (["Team Leadership", "Project Management", "Technical Architecture", "Strategic Planning"].includes(skillTitle)) {
        if (isManagerialTrack) {
          if (levelNum === 3) return "bg-primary-icon"; // Intermediate for M3
          return "bg-primary-accent"; // Advanced for M4+
        } else {
          if (levelNum <= 3) return "bg-[#008000]"; // Beginner for P1-P3
          return "bg-primary-icon"; // Intermediate for P4+
        }
      }
    }

    // Default progression for other skills
    if (isManagerialTrack) {
      if (levelNum === 3) return "bg-primary-icon"; // Intermediate for M3
      return "bg-primary-accent"; // Advanced for M4+
    } else {
      if (levelNum <= 2) return "bg-[#008000]"; // Beginner for P1-P2
      if (levelNum === 3) return "bg-primary-icon"; // Intermediate for P3
      return "bg-primary-accent"; // Advanced for P4+
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Missing Skills</span>
        <span className="bg-[#8073ec]/10 text-[#1F2144] rounded-full px-2 py-0.5 text-xs font-medium">
          {missingSkills.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {missingSkills.map((skill) => (
          <Badge 
            key={skill.title}
            variant="outline" 
            className="rounded-md px-4 py-2 border border-border bg-white hover:bg-background/80 transition-colors flex items-center gap-2"
          >
            {skill.title}
            <div className={`h-2 w-2 rounded-full ${getLevelColor(skill.title)}`} />
          </Badge>
        ))}
      </div>
    </Card>
  );
};