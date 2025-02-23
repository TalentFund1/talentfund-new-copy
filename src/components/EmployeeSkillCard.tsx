import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeSkillsStore } from "./employee/store/employeeSkillsStore";
import { useMemo, useEffect } from "react";
import { EmployeeSkillCardProps } from "./employee/types/employeeSkillProps";
import { benchmarkingService } from "../services/benchmarking";

export const EmployeeSkillCard = ({ 
  name, 
  role, 
  avatar, 
  skills, 
  employeeId 
}: Readonly<EmployeeSkillCardProps>) => {
  const { toast } = useToast();
  const { getSkillState, batchUpdateSkills, getEmployeeSkills, initializeEmployeeSkills } = useEmployeeSkillsStore();
  
  // Initialize skills when component mounts
  useEffect(() => {
    if (employeeId) {
      console.log('EmployeeSkillCard - Initializing skills for:', employeeId);
      initializeEmployeeSkills(employeeId);
    }
  }, [employeeId]);

  // Get all employee skills including newly added ones
  const employeeSkills = useMemo(() => {
    return getEmployeeSkills(employeeId);
  }, [employeeId, getEmployeeSkills]);

  console.log('Rendering EmployeeSkillCard:', { 
    name, 
    role, 
    employeeId,
    totalSkills: employeeSkills.length,
    skills: employeeSkills.map(s => ({ 
      title: s.title, 
      level: getSkillState(employeeId, s.title).level,
      inDevelopmentPlan: getSkillState(employeeId, s.title).inDevelopmentPlan // Added this line
    }))
  });

  const getLevelPercentage = (skillName: string): number => {
    const skillState = getSkillState(employeeId, skillName);
    console.log('Getting level percentage for skill:', {
      employeeId,
      skillName,
      level: skillState.level,
      inDevelopmentPlan: skillState.inDevelopmentPlan // Added this line
    });
    
    return benchmarkingService.compareSkillLevels(
      { title: skillName, level: skillState.level },
      { title: skillName, minimumLevel: 'beginner' }
    ).matchPercentage;
  };

  const handleSkillClick = (skillName: string) => {
    const percentage = getLevelPercentage(skillName);
    const skillState = getSkillState(employeeId, skillName);
    
    const updates = {
      [skillName]: benchmarkingService.createSkillState(
        skillState.level,
        skillState.goalStatus
      )
    };

    console.log('Preparing batch update for skill:', {
      employeeId,
      skillName,
      updates
    });

    batchUpdateSkills(employeeId, updates);
    
    toast({
      title: skillName,
      description: `Current level: ${percentage}% (${skillState.level})`,
    });
  };

  // Memoize the processed skills data using all employee skills
  const processedSkills = useMemo(() => employeeSkills.map(skill => ({
    ...skill,
    name: skill.title,
    percentage: getLevelPercentage(skill.title)
  })), [employeeSkills, employeeId]);

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-12 w-12">
          <img src={avatar} alt={name} className="object-cover" />
        </Avatar>
        <div>
          <h3 className="font-semibold text-primary">{name}</h3>
          <p className="text-sm text-secondary-foreground">{role}</p>
        </div>
      </div>
      <div className="space-y-4">
        {processedSkills.map((skill) => (
          <div 
            key={skill.name} 
            className="space-y-1.5 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
            onClick={() => handleSkillClick(skill.name)}
          >
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="text-sm text-secondary-foreground">
                {skill.percentage}%
              </span>
            </div>
            <Progress
              value={skill.percentage}
              className={`h-2 transition-all duration-300 ${benchmarkingService.getProgressColor(skill.percentage)}`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};