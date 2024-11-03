import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { SkillsTable } from "@/components/SkillsTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const EmployeeProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 space-y-6 p-6 ml-16 transition-all duration-300">
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

      <Card className="p-6 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <Avatar className="h-24 w-24">
              <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=96&h=96" alt="Kate Smith" />
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Kate Smith</h1>
                <span className="text-sm text-muted-foreground">Employee ID: 123</span>
              </div>
              <h2 className="text-lg">Senior Frontend Engineer: P4</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Toronto, ON</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white">Export</Button>
            <Button>Edit</Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-4 gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Department</span>
            <p className="font-medium">Engineering</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Office</span>
            <p className="font-medium">Toronto</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Category</span>
            <p className="font-medium">Full-time</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Start Date</span>
            <p className="font-medium">2024-01-01</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Term Date</span>
            <p className="font-medium">-</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Tenure (Years)</span>
            <p className="font-medium">1.9</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="experience" className="w-full space-y-4">
        <TabsList className="w-full flex h-12 items-center justify-start space-x-6 border-b bg-transparent p-0">
          <TabsTrigger 
            value="experience" 
            className="border-b-2 border-transparent px-3 pb-4 pt-2 data-[state=active]:border-[#8073ec] data-[state=active]:text-primary font-medium"
          >
            Skills Summary
          </TabsTrigger>
          <TabsTrigger 
            value="benchmark"
            className="border-b-2 border-transparent px-3 pb-4 pt-2 data-[state=active]:border-[#8073ec] data-[state=active]:text-primary font-medium"
          >
            Role Benchmark
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="space-y-4">

          <Card className="p-6 bg-white">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Search Skills..."
                className="max-w-full bg-white rounded-full border-input"
              />

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-lg px-3 py-1.5 border-2 flex items-center gap-2">
                  Python <span className="text-xs">×</span>
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-foreground">Skills Summary</h3>
                  <Badge variant="outline" className="bg-background text-primary rounded-full">66</Badge>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Specialized Skills</span>
                        <Badge className="bg-primary-accent/10 text-primary-accent rounded-full">66</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["React", "JavaScript", "Git", "GraphQL", "HTML and CSS3"].map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="outline" 
                          className="rounded-full px-4 py-2 border border-border/50 flex items-center gap-2 bg-white hover:bg-background/80 transition-colors"
                        >
                          {skill} <div className="h-2 w-2 rounded-full bg-primary-accent" />
                        </Badge>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full px-4 py-2 border border-border/50 bg-background/50 hover:bg-background text-primary-accent"
                      >
                        See More 12
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Common Skills</span>
                        <Badge className="bg-primary-accent/10 text-primary-accent rounded-full">14</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {["UI/UX Design Principles", "Communication", "Microsoft Excel"].map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="outline" 
                          className="rounded-full px-4 py-2 border border-border/50 bg-white hover:bg-background/80 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Certifications</span>
                        <Badge className="bg-primary-accent/10 text-primary-accent rounded-full">1</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Badge 
                        variant="outline" 
                        className="rounded-full px-4 py-2 border border-border/50 bg-white hover:bg-background/80 transition-colors"
                      >
                        Cybersecurity License
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <SkillsTable />
        </TabsContent>

        <TabsContent value="benchmark">
          <Card className="p-6 bg-white">
            <p>Role Benchmark content here</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;

