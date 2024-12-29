import { TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UnifiedSkill } from "../types/SkillTypes";
import { useEmployeeSkillsStore } from "../../employee/store/employeeSkillsStore";
import { useParams } from "react-router-dom";
import { Check } from "lucide-react";

interface SkillProfileMatrixRowProps {
  skill: UnifiedSkill;
  isToggled: boolean;
  onToggle: () => void;
}

export const SkillProfileMatrixRow = ({
  skill,
  isToggled,
  onToggle
}: SkillProfileMatrixRowProps) => {
  const { id: employeeId } = useParams();
  const { getSkillState, updateSkillState } = useEmployeeSkillsStore();

  const skillState = getSkillState(employeeId || "", skill.title);

  const handleDevelopmentPlanChange = (checked: boolean) => {
    if (!employeeId) return;
    
    console.log('Updating development plan:', {
      employeeId,
      skillTitle: skill.title,
      inDevelopmentPlan: checked
    });

    updateSkillState(employeeId, skill.title, {
      inDevelopmentPlan: checked
    });
  };

  return (
    <TableRow className="border-t border-border hover:bg-muted/50 transition-colors">
      <TableCell className="py-3 px-4 align-middle">
        <div className="flex items-center gap-2">
          <Switch 
            checked={isToggled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-primary"
          />
          <span className="text-sm">{skill.title}</span>
        </div>
      </TableCell>
      <TableCell className="py-3 px-4 align-middle">
        <span className="text-sm block truncate" title={skill.subcategory}>
          {skill.subcategory}
        </span>
      </TableCell>
      <TableCell className="py-3 px-4 align-middle">
        <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-sm inline-flex items-center">
          ↗ {skill.growth}
        </span>
      </TableCell>
      <TableCell className="py-3 px-2 align-middle text-sm">{skill.salary}</TableCell>
      <TableCell className="py-3 px-4 align-middle">
        <div className="flex items-center justify-center">
          <Checkbox
            id={`skill-growth-${skill.title}`}
            checked={skillState.inDevelopmentPlan}
            onCheckedChange={handleDevelopmentPlanChange}
            className="h-5 w-5 rounded-md border-2 border-gray-200 data-[state=checked]:border-gray-400 data-[state=checked]:bg-gray-400 hover:border-gray-300 transition-colors"
          >
            <Check className="h-3.5 w-3.5 text-white" />
          </Checkbox>
        </div>
      </TableCell>
      <TableCell className="py-3 px-8 align-middle">
        <div className="flex justify-center gap-1">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">B</span>
          <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-sm font-medium">R</span>
          <span className="w-6 h-6 rounded-full bg-[#E5DEFF] text-[#6E59A5] flex items-center justify-center text-sm font-medium">M</span>
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-medium">O</span>
        </div>
      </TableCell>
    </TableRow>
  );
};