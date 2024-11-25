import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/Sidebar";
import { SkillProfileTable } from "./SkillProfileTable";
import { useToggledSkills } from "./context/ToggledSkillsContext";
import { roleSkills } from './data/roleSkills';
import { jobTitles } from './competency/skillProfileData';
import { SkillProfileStats } from "./stats/SkillProfileStats";
import { SkillProfileFilters } from "./search/SkillProfileFilters";
import { SkillCategoryCards } from "./filter/SkillCategoryCards";
import { filterSkillsByCategory } from "./utils/skillFiltering";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "react-router-dom";

const SkillsProfile = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toggledSkills } = useToggledSkills();
  const { id: roleId } = useParams<{ id: string }>();

  const availableJobTitles = Object.keys(jobTitles).map(id => jobTitles[id]);
  const toggledSkillsList = Array.from(toggledSkills);

  // Company functions/departments
  const companyFunctions = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "Finance",
    "Human Resources",
    "Operations",
    "Legal",
    "Customer Success"
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6 ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Skill Profiles</h1>
            <div className="space-x-2">
              <Button variant="outline">Export Data</Button>
              <Button>Add Profile</Button>
            </div>
          </div>

          <SkillProfileFilters
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            selectedFunction={selectedFunction}
            setSelectedFunction={setSelectedFunction}
            selectedJobTitle={selectedJobTitle}
            setSelectedJobTitle={setSelectedJobTitle}
            toggledSkillsList={toggledSkillsList}
            availableJobTitles={availableJobTitles}
            companyFunctions={companyFunctions}
          />

          <SkillCategoryCards
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            roleId={roleId || "123"}
          />

          <SkillProfileStats />

          <Card className="p-6">
            <SkillProfileTable 
              selectedFunction={selectedFunction} 
              selectedSkills={selectedSkills}
              selectedJobTitle={selectedJobTitle}
              selectedCategory={selectedCategory}
              roleId={roleId || "123"}
            />

            <Separator className="my-4" />
            
            <div className="flex justify-between items-center">
              <Select defaultValue="10">
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10 rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="20">20 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">1-5 of 5</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillsProfile;