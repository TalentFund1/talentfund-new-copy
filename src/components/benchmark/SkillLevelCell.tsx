import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { getLevelIcon, getRequirementIcon } from "./skill-level/SkillLevelIcons";
import { getLevelStyles, getRequirementStyles } from "./skill-level/SkillLevelStyles";
import { Heart, X, CircleHelp } from "lucide-react";
import { useSkillsMatrix } from "./skills-matrix/SkillsMatrixContext";

interface SkillLevelCellProps {
  initialLevel: string;
  skillTitle: string;
  onLevelChange?: (newLevel: string, requirement: string) => void;
}

export const SkillLevelCell = ({ initialLevel, skillTitle, onLevelChange }: SkillLevelCellProps) => {
  const { currentStates, setSkillState } = useSkillsMatrix();
  const [level, setLevel] = useState(initialLevel.toLowerCase());
  const [required, setRequired] = useState<string>("required");

  useEffect(() => {
    const state = currentStates[skillTitle];
    if (state) {
      setLevel(state.level);
      setRequired(state.requirement);
    }

    // Log all states when component mounts
    console.log("All Skills States:", Object.entries(currentStates).map(([skill, state]) => ({
      skill,
      level: state.level,
      requirement: state.requirement,
      label: state.requirement === 'required' ? 'Skill Goal' : 
             state.requirement === 'not-interested' ? 'Not Interested' : 
             'Unknown'
    })));
  }, [skillTitle, currentStates]);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    setSkillState(skillTitle, newLevel, required);
    onLevelChange?.(newLevel, required);
  };

  const handleRequirementChange = (newRequired: string) => {
    setRequired(newRequired);
    setSkillState(skillTitle, level, newRequired);
    onLevelChange?.(level, newRequired);
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
                {getLevelIcon('unspecified')}
                Unspecified
              </span>
            </SelectItem>
            <SelectItem value="beginner">
              <span className="flex items-center gap-1.5">
                {getLevelIcon('beginner')}
                Beginner
              </span>
            </SelectItem>
            <SelectItem value="intermediate">
              <span className="flex items-center gap-1.5">
                {getLevelIcon('intermediate')}
                Intermediate
              </span>
            </SelectItem>
            <SelectItem value="advanced">
              <span className="flex items-center gap-1.5">
                {getLevelIcon('advanced')}
                Advanced
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={required} onValueChange={handleRequirementChange}>
          <SelectTrigger 
            className={getRequirementStyles(required, level)}
          >
            <SelectValue>
              <span className="flex items-center gap-1.5 justify-center text-xs">
                {getRequirementIcon(required)}
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