import { useRef } from "react";
import { SkillsMatrixContent } from "./SkillsMatrixContent";
import { CategorizedSkills } from "../CategorizedSkills";
import { useSkillsMatrixStore } from "./SkillsMatrixState";
import { useToggledSkills } from "../../skills/context/ToggledSkillsContext";

interface BenchmarkSkillsMatrixContentProps {
  roleId: string;
  employeeId: string;
  roleLevel: string;
  filteredSkills: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedInterest: string;
  setSelectedInterest: (interest: string) => void;
  selectedSkillLevel: string;
  setSelectedSkillLevel: (level: string) => void;
  selectedSearchSkills: string[];
  setSelectedSearchSkills: (skills: string[]) => void;
  visibleItems: number;
  observerTarget: React.RefObject<HTMLDivElement>;
}

export const BenchmarkSkillsMatrixContent = ({
  roleId,
  employeeId,
  roleLevel,
  filteredSkills,
  ...props
}: BenchmarkSkillsMatrixContentProps) => {
  return (
    <>
      <CategorizedSkills 
        roleId={roleId}
        employeeId={employeeId}
        selectedLevel={roleLevel}
      />

      <SkillsMatrixContent 
        filteredSkills={filteredSkills}
        {...props}
      />
    </>
  );
};