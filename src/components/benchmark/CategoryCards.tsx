import { Card } from "@/components/ui/card";
import { roleSkills } from '../skills/data/roleSkills';
import { useEffect, useState } from "react";
import { useCompetencyStateReader } from "../skills/competency/CompetencyStateReader";

interface CategoryCardsProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  roleId: string;
  selectedLevel: string;
}

export const CategoryCards = ({ 
  selectedCategory, 
  onCategorySelect,
  roleId,
  selectedLevel 
}: CategoryCardsProps) => {
  const { getSkillCompetencyState } = useCompetencyStateReader();
  const currentRoleSkills = roleSkills[roleId as keyof typeof roleSkills] || roleSkills["123"];
  const [counts, setCounts] = useState({
    specialized: 0,
    common: 0,
    certification: 0,
    total: 0
  });

  useEffect(() => {
    const calculateSkillCounts = () => {
      const specializedCount = currentRoleSkills.specialized?.filter(skill => {
        const competencyState = getSkillCompetencyState(skill.title, selectedLevel.toLowerCase());
        return competencyState?.required === 'required' || competencyState?.required === 'skill_goal';
      }).length || 0;
      
      const commonCount = currentRoleSkills.common?.filter(skill => {
        const competencyState = getSkillCompetencyState(skill.title, selectedLevel.toLowerCase());
        return competencyState?.required === 'required' || competencyState?.required === 'skill_goal';
      }).length || 0;
      
      const certificationCount = currentRoleSkills.certifications?.filter(skill => {
        const competencyState = getSkillCompetencyState(skill.title, selectedLevel.toLowerCase());
        return competencyState?.required === 'required' || competencyState?.required === 'skill_goal';
      }).length || 0;

      const totalCount = specializedCount + commonCount + certificationCount;

      setCounts({
        specialized: specializedCount,
        common: commonCount,
        certification: certificationCount,
        total: totalCount
      });

      console.log('CategoryCards - Updated counts:', {
        specialized: specializedCount,
        common: commonCount,
        certification: certificationCount,
        total: totalCount,
        roleId,
        selectedLevel
      });
    };

    calculateSkillCounts();
  }, [currentRoleSkills, getSkillCompetencyState, roleId, selectedLevel]);

  const categories = [
    { id: "all", name: "All Categories", count: counts.total },
    { id: "specialized", name: "Specialized Skills", count: counts.specialized },
    { id: "common", name: "Common Skills", count: counts.common },
    { id: "certification", name: "Certification", count: counts.certification }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className="w-full text-left"
        >
          <Card 
            className={`
              p-4 
              transition-colors 
              ${selectedCategory === category.id
                ? 'bg-primary-accent/5 border border-primary-accent'
                : 'bg-background border border-border hover:border-primary-accent/50'
              }
            `}
          >
            <div className="flex flex-col gap-1">
              <span className={`text-sm font-semibold ${
                selectedCategory === category.id ? 'text-primary-accent' : 'text-foreground'
              }`}>
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {category.count} {category.count === 1 ? 'skill' : 'skills'}
              </span>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
};