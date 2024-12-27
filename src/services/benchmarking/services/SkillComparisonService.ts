import { EmployeeSkillData } from '../../../components/employee/types/employeeSkillTypes';
import { RoleSkillRequirement } from '../../../components/skills/types/roleSkillTypes';
import { SkillLevel } from '../../../components/skills/types/sharedSkillTypes';

interface SkillComparisonResult {
  skillTitle: string;
  employeeLevel: SkillLevel;
  requiredLevel: SkillLevel;
  matchPercentage: number;
}

interface ComparisonMetrics {
  totalSkills: number;
  matchingSkills: number;
  averageMatchPercentage: number;
  missingSkills: string[];
  exceedingSkills: string[];
}

class SkillComparisonService {
  private getLevelValue(level: SkillLevel): number {
    const levelValues = {
      'advanced': 3,
      'intermediate': 2,
      'beginner': 1,
      'unspecified': 0
    };
    return levelValues[level] || 0;
  }

  public getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  public compareSkillLevels(
    employeeSkill: EmployeeSkillData,
    roleRequirement: RoleSkillRequirement
  ): SkillComparisonResult {
    console.log('SkillComparisonService: Comparing skill levels:', {
      skill: employeeSkill.title,
      employeeLevel: employeeSkill.level,
      requiredLevel: roleRequirement.minimumLevel
    });

    const employeeValue = this.getLevelValue(employeeSkill.level as SkillLevel);
    const requiredValue = this.getLevelValue(roleRequirement.minimumLevel as SkillLevel);
    const matchPercentage = employeeValue >= requiredValue ? 100 : 0;

    const result = {
      skillTitle: employeeSkill.title,
      employeeLevel: employeeSkill.level as SkillLevel,
      requiredLevel: roleRequirement.minimumLevel as SkillLevel,
      matchPercentage
    };

    console.log('SkillComparisonService: Comparison result:', result);
    return result;
  }

  public calculateOverallMatch(
    employeeSkills: ReadonlyArray<EmployeeSkillData>,
    roleRequirements: ReadonlyArray<RoleSkillRequirement>
  ): ComparisonMetrics {
    console.log('SkillComparisonService: Calculating overall match:', {
      employeeSkillCount: employeeSkills.length,
      roleRequirementCount: roleRequirements.length
    });

    const metrics: ComparisonMetrics = {
      totalSkills: roleRequirements.length,
      matchingSkills: 0,
      averageMatchPercentage: 0,
      missingSkills: [],
      exceedingSkills: []
    };

    if (roleRequirements.length === 0) {
      console.log('SkillComparisonService: No role requirements to compare against');
      return metrics;
    }

    roleRequirements.forEach(requirement => {
      const employeeSkill = employeeSkills.find(skill => skill.title === requirement.title);
      
      if (employeeSkill) {
        const comparison = this.compareSkillLevels(employeeSkill, requirement);
        if (comparison.matchPercentage === 100) {
          metrics.matchingSkills++;
        }
      } else {
        metrics.missingSkills.push(requirement.title);
      }
    });

    employeeSkills.forEach(skill => {
      if (!roleRequirements.some(req => req.title === skill.title)) {
        metrics.exceedingSkills.push(skill.title);
      }
    });

    metrics.averageMatchPercentage = metrics.totalSkills > 0 
      ? (metrics.matchingSkills / metrics.totalSkills) * 100 
      : 0;

    console.log('SkillComparisonService: Comparison metrics:', metrics);
    return metrics;
  }
}

export const skillComparisonService = new SkillComparisonService();