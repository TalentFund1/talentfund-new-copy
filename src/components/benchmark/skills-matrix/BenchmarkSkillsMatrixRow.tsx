import { TableCell, TableRow } from "@/components/ui/table";
import { SkillLevelCell } from "../SkillLevelCell";
import { StaticSkillLevelCell } from "../StaticSkillLevelCell";
import { RoleSkillLevelCell } from "../RoleSkillLevelCell";
import { useSkillsMatrixStore } from "./SkillsMatrixState";
import { getUnifiedSkillData } from "../../skills/data/skillDatabaseService";
import { useParams } from "react-router-dom";

interface BenchmarkSkillsMatrixRowProps {
  skill: {
    title: string;
    subcategory: string;
    level: string;
    growth: string;
    confidence: string;
    requirement?: string;
  };
}

export const BenchmarkSkillsMatrixRow = ({ skill }: BenchmarkSkillsMatrixRowProps) => {
  const { id: employeeId } = useParams();
  const { getSkillState } = useSkillsMatrixStore();
  const unifiedSkillData = getUnifiedSkillData(skill.title);
  
  console.log('BenchmarkSkillsMatrixRow rendering:', {
    skillTitle: skill.title,
    skillId: unifiedSkillData.id,
    originalSubcategory: skill.subcategory,
    unifiedSubcategory: unifiedSkillData.subcategory,
    originalGrowth: skill.growth,
    unifiedGrowth: unifiedSkillData.growth
  });

  return (
    <TableRow className="group border-b border-gray-200">
      <TableCell className="font-medium border-r border-blue-200 py-2">{skill.title}</TableCell>
      <TableCell className="border-r border-blue-200 py-2">{unifiedSkillData.subcategory}</TableCell>
      <RoleSkillLevelCell 
        initialLevel={skill.level || 'unspecified'}
        skillTitle={skill.title}
      />
      <StaticSkillLevelCell 
        initialLevel={skill.level || 'unspecified'}
        skillTitle={skill.title}
        employeeId={employeeId || ''}
      />
      <TableCell className="text-center border-r border-blue-200 py-2">
        {skill.confidence === 'n/a' ? (
          <span className="text-gray-500 text-sm">n/a</span>
        ) : (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm ${
            skill.confidence === 'high' ? 'bg-green-100 text-green-800' :
            skill.confidence === 'medium' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {skill.confidence.charAt(0).toUpperCase() + skill.confidence.slice(1)}
          </span>
        )}
      </TableCell>
      <TableCell className="text-center border-r border-blue-200 py-2">
        <span className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-sm ${
          unifiedSkillData.growth === "0%" ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
        }`}>
          ↗ {unifiedSkillData.growth}
        </span>
      </TableCell>
      <TableCell className="text-center py-2">
        <div className="flex items-center justify-center space-x-1">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">R</span>
          <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-medium">E</span>
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-medium">M</span>
          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-medium">S</span>
        </div>
      </TableCell>
    </TableRow>
  );
};