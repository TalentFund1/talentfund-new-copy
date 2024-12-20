import { TableCell } from "@/components/ui/table";
import { Star, Shield, Target, CircleDashed, Check, X } from "lucide-react";
import { useSkillsMatrixStore } from "./skills-matrix/SkillsMatrixState";
import { useEffect } from "react";

interface StaticSkillLevelCellProps {
  initialLevel: string;
  skillTitle: string;
}

export const StaticSkillLevelCell = ({ 
  initialLevel, 
  skillTitle,
}: StaticSkillLevelCellProps) => {
  const { currentStates, initializeState } = useSkillsMatrixStore();

  // Initialize the skill state with initial level and requirement
  useEffect(() => {
    console.log('Initializing static skill cell:', {
      skillTitle,
      initialLevel,
      currentState: currentStates[skillTitle]
    });
    
    if (!currentStates[skillTitle]) {
      initializeState(skillTitle, 'unspecified', 'preferred');
    }
  }, [skillTitle, initialLevel, currentStates, initializeState]);

  const currentState = currentStates[skillTitle] || {
    level: 'unspecified',
    requirement: 'preferred'
  };

  const getLevelIcon = (level: string = 'unspecified') => {
    switch (level.toLowerCase()) {
      case 'advanced':
        return <Star className="w-3.5 h-3.5 text-primary-accent" />;
      case 'intermediate':
        return <Shield className="w-3.5 h-3.5 text-primary-icon" />;
      case 'beginner':
        return <Target className="w-3.5 h-3.5 text-[#008000]" />;
      default:
        return <CircleDashed className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const getRequirementIcon = (requirement: string = 'unknown') => {
    switch (requirement?.toLowerCase()) {
      case 'required':
        return <Check className="w-3.5 h-3.5" />;
      case 'not-interested':
        return <X className="w-3.5 h-3.5" />;
      case 'unknown':
        return <CircleDashed className="w-3.5 h-3.5" />;
      default:
        return <CircleDashed className="w-3.5 h-3.5" />;
    }
  };

  const getLevelStyles = (level: string = 'unspecified') => {
    const baseStyles = 'rounded-t-md px-3 py-2.5 text-sm font-medium w-full capitalize flex items-center justify-center min-h-[42px] text-[#1f2144]';
    
    switch (level?.toLowerCase()) {
      case 'advanced':
        return `${baseStyles} border-2 border-primary-accent bg-primary-accent/10`;
      case 'intermediate':
        return `${baseStyles} border-2 border-primary-icon bg-primary-icon/10`;
      case 'beginner':
        return `${baseStyles} border-2 border-[#008000] bg-[#008000]/10`;
      default:
        return `${baseStyles} border-2 border-gray-400 bg-gray-100/50`;
    }
  };

  const getRequirementStyles = (level: string = 'unspecified', requirement: string = 'unknown') => {
    const borderColor = level.toLowerCase() === 'advanced' 
      ? 'border-primary-accent'
      : level.toLowerCase() === 'intermediate'
        ? 'border-primary-icon'
        : level.toLowerCase() === 'beginner'
          ? 'border-[#008000]'
          : 'border-gray-400';

    return `text-xs px-2 py-2 font-normal text-[#1f2144] w-full flex items-center justify-center gap-1.5 bg-[#F9FAFB] border-x-2 border-b-2 min-h-[36px] rounded-b-md ${borderColor}`;
  };

  return (
    <TableCell className="border-r border-blue-200 p-0">
      <div className="flex flex-col items-stretch h-full">
        <div className={getLevelStyles(currentState?.level)}>
          <span className="flex items-center gap-2">
            {getLevelIcon(currentState?.level)}
            {(currentState?.level || 'unspecified').charAt(0).toUpperCase() + (currentState?.level || 'unspecified').slice(1)}
          </span>
        </div>
        <div className={getRequirementStyles(currentState?.level, currentState?.requirement)}>
          <span className="flex items-center gap-1.5">
            {getRequirementIcon(currentState?.requirement)}
            {currentState?.requirement === 'required' ? 'Skill Goal' : 
             currentState?.requirement === 'not-interested' ? 'Not Interested' : 
             currentState?.requirement === 'unknown' ? 'Unknown' : 'Unknown'}
          </span>
        </div>
      </div>
    </TableCell>
  );
};