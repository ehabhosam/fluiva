import { Task } from "@/components/OverwhelmOrganizer/TaskCard";
import {
  TaskInput,
  GeneratePlanRequest,
  PlanType,
  Priority
} from "@/api/types";
import { getUnitsFromPlanType } from "@/lib/utils";

/**
 * Maps an OverwhelmOrganizer Task to API-compatible TaskInput format
 */
export function mapTaskToTaskInput(task: Task): TaskInput {
  return {
    title: task.text,
    description: `Task from Overwhelm Organizer - ${task.hours} hour${task.hours !== 1 ? 's' : ''} estimated`,
    requiredTime: task.hours,
    priority: Priority.NORMAL, // Default priority for overwhelm tasks
    isBreakable: task.hours > 2, // Tasks longer than 2 hours are breakable
  };
}

/**
 * Maps multiple OverwhelmOrganizer Tasks to TaskInput array
 */
export function mapTasksToTaskInputs(tasks: Task[]): TaskInput[] {
  return tasks.map(mapTaskToTaskInput);
}

/**
 * Creates a GeneratePlanRequest payload for overwhelm organizer tasks
 */
export function createOverwhelmPlanRequest(
  tasks: Task[],
  nBlocks: number,
  nPeriods: number,
  title?: string,
  description?: string
): GeneratePlanRequest {
  const planType = PlanType.DAILY;
  const [buildUnit, periodUnit] = getUnitsFromPlanType(planType);

  const defaultTitle = "Overwhelm Handled";
  const defaultDescription = `Daily plan created from ${tasks.length} overwhelm task${tasks.length !== 1 ? 's' : ''} to help organize your day`;

  return {
    title: title || defaultTitle,
    description: description || defaultDescription,
    type: planType,
    buildUnit,
    periodUnit,
    nPeriods,
    nBlocks,
    tasks: mapTasksToTaskInputs(tasks),
    routines: [], // No routines from overwhelm organizer
  };
}

/**
 * Calculates total time from overwhelm tasks
 */
export function calculateTotalTime(tasks: Task[]): number {
  return tasks.reduce((total, task) => total + task.hours, 0);
}

/**
 * Calculates automatic time constraints for "finish today" option
 * Returns 1 period and total hours as blocks
 */
export function calculateFinishTodayConstraints(tasks: Task[]): { nBlocks: number; nPeriods: number } {
  const totalHours = calculateTotalTime(tasks);
  return {
    nBlocks: totalHours,
    nPeriods: 1,
  };
}

/**
 * Gets default plan title and description
 */
export function getDefaultPlanInfo(tasks: Task[]): { title: string; description: string } {
  return {
    title: "Overwhelm Handled",
    description: `Daily plan created from ${tasks.length} overwhelm task${tasks.length !== 1 ? 's' : ''} to help organize your day`,
  };
}