import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillsMatrixTableHeaderProps {
  showCompanySkill?: boolean;
  isRoleBenchmark?: boolean;
}

export const SkillsMatrixTableHeader = ({ 
  showCompanySkill = true,
  isRoleBenchmark = false
}: SkillsMatrixTableHeaderProps) => {
  console.log('SkillsMatrixTableHeader rendering with:', {
    showCompanySkill,
    isRoleBenchmark
  });

  return (
    <TableHeader>
      <TableRow className="bg-[#F7F9FF] border-b border-[#CCDBFF]">
        <TableHead className="w-[250px] border-r border-[#CCDBFF] py-3 font-medium">Skill Title</TableHead>
        <TableHead className="w-[200px] border-r border-[#CCDBFF] py-3 font-medium">Subcategory</TableHead>
        {showCompanySkill && (
          <TableHead className="w-[120px] text-center border-r border-[#CCDBFF] py-3 font-medium">Company Skill</TableHead>
        )}
        <TableHead className="w-[150px] text-center border-r border-[#CCDBFF] py-3 font-medium">Employee Skills</TableHead>
        <TableHead className="w-[120px] text-center border-r border-[#CCDBFF] py-3 font-medium">
          <div className="flex items-center justify-center gap-1">
            Skill Score
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-[300px] p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-left">Confidence Score:</h4>
                    <p className="text-sm text-left font-normal">
                      Indicates the level of confidence in the skill assessment based on available data and validation
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableHead>
        <TableHead className="w-[120px] text-center border-r border-[#CCDBFF] py-3 font-medium">
          <div className="flex items-center justify-center gap-1">
            Projected Growth
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-[300px] p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-left">Projected Growth:</h4>
                    <p className="text-sm text-left font-normal">
                      Projected growth in demand for this skill over the next year
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableHead>
        <TableHead className="w-[120px] text-center border-r border-[#CCDBFF] py-3 font-medium">
          <div className="flex items-center justify-center gap-1">
            Skill Pricer
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-[300px] p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-left">Skill Pricer:</h4>
                    <p className="text-sm text-left font-normal">
                      Reflects the market value impact of this skill based on current industry data
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableHead>
        {isRoleBenchmark && (
          <TableHead className="w-[120px] text-center border-r border-[#CCDBFF] py-3 font-medium">
            <div className="flex items-center justify-center gap-1">
              Skill Growth
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="max-w-[300px] p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-left">Skill Growth:</h4>
                      <p className="text-sm text-left font-normal">
                        Add this skill to your growth plan
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableHead>
        )}
        <TableHead className="w-[100px] text-center py-3 font-medium">
          <div className="flex items-center justify-center gap-1">
            Appears In
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-[300px] p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-left">Appears In:</h4>
                    <p className="text-sm text-left font-normal">
                      Shows where this skill appears in different contexts
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};