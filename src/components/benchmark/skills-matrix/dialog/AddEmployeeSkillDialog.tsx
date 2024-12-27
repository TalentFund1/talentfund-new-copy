import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SearchFilter } from "@/components/market/SearchFilter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from 'react-router-dom';
import { useToggledSkills } from "@/components/skills/context/ToggledSkillsContext";
import { useCompetencyStore } from "@/components/skills/competency/CompetencyState";
import { getUnifiedSkillData } from '@/components/skills/data/skillDatabaseService';
import { getAllSkills } from '@/components/skills/data/skills/allSkills';
import { roleSkills, saveRoleSkills } from '@/components/skills/data/roleSkills';
import { normalizeSkillTitle } from '@/components/skills/utils/normalization';
import { generateSkillProgression } from '@/components/skills/competency/autoFillUtils';
import { useTrack } from "@/components/skills/context/TrackContext";
import { useEmployeeSkillsStore } from "@/components/employee/store/employeeSkillsStore";

export const AddEmployeeSkillDialog = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { toggledSkills, setToggledSkills } = useToggledSkills();
  const { setSkillState, setSkillProgression } = useCompetencyStore();
  const { getTrackForRole } = useTrack();
  const { addSkill, getEmployeeSkills, initializeEmployeeSkills } = useEmployeeSkillsStore();
  const [skillsUpdated, setSkillsUpdated] = useState(false);

  // Get all available skills from universal database
  const universalSkills = getAllSkills();
  const allSkills = Array.from(new Set(
    universalSkills.map(s => normalizeSkillTitle(s.title))
  ));

  // Force re-initialization when skills are updated
  useEffect(() => {
    if (skillsUpdated && id) {
      console.log('Re-initializing skills after update for employee:', id);
      
      const updateSkills = async () => {
        await initializeEmployeeSkills(id);
        // Force a re-render by creating a new Set with current skills
        setToggledSkills(new Set(toggledSkills));
        setSkillsUpdated(false);
      };

      updateSkills();
    }
  }, [skillsUpdated, id, initializeEmployeeSkills, setToggledSkills]);

  console.log('Available skills for selection:', {
    totalSkills: allSkills.length,
    sampleSkills: allSkills.slice(0, 5),
    roleId: id
  });

  const handleAddSkills = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Could not find the current role profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get existing role skills or initialize if not exists
      const existingRoleSkills = roleSkills[id] || {
        title: "",
        specialized: [],
        common: [],
        certifications: [],
        skills: []
      };

      console.log('Current role skills before adding:', {
        roleId: id,
        specialized: existingRoleSkills.specialized.length,
        common: existingRoleSkills.common.length,
        certifications: existingRoleSkills.certifications.length
      });

      const track = getTrackForRole(id);
      const newToggledSkills = new Set(toggledSkills);
      const updatedRoleSkills = { ...existingRoleSkills };

      // Process each selected skill
      for (const skillTitle of selectedSkills) {
        const normalizedTitle = normalizeSkillTitle(skillTitle);
        console.log('Processing skill:', skillTitle);
        const skillData = getUnifiedSkillData(skillTitle);
        
        if (skillData) {
          console.log('Adding skill:', skillData);
          
          // Add to toggled skills
          newToggledSkills.add(skillTitle);
          
          // Add skill to employee skills store
          await addSkill(id, skillTitle);
          
          // Determine category and add to appropriate array if not already present
          const category = skillData.category?.toLowerCase() || 'common';
          
          if (category === 'specialized' && !updatedRoleSkills.specialized.some(s => normalizeSkillTitle(s.title) === normalizedTitle)) {
            updatedRoleSkills.specialized.push(skillData);
          } else if (category === 'common' && !updatedRoleSkills.common.some(s => normalizeSkillTitle(s.title) === normalizedTitle)) {
            updatedRoleSkills.common.push(skillData);
          } else if (category === 'certification' && !updatedRoleSkills.certifications.some(s => normalizeSkillTitle(s.title) === normalizedTitle)) {
            updatedRoleSkills.certifications.push(skillData);
          }

          // Generate and set progression
          const progression = generateSkillProgression(skillTitle, category, track, id);
          if (progression) {
            console.log('Generated progression for skill:', {
              skill: skillTitle,
              progression
            });
            setSkillProgression(skillTitle, progression, id);
          }
        } else {
          console.warn('Skill not found in universal database:', skillTitle);
        }
      }

      // Save updated skills
      console.log('Saving updated role skills:', {
        roleId: id,
        specialized: updatedRoleSkills.specialized.length,
        common: updatedRoleSkills.common.length,
        certifications: updatedRoleSkills.certifications.length
      });

      roleSkills[id] = updatedRoleSkills;
      saveRoleSkills(id, updatedRoleSkills);
      
      // Update toggled skills and trigger re-render
      setToggledSkills(newToggledSkills);
      setSkillsUpdated(true);

      toast({
        title: "Skills Added",
        description: `Added ${selectedSkills.length} skill${selectedSkills.length === 1 ? '' : 's'} to the profile.`,
      });

      setSelectedSkills([]);
      setOpen(false);
    } catch (error) {
      console.error('Error adding skills:', error);
      toast({
        title: "Error",
        description: "Failed to add skills. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-[#1F2144] hover:bg-[#1F2144]/90 text-white rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
            <Plus className="h-3 w-3 stroke-[2]" />
          </div>
          <span className="text-sm font-medium">Add Skill</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Skills to Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <SearchFilter
            label=""
            placeholder="Search skills..."
            items={allSkills}
            selectedItems={selectedSkills}
            onItemsChange={setSelectedSkills}
            singleSelect={false}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSkills([]);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSkills}
              disabled={selectedSkills.length === 0}
            >
              Add Selected Skills
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
