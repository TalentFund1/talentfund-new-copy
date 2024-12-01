import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Employee } from "./types/employeeTypes";
import { EmployeeTableHeader } from "./employee/EmployeeTableHeader";
import { EmployeeTableRow } from "./employee/EmployeeTableRow";
import { useSkillsMatrixStore } from "./benchmark/skills-matrix/SkillsMatrixState";
import { useToggledSkills } from "./skills/context/ToggledSkillsContext";
import { useCompetencyStateReader } from "./skills/competency/CompetencyStateReader";
import { filterEmployeesBySkills } from "./employee/EmployeeSkillsFilter";
import { filterEmployees } from "./employee/EmployeeFilters";
import { sortEmployeesByRoleMatch } from "./employee/EmployeeMatchSorter";
import { useEmployeeTableState } from "./employee/EmployeeTableState";
import { EMPLOYEE_IMAGES } from "./employee/EmployeeData";
import { useEmployeeStore } from "./employee/store/employeeStore";
import { ToggledSkillsProvider } from "./skills/context/ToggledSkillsContext";
import { TrackProvider } from "./skills/context/TrackContext";
import { Card } from "@/components/ui/card";
import { EmployeeSkillCard } from "./EmployeeSkillCard";

interface EmployeeTableProps {
  selectedDepartment?: string[];
  selectedJobTitle?: string[];
  selectedLevel?: string[];
  selectedOffice?: string[];
  selectedEmploymentType?: string[];
  selectedSkills?: string[];
  selectedEmployees?: string[];
  selectedManager?: string[];
}

export const getSkillProfileId = (role: string) => {
  const validProfileIds = ["123", "124", "125", "126", "127", "128", "129", "130"];
  if (validProfileIds.includes(role)) {
    console.log('Using direct role ID:', role);
    return role;
  }

  const roleMap: { [key: string]: string } = {
    "AI Engineer": "123",
    "Backend Engineer": "124",
    "Frontend Engineer": "125",
    "Engineering Manager": "126",
    "Data Engineer": "127",
    "DevOps Engineer": "128",
    "Product Manager": "129",
    "Frontend Developer": "125"  // Alias for Frontend Engineer
  };
  
  const baseRole = role.split(":")[0].trim();
  const mappedId = roleMap[baseRole];
  
  console.log('Role mapping:', { 
    originalRole: role,
    baseRole,
    mappedId
  });
  
  return mappedId;
};

export const getBaseRole = (role: string) => {
  return role.split(":")[0].trim();
};

export const getLevel = (role: string) => {
  const parts = role.split(":");
  return parts.length > 1 ? parts[1].trim() : "";
};

const EmployeeTableContent = ({ 
  selectedDepartment = [], 
  selectedJobTitle = [],
  selectedLevel = [],
  selectedOffice = [],
  selectedEmploymentType = [],
  selectedSkills = [],
  selectedEmployees = [],
  selectedManager = []
}: EmployeeTableProps) => {
  const { currentStates } = useSkillsMatrixStore();
  const { toggledSkills } = useToggledSkills();
  const { getSkillCompetencyState } = useCompetencyStateReader();
  const { selectedRows, handleSelectAll, handleSelectEmployee } = useEmployeeTableState();
  const employees = useEmployeeStore((state) => {
    console.log('Current employees in store:', state.employees);
    return state.employees;
  });

  const preFilteredEmployees = filterEmployees(
    employees,
    selectedEmployees,
    selectedDepartment,
    selectedJobTitle,
    selectedLevel,
    selectedOffice,
    selectedEmploymentType,
    selectedSkills,
    selectedManager
  );

  console.log('Pre-filtered employees:', preFilteredEmployees);

  const skillFilteredEmployees = filterEmployeesBySkills(preFilteredEmployees, selectedSkills);

  console.log('Skill filtered employees:', skillFilteredEmployees);

  const sortedEmployees = sortEmployeesByRoleMatch(
    skillFilteredEmployees,
    selectedJobTitle,
    currentStates,
    toggledSkills,
    getSkillCompetencyState
  );

  const selectedRoleId = selectedJobTitle.length > 0 ? getSkillProfileId(selectedJobTitle[0]) : undefined;

  const exactMatches = sortedEmployees.filter(employee => 
    selectedJobTitle.length > 0 && selectedJobTitle.some(title => 
      getBaseRole(title) === getBaseRole(employee.role)
    )
  );

  const skillMatches = sortedEmployees.filter(employee => 
    !selectedJobTitle.some(title => 
      getBaseRole(title) === getBaseRole(employee.role)
    )
  );

  console.log('Exact matches:', exactMatches);
  console.log('Skill matches:', skillMatches);

  const renderEmployeeCards = (employees: Employee[], title: string, useSelectedRole: boolean = false) => (
    <Card className="mb-6">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {employees.length} {employees.length === 1 ? 'employee' : 'employees'}
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map((employee, index) => (
          <EmployeeSkillCard
            key={employee.id}
            name={employee.name}
            role={employee.role}
            avatar={`https://images.unsplash.com/${EMPLOYEE_IMAGES[index % EMPLOYEE_IMAGES.length]}?auto=format&fit=crop&w=96&h=96`}
            skills={[]}
            employeeId={employee.id}
            benchmarkRoleId={useSelectedRole ? selectedRoleId : undefined}
          />
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {selectedJobTitle.length > 0 ? (
        <>
          {renderEmployeeCards(exactMatches, "People with this job")}
          {renderEmployeeCards(skillMatches, "People with skills that match this job", true)}
        </>
      ) : (
        renderEmployeeCards(sortedEmployees, "All Employees")
      )}
    </div>
  );
};

export const EmployeeTable = (props: EmployeeTableProps) => {
  return (
    <TrackProvider>
      <ToggledSkillsProvider>
        <EmployeeTableContent {...props} />
      </ToggledSkillsProvider>
    </TrackProvider>
  );
};
