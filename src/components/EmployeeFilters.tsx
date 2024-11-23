import { SearchFilter } from '@/components/market/SearchFilter';
import { useState } from "react";
import { technicalSkills, softSkills } from './skillsData';
import { Button } from '@/components/ui/button';
import { employees, getBaseRole } from './EmployeeTable';

interface EmployeeFiltersProps {
  onDepartmentChange: (department: string[]) => void;
  selectedDepartment: string[];
  onJobTitleChange: (jobTitle: string[]) => void;
  selectedJobTitle: string[];
}

export const EmployeeFilters = ({ 
  onDepartmentChange, 
  selectedDepartment,
  onJobTitleChange,
  selectedJobTitle
}: EmployeeFiltersProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string[]>([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string[]>([]);

  const allSkills = [...technicalSkills, ...softSkills];
  
  // Get unique job titles from employees
  const jobTitles = Array.from(new Set(employees.map(emp => getBaseRole(emp.role))));

  const handleClearAll = () => {
    setSelectedSkills([]);
    onJobTitleChange([]);
    setSelectedLevel([]);
    setSelectedOffice([]);
    onDepartmentChange([]);
    setSelectedEmploymentType([]);
  };

  return (
    <div className="space-y-0.5">
      <div className="w-full">
        <SearchFilter
          label=""
          placeholder="Search skills..."
          items={allSkills}
          selectedItems={selectedSkills}
          onItemsChange={setSelectedSkills}
          singleSelect={false}
        />
      </div>

      <div className="flex flex-wrap items-start gap-3">
        <SearchFilter
          label=""
          placeholder="Job Title"
          items={jobTitles}
          selectedItems={selectedJobTitle}
          onItemsChange={onJobTitleChange}
          singleSelect={true}
          className="w-[180px]"
        />
        
        <SearchFilter
          label=""
          placeholder="Level"
          items={["P1", "P2", "P3", "P4", "P5", "M1", "M2", "M3"]}
          selectedItems={selectedLevel}
          onItemsChange={setSelectedLevel}
          singleSelect={false}
          className="w-[180px]"
        />
        
        <SearchFilter
          label=""
          placeholder="Office"
          items={["Toronto", "New York", "San Francisco", "London", "Berlin"]}
          selectedItems={selectedOffice}
          onItemsChange={setSelectedOffice}
          singleSelect={false}
          className="w-[180px]"
        />

        <SearchFilter
          label=""
          placeholder="Department"
          items={["Engineering", "Product", "Design", "Marketing", "Sales"]}
          selectedItems={selectedDepartment}
          onItemsChange={onDepartmentChange}
          singleSelect={false}
          className="w-[180px]"
        />

        <SearchFilter
          label=""
          placeholder="Employment Type"
          items={["Full-time", "Part-time", "Contract", "Internship"]}
          selectedItems={selectedEmploymentType}
          onItemsChange={setSelectedEmploymentType}
          singleSelect={false}
          className="w-[180px]"
        />

        <Button 
          variant="outline" 
          onClick={handleClearAll}
          className="h-[40px] mt-4"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};