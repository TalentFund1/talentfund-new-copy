import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Check, CircleDashed } from "lucide-react";

interface RequirementSelectorProps {
  currentRequired: string;
  currentLevel: string;
  onRequirementChange: (value: string) => void;
}

export const RequirementSelector = ({ 
  currentRequired, 
  currentLevel,
  onRequirementChange 
}: RequirementSelectorProps) => {
  const getRequirementStyles = (requirement: string, level: string) => {
    const baseStyles = 'text-xs px-2 py-1.5 font-medium text-gray-600 w-full flex items-center justify-center gap-1.5';
    
    switch (requirement.toLowerCase()) {
      case 'required':
        return `${baseStyles} border-x-2 border-b-2 rounded-b-md ${
          level.toLowerCase() === 'advanced' 
            ? 'bg-gray-100 border-primary-accent' 
            : level.toLowerCase() === 'intermediate'
              ? 'bg-gray-100 border-primary-icon'
              : level.toLowerCase() === 'beginner'
                ? 'bg-gray-100 border-[#008000]'
                : 'bg-gray-100 border-gray-300'
        }`;
      case 'not_interested':
      case 'unknown':
      default:
        return `${baseStyles} bg-gray-100 border-x-2 border-b-2 rounded-b-md border-gray-300`;
    }
  };

  // Normalize the requirement value for consistent comparison
  const normalizedRequired = currentRequired.toLowerCase();

  return (
    <Select 
      value={normalizedRequired}
      onValueChange={onRequirementChange}
    >
      <SelectTrigger 
        className={`${getRequirementStyles(normalizedRequired, currentLevel)} focus:ring-0 focus:ring-offset-0 focus-visible:ring-0`}
      >
        <SelectValue>
          <span className="flex items-center gap-2 justify-center">
            {normalizedRequired === 'required' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Required</span>
              </>
            ) : normalizedRequired === 'not_interested' ? (
              <>
                <CircleDashed className="w-3.5 h-3.5" />
                <span>Not Interested</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5" />
                <span>Preferred</span>
              </>
            )}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="required">
          <span className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5" /> Required
          </span>
        </SelectItem>
        <SelectItem value="not_interested">
          <span className="flex items-center gap-2">
            <CircleDashed className="w-3.5 h-3.5" /> Not Interested
          </span>
        </SelectItem>
        <SelectItem value="unknown">
          <span className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" /> Preferred
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};