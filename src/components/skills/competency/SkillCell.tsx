import { TableCell } from "@/components/ui/table";
import { useCompetencyStore } from "./CompetencyState";
import { LevelSelector } from "./LevelSelector";
import { useParams } from "react-router-dom";
import { SkillLevel } from "@/types/skillTypes";

interface SkillCellProps {
  skillName: string;
  details: {
    level: string;
  };
  isLastColumn: boolean;
  levelKey: string;
}

export const SkillCell = ({ 
  skillName, 
  details, 
  isLastColumn, 
  levelKey 
}: SkillCellProps) => {
  const { roleStates, setSkillState } = useCompetencyStore();
  const { id: roleId } = useParams<{ id: string }>();
  const currentRoleId = roleId || "123";

  const currentState = roleStates[currentRoleId]?.[skillName]?.[levelKey] || {
    id: skillName,
    skillId: skillName,
    level: details.level || "unspecified"
  };

  const handleLevelChange = (value: SkillLevel) => {
    console.log('Changing level:', {
      skillName,
      levelKey,
      newLevel: value,
      roleId: currentRoleId
    });
    
    setSkillState(
      skillName,
      value,
      levelKey,
      currentRoleId,
      skillName
    );
  };

  return (
    <TableCell 
      className={`text-center p-2 align-middle ${!isLastColumn ? 'border-r' : ''} border-border`}
    >
      <div className="flex flex-col items-center gap-0">
        <LevelSelector
          currentLevel={currentState.level}
          onLevelChange={handleLevelChange}
        />
      </div>
    </TableCell>
  );
};