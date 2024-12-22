import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SkillsMatrixFiltersProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedInterest: string;
  setSelectedInterest: (interest: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  addSkillButton: React.ReactNode;
}

export const SkillsMatrixFilters = ({
  selectedLevel,
  setSelectedLevel,
  selectedInterest,
  setSelectedInterest,
  selectedCategory,
  setSelectedCategory,
  addSkillButton,
}: SkillsMatrixFiltersProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="specialized">Specialized Skills</SelectItem>
            <SelectItem value="common">Common Skills</SelectItem>
            <SelectItem value="certification">Certification</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedInterest} onValueChange={setSelectedInterest}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select Interest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requirements</SelectItem>
            <SelectItem value="required">Required</SelectItem>
            <SelectItem value="skill_goal">Skill Goal</SelectItem>
            <SelectItem value="not_interested">Not Interested</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {addSkillButton}
    </div>
  );
};