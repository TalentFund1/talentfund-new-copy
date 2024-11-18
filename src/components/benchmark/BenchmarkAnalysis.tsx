import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { roleSkills } from "../skills/data/roleSkills";
import { useToggledSkills } from "../skills/context/ToggledSkillsContext";
import { useTrack } from "../skills/context/TrackContext";
import { useBenchmarkSearch } from "../skills/context/BenchmarkSearchContext";
import { useSkillsMatrixStore } from "./skills-matrix/SkillsMatrixState";
import { getEmployeeSkills } from "./skills-matrix/initialSkills";
import { useRoleStore } from "./RoleBenchmark";
import { RoleSelection } from "./RoleSelection";
import { filterSkillsByCategory } from "./skills-matrix/skillCategories";
import { SkillGoalSection } from "./SkillGoalSection";
import { CompetencyMatchSection } from "./CompetencyMatchSection";

const roles = {
  "123": "AI Engineer",
  "124": "Backend Engineer",
  "125": "Frontend Engineer",
  "126": "Engineering Manager"
};

export const BenchmarkAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const { toggledSkills } = useToggledSkills();
  const { currentStates } = useSkillsMatrixStore();
  const employeeSkills = getEmployeeSkills(id || "123");
  const { selectedRole, setSelectedRole, selectedLevel, setSelectedLevel } = useRoleStore();
  const { getTrackForRole } = useTrack();
  
  const currentRoleSkills = roleSkills[selectedRole as keyof typeof roleSkills] || roleSkills["123"];
  
  const toggledRoleSkills = [
    ...currentRoleSkills.specialized,
    ...currentRoleSkills.common,
    ...currentRoleSkills.certifications
  ].filter(skill => toggledSkills.has(skill.title));

  const matchingSkills = toggledRoleSkills.filter(roleSkill => 
    employeeSkills.some(empSkill => empSkill.title === roleSkill.title)
  );

  console.log('Matching skills:', matchingSkills.map(skill => skill.title));

  const skillGoals = matchingSkills.filter(skill => {
    const currentSkillState = currentStates[skill.title];
    const isSkillGoal = currentSkillState?.requirement === 'required';

    console.log(`Skill ${skill.title}:`, {
      currentRequirement: currentSkillState?.requirement,
      isSkillGoal
    });

    return isSkillGoal;
  });

  // New section: All matching skills with skill goals
  const allMatchingSkillGoals = matchingSkills.map(skill => ({
    ...skill,
    isGoal: currentStates[skill.title]?.requirement === 'required'
  })).filter(skill => skill.isGoal);

  console.log('All matching skill goals:', allMatchingSkillGoals.map(skill => skill.title));

  const totalSkillsCount = toggledRoleSkills.length;
  const matchingSkillsCount = matchingSkills.length;
  const matchPercentage = Math.round((matchingSkillsCount / totalSkillsCount) * 100);

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              Benchmark Analysis
              <span className="bg-[#ECFDF3] text-[#027A48] rounded-full px-3 py-1.5 text-sm font-medium">
                {matchPercentage}%
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage and track employee skills and competencies
            </p>
          </div>
          <div className="flex gap-4">
            <RoleSelection 
              selectedRole={selectedRole}
              selectedLevel={selectedLevel}
              currentTrack={getTrackForRole(selectedRole)}
              onRoleChange={setSelectedRole}
              onLevelChange={setSelectedLevel}
              onTrackChange={() => {}}
              roles={roles}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 w-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Skill Match</span>
                <span className="text-sm text-foreground">
                  {matchingSkillsCount} out of {totalSkillsCount}
                </span>
              </div>
              <div className="h-2 w-full bg-[#F7F9FF] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1F2144] rounded-full" 
                  style={{ width: `${matchPercentage}%` }} 
                />
              </div>
            </div>
          </div>

          {skillGoals.length > 0 && (
            <SkillGoalSection 
              skills={skillGoals}
              count={skillGoals.length}
            />
          )}

          {allMatchingSkillGoals.length > 0 && (
            <SkillGoalSection 
              skills={allMatchingSkillGoals}
              count={allMatchingSkillGoals.length}
              title="All Matching Skill Goals"
            />
          )}

          <CompetencyMatchSection 
            skills={matchingSkills}
            roleLevel={selectedLevel}
          />
        </div>
      </Card>
    </div>
  );
};