import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSkillsMatrixStore } from "./skills-matrix/SkillsMatrixState";
import { useRoleStore } from "./RoleBenchmark";
import { useToggledSkills } from "../skills/context/ToggledSkillsContext";
import { useTrack } from "../skills/context/TrackContext";
import { useSkillsFiltering } from "./skills-matrix/useSkillsFiltering";
import { useBenchmarkSkillsMatrixState } from "./skills-matrix/BenchmarkSkillsMatrixState";
import { ToggledSkillsProvider } from "../skills/context/ToggledSkillsContext";
import { BenchmarkSkillsMatrixView } from "./skills-matrix/BenchmarkSkillsMatrixView";

const BenchmarkSkillsMatrixContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSearchSkills, setSelectedSearchSkills] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedInterest, setSelectedInterest] = useState("all");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWeight, setSelectedWeight] = useState("all");
  const { id } = useParams<{ id: string }>();
  const { selectedRole, selectedLevel: roleLevel } = useRoleStore();
  const { toggledSkills } = useToggledSkills();
  const { getTrackForRole } = useTrack();

  const track = getTrackForRole(selectedRole);
  const comparisonLevel = track === "Managerial" ? "m3" : roleLevel.toLowerCase();

  const { filteredSkills } = useSkillsFiltering(
    id || "",
    selectedRole,
    comparisonLevel,
    selectedLevel,
    selectedInterest,
    selectedSkillLevel,
    searchTerm,
    toggledSkills,
    selectedCategory,
    selectedWeight,
    true
  );
  
  console.log('BenchmarkSkillsMatrix - Current state:', {
    roleId: selectedRole,
    employeeId: id,
    selectedCategory,
    selectedWeight,
    filteredSkillsCount: filteredSkills.length,
    toggledSkillsCount: toggledSkills.size
  });

  return (
    <div className="space-y-6">
      <BenchmarkSkillsMatrixView
        roleId={selectedRole}
        employeeId={id || ""}
        roleLevel={comparisonLevel}
        filteredSkills={filteredSkills}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedInterest={selectedInterest}
        setSelectedInterest={setSelectedInterest}
        selectedSkillLevel={selectedSkillLevel}
        setSelectedSkillLevel={setSelectedSkillLevel}
        selectedSearchSkills={selectedSearchSkills}
        setSelectedSearchSkills={setSelectedSearchSkills}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedWeight={selectedWeight}
        setSelectedWeight={setSelectedWeight}
      />
    </div>
  );
};

export const BenchmarkSkillsMatrix = () => {
  return (
    <ToggledSkillsProvider>
      <BenchmarkSkillsMatrixContent />
    </ToggledSkillsProvider>
  );
};