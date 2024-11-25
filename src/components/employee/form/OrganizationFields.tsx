import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { employees } from "../EmployeeData";
import { FormData } from "../types/FormData";

interface OrganizationFieldsProps {
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export const OrganizationFields = ({ formData, onChange }: OrganizationFieldsProps) => {
  const managers = Array.from(new Set(
    employees
      .filter(emp => emp.role.toLowerCase().includes('manager'))
      .map(emp => emp.name)
  ));

  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales"
  ];

  const offices = [
    "Toronto",
    "New York",
    "San Francisco"
  ];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => onChange({ department: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="office">Office</Label>
        <Select
          value={formData.office}
          onValueChange={(value) => onChange({ office: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select office" />
          </SelectTrigger>
          <SelectContent>
            {offices.map((office) => (
              <SelectItem key={office} value={office}>
                {office}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="manager">Manager</Label>
        <Select
          value={formData.manager}
          onValueChange={(value) => onChange({ manager: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select manager" />
          </SelectTrigger>
          <SelectContent>
            {managers.map((manager) => (
              <SelectItem key={manager} value={manager}>
                {manager}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};