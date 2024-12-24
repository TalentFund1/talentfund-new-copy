import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Check } from "lucide-react";

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
    const baseStyles = 'text-xs px-2 py-1.5 font-medium text-[#1f2144] w-full flex items-center justify-center gap-1.5';
    
    switch (requirement.toLowerCase()) {
      case 'required':
        return `${baseStyles} bg-gray-100 border-x-2 border-b-2 rounded-b-md ${
          level.toLowerCase() === 'advanced' 
            ? 'border-primary-accent' 
            : level.toLowerCase() === 'intermediate'
              ? 'border-primary-icon'
              : level.toLowerCase() === 'beginner'
                ? 'border-[#008000]'
                : 'border-gray-300'
        }`;
      case 'not_interested':
      case 'unknown':
      default:
        return `${baseStyles} bg-white border-x-2 border-b-2 rounded-b-md border-gray-300`;
    }
  };

  return (
    <Select 
      value={currentRequired}
      onValueChange={onRequirementChange}
    >
      <SelectTrigger 
        className={getRequirementStyles(currentRequired, currentLevel)}
      >
        <SelectValue>
          <span className="flex items-center gap-2 justify-center text-gray-600">
            {currentRequired === 'required' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Required</span>
              </>
            ) : currentRequired === 'not_interested' ? (
              <span>Not Interested</span>
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
          <span>Not Interested</span>
        </SelectItem>
        <SelectItem value="preferred">
          <span className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" /> Preferred
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};