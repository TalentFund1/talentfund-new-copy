import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilter } from '@/components/market/SearchFilter';

interface SkillProfileFiltersProps {
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  selectedFunction: string;
  setSelectedFunction: (func: string) => void;
  selectedJobTitle: string;
  setSelectedJobTitle: (title: string) => void;
  toggledSkillsList: string[];
  availableJobTitles: string[];
  companyFunctions: string[];
}

export const SkillProfileFilters = ({
  selectedSkills,
  setSelectedSkills,
  selectedFunction,
  setSelectedFunction,
  selectedJobTitle,
  setSelectedJobTitle,
  toggledSkillsList,
  availableJobTitles,
  companyFunctions
}: SkillProfileFiltersProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <SearchFilter
          label=""
          placeholder="Search skills..."
          items={toggledSkillsList}
          selectedItems={selectedSkills}
          onItemsChange={setSelectedSkills}
        />
        
        <div className="flex flex-wrap gap-3">
          <Select value={selectedJobTitle} onValueChange={setSelectedJobTitle}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Job Title" />
            </SelectTrigger>
            <SelectContent>
              {availableJobTitles.map((title) => (
                <SelectItem key={title} value={title.toLowerCase()}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedFunction} onValueChange={setSelectedFunction}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Function" />
            </SelectTrigger>
            <SelectContent>
              {companyFunctions.map((func) => (
                <SelectItem key={func} value={func.toLowerCase()}>
                  {func}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedSkills([]);
              setSelectedFunction("");
              setSelectedJobTitle("");
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </Card>
  );
};