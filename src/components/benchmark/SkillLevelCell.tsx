import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Shield, Target, Heart, CircleDashed, X, CircleHelp } from "lucide-react";
import { useState, useEffect } from "react";
import { useSkillsMatrixStore } from "./skills-matrix/SkillsMatrixState";

interface SkillLevelCellProps {
  initialLevel: string;
  skillTitle: string;
  onLevelChange?: (newLevel: string, requirement: string) => void;
}

export const SkillLevelCell = ({ initialLevel, skillTitle, onLevelChange }: SkillLevelCellProps) => {
  const { currentStates, originalStates } = useSkillsMatrixStore();
  const [level, setLevel] = useState(initialLevel.toLowerCase());
  const [required, setRequired] = useState<string>("required");

  // Effect to sync with store states and handle cancellation
  useEffect(() => {
    const currentState = currentStates[skillTitle];
    const originalState = originalStates[skillTitle];
    
    if (currentState) {
      setLevel(currentState.level);
      setRequired(currentState.requirement);
    } else if (originalState) {
      setLevel(originalState.level);
      setRequired(originalState.requirement);
    }

    // Add console log to see current state
    console.log(`Skill: ${skillTitle}`, {
      level: level,
      requirement: required
    });
  }, [currentStates, originalStates, skillTitle, level, required]);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    onLevelChange?.(newLevel, required);
  };

  const handleRequirementChange = (newRequired: string) => {
    setRequired(newRequired);
    onLevelChange?.(level, newRequired);
  };

  const getLevelIcon = (level: string) => {
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

  const getLevelStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced':
        return "border-2 border-primary-accent bg-primary-accent/10";
      case 'intermediate':
        return "border-2 border-primary-icon bg-primary-icon/10";
      case 'beginner':
        return "border-2 border-[#008000] bg-[#008000]/10";
      default:
        return "border-2 border-gray-400 bg-gray-100/50";
    }
  };

  const getRequirementStyles = (requirement: string) => {
    const baseStyles = "text-xs px-2 py-1 font-normal text-[#1f2144] w-full flex items-center justify-center gap-1.5 border-x-2 border-b-2 rounded-b-md";
    
    switch (requirement) {
      case 'required':
        return `${baseStyles} bg-gray-100/90 ${getLevelBorderColor(level)}`;
      case 'interested':
        return `${baseStyles} bg-gray-50/90 border-gray-300`;
      case 'not-interested':
        return `${baseStyles} bg-white border-gray-50 text-gray-400`;
      case 'unknown':
        return `${baseStyles} bg-white border-gray-50 text-gray-400`;
      default:
        return `${baseStyles} bg-white border-gray-50 text-gray-400`;
    }
  };

  const getLevelBorderColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced':
        return 'border-primary-accent';
      case 'intermediate':
        return 'border-primary-icon';
      case 'beginner':
        return 'border-[#008000]';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <TableCell className="border-r border-blue-200 p-0">
      <div className="flex flex-col items-center">
        <Select value={level} onValueChange={handleLevelChange}>
          <SelectTrigger 
            className={`rounded-t-md px-3 py-1.5 text-sm font-medium w-full capitalize flex items-center justify-center min-h-[28px] text-[#1f2144] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 ${getLevelStyles(level)}`}
          >
            <SelectValue>
              <span className="flex items-center gap-2 justify-center text-[15px]">
                {getLevelIcon(level)}
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unspecified">
              <span className="flex items-center gap-1.5">
                <CircleDashed className="w-3.5 h-3.5 text-gray-400" />
                Unspecified
              </span>
            </SelectItem>
            <SelectItem value="beginner">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#008000]" />
                Beginner
              </span>
            </SelectItem>
            <SelectItem value="intermediate">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary-icon" />
                Intermediate
              </span>
            </SelectItem>
            <SelectItem value="advanced">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-primary-accent" />
                Advanced
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={required} onValueChange={handleRequirementChange}>
          <SelectTrigger 
            className={`text-xs px-2 py-1 font-normal w-full flex items-center justify-center min-h-[24px] border-x-2 border-b-2 rounded-b-md ${getRequirementStyles(required)}`}
          >
            <SelectValue>
              <span className="flex items-center gap-1.5 justify-center text-xs">
                {required === 'required' ? (
                  <Heart className="w-3.5 h-3.5" />
                ) : required === 'not-interested' ? (
                  <X className="w-3.5 h-3.5" />
                ) : required === 'unknown' ? (
                  <CircleHelp className="w-3.5 h-3.5" />
                ) : (
                  <Heart className="w-3.5 h-3.5" />
                )}
                {required === 'required' ? 'Skill Goal' : required === 'not-interested' ? 'Not Interested' : required === 'unknown' ? 'Unknown' : 'Skill Goal'}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="required">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Skill Goal
              </span>
            </SelectItem>
            <SelectItem value="not-interested">
              <span className="flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Not Interested
              </span>
            </SelectItem>
            <SelectItem value="unknown">
              <span className="flex items-center gap-1.5">
                <CircleHelp className="w-3.5 h-3.5" /> Unknown
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </TableCell>
  );
};
