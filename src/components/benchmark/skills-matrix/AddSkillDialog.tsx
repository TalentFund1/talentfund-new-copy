import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { skills } from "@/components/skills/data/skillsData";
import { ComboboxDemo } from "./SkillCombobox";

interface AddSkillDialogProps {
  onSkillAdd: (skill: { title: string; subcategory: string; level: string; growth: string; confidence: string; }) => void;
}

export const AddSkillDialog = ({ onSkillAdd }: AddSkillDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [level, setLevel] = useState("unspecified");
  const [skillType, setSkillType] = useState("unknown");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkill) {
      toast({
        title: "Error",
        description: "Please select a skill",
        variant: "destructive",
      });
      return;
    }

    const skillData = skills.find(s => s.title === selectedSkill);
    
    if (!skillData) {
      toast({
        title: "Error",
        description: "Selected skill not found in database",
        variant: "destructive",
      });
      return;
    }

    onSkillAdd({
      title: selectedSkill,
      subcategory: skillData.subcategory,
      level,
      growth: "0%",
      confidence: skillType
    });

    toast({
      title: "Success",
      description: "Skill added successfully",
    });

    setOpen(false);
    setSelectedSkill("");
    setLevel("unspecified");
    setSkillType("unknown");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Skill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Skill</DialogTitle>
          <DialogDescription className="text-gray-500">
            Add a new skill to your skills matrix. Select from available skills.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium">Initial Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unspecified">Unspecified</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Skill Name</Label>
              <ComboboxDemo 
                skills={skills.map(s => s.title)}
                selected={selectedSkill}
                onSelect={setSelectedSkill}
              />
            </div>

            {selectedSkill && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Subcategory</Label>
                <Input
                  value={skills.find(s => s.title === selectedSkill)?.subcategory || ""}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="skillType" className="text-sm font-medium">Skill Type</Label>
              <Select value={skillType} onValueChange={setSkillType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Unknown</SelectItem>
                  <SelectItem value="skill goal">Skill Goal</SelectItem>
                  <SelectItem value="not interested">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90">Add Skill</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};