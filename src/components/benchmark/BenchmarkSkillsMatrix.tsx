import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useBenchmarkSearch } from "../skills/context/BenchmarkSearchContext";
import { useSkillsMatrixStore } from "./skills-matrix/SkillsMatrixState";
import { filterSkillsByCategory } from "./skills-matrix/skillCategories";
import { getEmployeeSkills } from "./skills-matrix/initialSkills";
import { SkillsMatrixTable } from "./skills-matrix/SkillsMatrixTable";
import { BenchmarkMatrixFilters } from "./skills-matrix/BenchmarkMatrixFilters";
import { RoleSelection } from "./RoleSelection";
import { useRoleStore } from "./RoleBenchmark";
import { useToggledSkills } from "../skills/context/ToggledSkillsContext";
import { useCompetencyStateReader } from "../skills/competency/CompetencyStateReader";
import { CategorizedSkills } from "./CategorizedSkills";

const ITEMS_PER_PAGE = 10;

export const BenchmarkSkillsMatrix = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSearchSkills, setSelectedSearchSkills] = useState<string[]>([]);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedInterest, setSelectedInterest] = useState("all");
  const { id } = useParams<{ id: string }>();
  const { benchmarkSearchSkills } = useBenchmarkSearch();
  const observerTarget = useRef<HTMLDivElement>(null);
  const { currentStates } = useSkillsMatrixStore();
  const { selectedRole, setSelectedRole, selectedLevel: roleLevel, setSelectedLevel: setRoleLevel } = useRoleStore();
  const { toggledSkills } = useToggledSkills();
  const { getSkillCompetencyState } = useCompetencyStateReader();

  const roles = {
    "123": "AI Engineer",
    "124": "Backend Engineer",
    "125": "Frontend Engineer",
    "126": "Engineering Manager"
  };

  useEffect(() => {
    setSelectedSearchSkills(benchmarkSearchSkills);
  }, [benchmarkSearchSkills]);

  const employeeSkills = getEmployeeSkills(id || "");

  const getRoleLevelPriority = (level: string) => {
    const priorities: { [key: string]: number } = {
      'advanced': 0,
      'intermediate': 1,
      'beginner': 2,
      'unspecified': 3
    };
    return priorities[level.toLowerCase()] ?? 3;
  };

  const filteredSkills = filterSkillsByCategory(employeeSkills, "all")
    .filter(skill => {
      if (!toggledSkills.has(skill.title)) {
        return false;
      }

      let matchesLevel = true;
      let matchesInterest = true;
      let matchesSearch = true;

      const competencyState = getSkillCompetencyState(skill.title, roleLevel.toLowerCase());
      const roleSkillLevel = competencyState?.level || 'unspecified';

      if (selectedLevel !== 'all') {
        matchesLevel = roleSkillLevel.toLowerCase() === selectedLevel.toLowerCase();
      }

      const currentSkillState = currentStates[skill.title];
      const requirement = (currentSkillState?.requirement || skill.requirement || 'unknown').toLowerCase();

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

      if (selectedSearchSkills.length > 0) {
        matchesSearch = selectedSearchSkills.some(term => 
          skill.title.toLowerCase().includes(term.toLowerCase())
        );
      } else if (searchTerm) {
        matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return matchesLevel && matchesInterest && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by Role Skills level
      const aCompetencyState = getSkillCompetencyState(a.title, roleLevel.toLowerCase());
      const bCompetencyState = getSkillCompetencyState(b.title, roleLevel.toLowerCase());
      
      const aRoleLevel = aCompetencyState?.level || 'unspecified';
      const bRoleLevel = bCompetencyState?.level || 'unspecified';
      
      const roleLevelDiff = getRoleLevelPriority(aRoleLevel) - getRoleLevelPriority(bRoleLevel);
      if (roleLevelDiff !== 0) return roleLevelDiff;

      // If levels are the same, sort alphabetically
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

  const paginatedSkills = filteredSkills.slice(0, visibleItems);

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground">Skills Matrix</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track employee skills and competencies
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <RoleSelection 
            selectedRole={selectedRole}
            selectedLevel={roleLevel}
            currentTrack={"Professional"}
            onRoleChange={setSelectedRole}
            onLevelChange={setRoleLevel}
            onTrackChange={() => {}}
            roles={roles}
          />
        </div>

        <CategorizedSkills 
          roleId={selectedRole}
          employeeId={id || ""}
          selectedLevel={roleLevel}
        />

        <BenchmarkMatrixFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedInterest={selectedInterest}
          setSelectedInterest={setSelectedInterest}
          selectedSearchSkills={selectedSearchSkills}
          removeSearchSkill={(skill) => setSelectedSearchSkills((prev) => prev.filter(s => s !== skill))}
          clearSearch={() => setSearchTerm("")}
        />

        <SkillsMatrixTable 
          filteredSkills={paginatedSkills}
          showCompanySkill={false}
          isRoleBenchmark={true}
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
