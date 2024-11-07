import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const EMPLOYEE_IMAGES = [
  "photo-1488590528505-98d2b5aba04b",
  "photo-1518770660439-4636190af475",
  "photo-1461749280684-dccba630e2f6",
  "photo-1486312338219-ce68d2c6f44d"
];

interface Employee {
  name: string;
  role: string;
  department: string;
  skillCount: number;
  benchmark: number;
  lastUpdated: string;
}

const employees: Employee[] = [
  {
    name: "Victor Smith",
    role: "AI Engineer: P4",
    department: "Engineering",
    skillCount: 16,
    benchmark: 89,
    lastUpdated: "10/20/24"
  },
  {
    name: "Jennie Richards",
    role: "Backend Engineer: P4",
    department: "Engineering",
    skillCount: 12,
    benchmark: 85,
    lastUpdated: "10/20/24"
  },
  {
    name: "Anna Vyselva",
    role: "Frontend Developer: P4",
    department: "Engineering",
    skillCount: 17,
    benchmark: 74,
    lastUpdated: "10/20/24"
  },
  {
    name: "Suz Manu",
    role: "Engineering Manager: M3",
    department: "Engineering",
    skillCount: 11,
    benchmark: 68,
    lastUpdated: "10/20/24"
  }
];

export const EmployeeTable = () => {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-background text-left border-b border-border">
            <th className="py-4 px-4 text-sm font-medium text-muted-foreground w-[4%]">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="py-4 px-4 text-sm font-medium text-muted-foreground w-[25%]">
              <div className="flex items-center gap-1">
                Employee Name <ChevronDown className="h-4 w-4" />
              </div>
            </th>
            <th className="py-4 px-4 text-sm font-medium text-muted-foreground w-[20%]">Current Role</th>
            <th className="py-4 px-4 text-sm font-medium text-muted-foreground w-[15%]">Department</th>
            <th className="py-4 px-4 text-sm font-medium text-muted-foreground text-center w-[12%]">Skill Count</th>
            <th className="py-4 px-4 text-sm font-medium text-muted-foreground text-center w-[12%]">Benchmark</th>
            <th className="py-4 px-4 text-sm font-medium text-muted-foreground text-right w-[12%]">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.name} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://images.unsplash.com/${EMPLOYEE_IMAGES[index]}?auto=format&fit=crop&w=32&h=32`}
                    alt={employee.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <Link to="/employee-profile" className="text-primary hover:underline font-medium">
                    {employee.name}
                  </Link>
                </div>
              </td>
              <td className="py-3 px-4 font-medium">{employee.role}</td>
              <td className="py-3 px-4">{employee.department}</td>
              <td className="py-3 px-4 text-center">{employee.skillCount}</td>
              <td className="py-3 px-4">
                <div className="flex justify-center">
                  <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                    employee.benchmark >= 80 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {employee.benchmark}%
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-muted-foreground">
                {employee.lastUpdated}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};