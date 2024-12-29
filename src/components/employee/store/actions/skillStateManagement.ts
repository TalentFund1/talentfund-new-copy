import { EmployeeSkillState, SkillLevel, SkillGoalStatus, SkillConfidence } from '../../types/employeeSkillTypes';

export const createSkillState = (
  level: SkillLevel = 'unspecified',
  goalStatus: SkillGoalStatus = 'unknown'
): EmployeeSkillState => ({
  level,
  goalStatus,
  lastUpdated: new Date().toISOString(),
  skillScore: 0,
  confidence: 'medium'
});

export const updateSkillState = (
  currentState: EmployeeSkillState,
  updates: Partial<EmployeeSkillState>
): EmployeeSkillState => ({
  ...currentState,
  ...updates,
  lastUpdated: new Date().toISOString()
});