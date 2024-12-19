import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoleLevelFieldsProps {
  formData: {
    role: string;
    level: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export const roleMapping = {
  "AI Engineer": "123",
  "Backend Engineer": "124",
  "Frontend Engineer": "125",
  "Engineering Manager": "126",
  "DevOps Engineer": "127"
};

export const RoleLevelFields = ({ formData, handleInputChange }: RoleLevelFieldsProps) => {
  console.log('RoleLevelFields rendering with:', {
    currentRole: formData.role,
    currentLevel: formData.level
  });

  const isManagerialRole = formData.role.toLowerCase().includes('manager');

  const professionalLevels = {
    'P1': 'P1 - Entry',
    'P2': 'P2 - Developing',
    'P3': 'P3 - Career',
    'P4': 'P4 - Senior',
    'P5': 'P5 - Expert',
    'P6': 'P6 - Principal'
  };

  const managerialLevels = {
    'M3': 'M3 - Manager',
    'M4': 'M4 - Senior Manager',
    'M5': 'M5 - Director',
    'M6': 'M6 - Senior Director'
  };

  const levelOptions = isManagerialRole ? managerialLevels : professionalLevels;

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <Select 
          value={formData.role} 
          onValueChange={(value) => {
            console.log('Role selected:', value, 'Role ID:', roleMapping[value as keyof typeof roleMapping]);
            handleInputChange('role', value);
            // Reset level when role changes
            handleInputChange('level', '');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AI Engineer">AI Engineer</SelectItem>
            <SelectItem value="Backend Engineer">Backend Engineer</SelectItem>
            <SelectItem value="Frontend Engineer">Frontend Engineer</SelectItem>
            <SelectItem value="Engineering Manager">Engineering Manager</SelectItem>
            <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Level</label>
        <Select 
          value={formData.level} 
          onValueChange={(value) => {
            console.log('Level selected:', value);
            handleInputChange('level', value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(levelOptions).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};