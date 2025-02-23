import { SearchFilter } from '@/components/market/SearchFilter';
import { useState, useEffect } from "react";
import { getAllSkills } from './skills/data/skills/allSkills';
import { Button } from '@/components/ui/button';
import { getBaseRole } from './EmployeeTable';
import { EmployeeSearch } from './employee/EmployeeSearch';
import { LevelFilter } from './employee/LevelFilter';
import { useEmployeeStore } from './employee/store/employeeStore';
import { TrackProvider } from './skills/context/TrackContext';
import { roleSkills } from './skills/data/roleSkills';

interface EmployeeFiltersProps {
  onDepartmentChange: (department: string[]) => void;
  selectedDepartment: string[];
  onLevelChange: (level: string[]) => void;
  selectedLevel: string[];
  onOfficeChange: (office: string[]) => void;
  selectedOffice: string[];
  onEmploymentTypeChange: (employmentType: string[]) => void;
  selectedEmploymentType: string[];
  onSkillsChange: (skills: string[]) => void;
  selectedSkills: string[];
  onEmployeeSearch: (employees: string[]) => void;
  selectedEmployees: string[];
  onManagerChange?: (manager: string[]) => void;
  selectedManager?: string[];
  onRoleChange?: (role: string[]) => void;
  selectedRole?: string[];
}

export const EmployeeFilters = ({ 
  onDepartmentChange, 
  selectedDepartment,
  onLevelChange,
  selectedLevel,
  onOfficeChange,
  selectedOffice,
  onEmploymentTypeChange,
  selectedEmploymentType,
  onSkillsChange,
  selectedSkills,
  onEmployeeSearch,
  selectedEmployees,
  onManagerChange = () => {},
  selectedManager = [],
  onRoleChange = () => {},
  selectedRole = []
}: EmployeeFiltersProps) => {
  const allSkills = getAllSkills().map(skill => skill.title);
  console.log('Available skills for search:', allSkills);

  const employees = useEmployeeStore((state) => state.employees);
  const managers = Array.from(new Set(
    employees
      .filter(emp => emp.role.toLowerCase().includes('manager'))
      .map(emp => emp.name)
  ));

  // Create a mapping of role titles to IDs
  const roleMapping = Object.entries(roleSkills).reduce((acc, [id, data]) => {
    acc[data.title] = id;
    return acc;
  }, {} as { [key: string]: string });

  // Get roles from roleSkills
  const roles = Object.values(roleSkills).map(data => data.title);

  console.log('Available roles and their IDs:', roleMapping);

  const handleRoleChange = (items: string[]) => {
    console.log('Role selected:', items[0]);
    console.log('Corresponding role ID:', roleMapping[items[0]]);
    onRoleChange(items);
  };

  const handleClearAll = () => {
    onSkillsChange([]);
    onLevelChange([]);
    onOfficeChange([]);
    onDepartmentChange([]);
    onEmploymentTypeChange([]);
    onEmployeeSearch([]);
    onManagerChange([]);
    onRoleChange([]);
  };

  return (
    <TrackProvider>
      <div className="space-y-0.5">
        <EmployeeSearch 
          onEmployeeSearch={onEmployeeSearch}
          selectedEmployees={selectedEmployees}
        />

        <div className="w-full">
          <SearchFilter
            label=""
            placeholder="Search skills..."
            items={allSkills}
            selectedItems={selectedSkills}
            onItemsChange={(items) => onSkillsChange(items.map(item => String(item)))}
            singleSelect={false}
          />
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <SearchFilter
            label=""
            placeholder="Manager"
            items={managers}
            selectedItems={selectedManager}
            onItemsChange={(items) => onManagerChange(items.map(item => String(item)))}
            singleSelect={true}
            className="w-[180px]"
          />

          <SearchFilter
            label=""
            placeholder="Role"
            items={roles}
            selectedItems={selectedRole}
            onItemsChange={handleRoleChange}
            singleSelect={true}
            className="w-[180px]"
          />
          
          <LevelFilter
            onLevelChange={onLevelChange}
            selectedLevel={selectedLevel}
            selectedJobTitle={selectedRole}
          />
          
          <SearchFilter
            label=""
            placeholder="Office"
            items={["Toronto", "New York", "San Francisco"]}
            selectedItems={selectedOffice}
            onItemsChange={(items) => onOfficeChange(items.map(item => String(item)))}
            singleSelect={false}
            className="w-[180px]"
          />

          <SearchFilter
            label=""
            placeholder="Department"
            items={["Engineering", "Product", "Design", "Marketing", "Sales"]}
            selectedItems={selectedDepartment}
            onItemsChange={(items) => onDepartmentChange(items.map(item => String(item)))}
            singleSelect={false}
            className="w-[180px]"
          />

          <SearchFilter
            label=""
            placeholder="Category"
            items={["Full-time", "Part-time", "Contract", "Internship"]}
            selectedItems={selectedEmploymentType}
            onItemsChange={(items) => onEmploymentTypeChange(items.map(item => String(item)))}
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
    </TrackProvider>
  );
};