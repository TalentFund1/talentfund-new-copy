import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Zap, PieChart, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Task {
  id: string;
  title: string;
  aiPotential: boolean;
  percentage: number;
}

const tasks: Task[] = [
  { id: "1", title: "Conducting detailed financial analysis for decision-making", aiPotential: true, percentage: 5 },
  { id: "2", title: "Leading financial forecasting initiatives for the company", aiPotential: true, percentage: 8 },
  { id: "3", title: "Creating complex financial models to predict outcomes", aiPotential: false, percentage: 4 },
  { id: "4", title: "Developing comprehensive corporate budgeting reports", aiPotential: false, percentage: 3 },
  { id: "5", title: "Evaluating the company's financial performance trends", aiPotential: true, percentage: 6 }
];

export const TasksList = () => {
  console.log('Rendering TasksList component');

  return (
    <Card className="p-6 space-y-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-primary">Tasks</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center text-xs text-gray-600">?</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tasks associated with this role</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-1.5 py-1.5 h-8 text-sm rounded-md">
          <Plus className="h-3.5 w-3.5" /> Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="flex items-center justify-between py-3 px-4 border border-border rounded-lg hover:bg-background/80 transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground leading-tight">{task.title}</p>
            </div>
            <div className="flex items-center gap-3">
              {task.aiPotential && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="bg-white p-1.5 rounded-md shadow-sm">
                        <Zap className="h-3.5 w-3.5 text-[#8073ec]" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI Potential</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md shadow-sm">
                <PieChart className="h-3.5 w-3.5 text-[#8073ec]" />
                <span className="text-xs font-medium text-[#8073ec]">{task.percentage}%</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background shadow-sm rounded-md">
                <Pencil className="h-3.5 w-3.5 text-[#8073ec]" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};