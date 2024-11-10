import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface Skill {
  name: string;
  level: "advanced" | "intermediate" | "beginner" | "unspecified";
}

const requiredSkills: Skill[] = [
  { name: "React", level: "advanced" as const },
  { name: "JavaScript", level: "advanced" as const },
  { name: "GraphQL", level: "intermediate" as const },
  { name: "HTML and CSS3", level: "advanced" as const },
  { name: "IPA Integrations", level: "intermediate" as const }
].sort((a, b) => {
  const levelOrder = {
    advanced: 0,
    intermediate: 1,
    beginner: 2,
    unspecified: 3
  };
  return levelOrder[a.level] - levelOrder[b.level];
});

const preferredSkills: Skill[] = [
  { name: "UI/UX Design Principles", level: "intermediate" as const },
  { name: "Communication", level: "intermediate" as const },
  { name: "Angular", level: "beginner" as const }
].sort((a, b) => {
  const levelOrder = {
    advanced: 0,
    intermediate: 1,
    beginner: 2,
    unspecified: 3
  };
  return levelOrder[a.level] - levelOrder[b.level];
});

const certifications = [
  { name: "Cybersecurity License" }
];

const roleProfiles = {
  "ai-engineer": {
    p1: { id: "123", title: "AI Engineer: P1" },
    p2: { id: "123", title: "AI Engineer: P2" },
    p3: { id: "123", title: "AI Engineer: P3" },
    p4: { id: "123", title: "AI Engineer: P4" },
    p5: { id: "123", title: "AI Engineer: P5" },
    m1: { id: "123", title: "AI Engineering Manager: M1" },
    m2: { id: "123", title: "AI Engineering Manager: M2" },
    m3: { id: "123", title: "AI Engineering Manager: M3" }
  },
  "backend-engineer": {
    p1: { id: "124", title: "Backend Engineer: P1" },
    p2: { id: "124", title: "Backend Engineer: P2" },
    p3: { id: "124", title: "Backend Engineer: P3" },
    p4: { id: "124", title: "Backend Engineer: P4" },
    p5: { id: "124", title: "Backend Engineer: P5" },
    m1: { id: "124", title: "Backend Engineering Manager: M1" },
    m2: { id: "124", title: "Backend Engineering Manager: M2" },
    m3: { id: "124", title: "Backend Engineering Manager: M3" }
  },
  "frontend-developer": {
    p1: { id: "125", title: "Frontend Developer: P1" },
    p2: { id: "125", title: "Frontend Developer: P2" },
    p3: { id: "125", title: "Frontend Developer: P3" },
    p4: { id: "125", title: "Frontend Developer: P4" },
    p5: { id: "125", title: "Frontend Developer: P5" },
    m1: { id: "125", title: "Frontend Engineering Manager: M1" },
    m2: { id: "125", title: "Frontend Engineering Manager: M2" },
    m3: { id: "125", title: "Frontend Engineering Manager: M3" }
  }
};

export const RoleBenchmark = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("ai-engineer-p4");

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    const [role, level] = value.split("-");
    const profileId = roleProfiles[role as keyof typeof roleProfiles][level].id;
    navigate(`/skills/${profileId}`);
  };

  const getLevelStyles = (level: string) => {
    return "border-[#CCDBFF]";
  };

  const getLevelDot = (level: string) => {
    switch (level) {
      case "advanced":
        return "bg-primary-accent";
      case "intermediate":
        return "bg-primary-icon";
      case "beginner":
        return "bg-[#008000]";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Role Benchmark</h3>
          <Button 
            variant="outline" 
            className="bg-[#F7F9FF] text-[#1F2144] hover:bg-[#F7F9FF]/90 border border-[#CCDBFF]"
            onClick={() => navigate('/skills')}
          >
            See Skill Profile
          </Button>
        </div>
        
        <div className="w-full max-w-[800px]">
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai-engineer-p1">AI Engineer: P1</SelectItem>
              <SelectItem value="ai-engineer-p2">AI Engineer: P2</SelectItem>
              <SelectItem value="ai-engineer-p3">AI Engineer: P3</SelectItem>
              <SelectItem value="ai-engineer-p4">AI Engineer: P4</SelectItem>
              <SelectItem value="ai-engineer-p5">AI Engineer: P5</SelectItem>
              <SelectItem value="ai-engineer-m1">AI Engineering Manager: M1</SelectItem>
              <SelectItem value="ai-engineer-m2">AI Engineering Manager: M2</SelectItem>
              <SelectItem value="ai-engineer-m3">AI Engineering Manager: M3</SelectItem>
              
              <SelectItem value="backend-engineer-p1">Backend Engineer: P1</SelectItem>
              <SelectItem value="backend-engineer-p2">Backend Engineer: P2</SelectItem>
              <SelectItem value="backend-engineer-p3">Backend Engineer: P3</SelectItem>
              <SelectItem value="backend-engineer-p4">Backend Engineer: P4</SelectItem>
              <SelectItem value="backend-engineer-p5">Backend Engineer: P5</SelectItem>
              <SelectItem value="backend-engineer-m1">Backend Engineering Manager: M1</SelectItem>
              <SelectItem value="backend-engineer-m2">Backend Engineering Manager: M2</SelectItem>
              <SelectItem value="backend-engineer-m3">Backend Engineering Manager: M3</SelectItem>
              
              <SelectItem value="frontend-developer-p1">Frontend Developer: P1</SelectItem>
              <SelectItem value="frontend-developer-p2">Frontend Developer: P2</SelectItem>
              <SelectItem value="frontend-developer-p3">Frontend Developer: P3</SelectItem>
              <SelectItem value="frontend-developer-p4">Frontend Developer: P4</SelectItem>
              <SelectItem value="frontend-developer-p5">Frontend Developer: P5</SelectItem>
              <SelectItem value="frontend-developer-m1">Frontend Engineering Manager: M1</SelectItem>
              <SelectItem value="frontend-developer-m2">Frontend Engineering Manager: M2</SelectItem>
              <SelectItem value="frontend-developer-m3">Frontend Engineering Manager: M3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Required Skills</span>
              <span className="bg-[#8073ec]/10 text-[#1F2144] rounded-full px-2 py-0.5 text-xs font-medium">
                {requiredSkills.length}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill) => (
              <Badge 
                key={skill.name} 
                variant="outline" 
                className={`rounded-md px-4 py-2 border-2 flex items-center gap-2 bg-white hover:bg-background/80 transition-colors ${getLevelStyles(skill.level)}`}
              >
                {skill.name} <div className={`h-2 w-2 rounded-full ${getLevelDot(skill.level)}`} />
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Preferred Skills</span>
              <span className="bg-[#8073ec]/10 text-[#1F2144] rounded-full px-2 py-0.5 text-xs font-medium">
                {preferredSkills.length}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferredSkills.map((skill) => (
              <Badge 
                key={skill.name} 
                variant="outline" 
                className={`rounded-md px-4 py-2 border-2 flex items-center gap-2 bg-white hover:bg-background/80 transition-colors ${getLevelStyles(skill.level)}`}
              >
                {skill.name} <div className={`h-2 w-2 rounded-full ${getLevelDot(skill.level)}`} />
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Certifications</span>
              <span className="bg-[#8073ec]/10 text-[#1F2144] rounded-full px-2 py-0.5 text-xs font-medium">
                {certifications.length}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <Badge 
                key={cert.name}
                variant="outline" 
                className="rounded-md px-4 py-2 border border-border bg-white"
              >
                {cert.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
