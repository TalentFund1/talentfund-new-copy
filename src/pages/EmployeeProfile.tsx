import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { SkillsSummary } from "@/components/skills/SkillsSummary";
import { RoleBenchmark } from "@/components/benchmark/RoleBenchmark";
import { BenchmarkAnalysis } from "@/components/benchmark/BenchmarkAnalysis";
import { SkillsMatrix } from "@/components/benchmark/SkillsMatrix";
import { Sidebar } from "@/components/Sidebar";
import { SelectedSkillsProvider } from "@/components/skills/context/SelectedSkillsContext";

// Mock data - in a real app this would come from an API
const employeeData = {
  "123": {
    name: "Anna Vyselva",
    role: "Frontend Developer: P4",
    location: "Toronto, ON",
    department: "Engineering",
    office: "Toronto",
    category: "Full-time",
    manager: "Sarah Chen",
    startDate: "2024-01-01",
    termDate: "-",
    tenure: "1.9",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=96&h=96"
  }
};

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const employee = employeeData[id as keyof typeof employeeData];

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6 ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          <SelectedSkillsProvider>
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white border-border hover:bg-background"
                onClick={() => navigate('/employees')}
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <div className="flex items-center gap-2 bg-white rounded-lg border border-border px-3 py-1.5">
                <ChevronLeft className="h-4 w-4 text-foreground cursor-pointer hover:text-primary-accent" />
                <span className="text-sm text-foreground">2/7</span>
                <ChevronRight className="h-4 w-4 text-foreground cursor-pointer hover:text-primary-accent" />
              </div>
            </div>

            <Card className="p-8 bg-white">
              <div className="flex items-start justify-between mb-8">
                <div className="flex gap-8">
                  <Avatar className="h-28 w-28 rounded-full border-4 border-border">
                    <img 
                      src={employee.imageUrl}
                      alt={employee.name}
                      className="object-cover"
                    />
                  </Avatar>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-foreground">{employee.name}</h1>
                        <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded">ID: {id}</span>
                      </div>
                      <h2 className="text-lg font-medium text-foreground/90">{employee.role}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{employee.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="bg-white">Export</Button>
                  <Button>Edit</Button>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="grid grid-cols-4 gap-8">
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <p className="font-medium">{employee.department}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Office</span>
                  <p className="font-medium">{employee.office}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <p className="font-medium">{employee.category}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Manager</span>
                  <p className="font-medium">{employee.manager}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <p className="font-medium">{employee.startDate}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Term Date</span>
                  <p className="font-medium">{employee.termDate}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Tenure (Years)</span>
                  <p className="font-medium">{employee.tenure}</p>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="experience" className="w-full space-y-6">
              <TabsList className="w-full flex h-12 items-center justify-start space-x-6 border-b bg-transparent p-0">
                <TabsTrigger 
                  value="experience" 
                  className="border-b-2 border-transparent px-3 pb-4 pt-2 data-[state=active]:border-primary-accent data-[state=active]:text-primary font-medium"
                >
                  Skills Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="benchmark"
                  className="border-b-2 border-transparent px-3 pb-4 pt-2 data-[state=active]:border-primary-accent data-[state=active]:text-primary font-medium"
                >
                  Role Benchmark
                </TabsTrigger>
              </TabsList>

              <TabsContent value="experience" className="space-y-6">
                <Card className="p-8 bg-white">
                  <SkillsSummary />
                </Card>
                <SkillsMatrix />
              </TabsContent>

              <TabsContent value="benchmark" className="space-y-6">
                <Card className="p-8 bg-white">
                  <RoleBenchmark />
                </Card>
                <BenchmarkAnalysis />
                <SkillsMatrix />
              </TabsContent>
            </Tabs>
          </SelectedSkillsProvider>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;