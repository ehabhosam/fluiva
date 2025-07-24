import { useState } from "react";
import { nanoid } from "nanoid";
import { Task } from "../TaskCard";
import { DEFAULTS, ANIMATION } from "../constants";
import {
  getRandomColor,
  calculateInitialPosition,
  calculateRandomPosition,
} from "../utils";

export function useTaskInput(
  tasks: Task[],
  addTask: (task: Task) => void,
  updateTask: (id: string, updates: Partial<Task>) => void
) {
  const [taskText, setTaskText] = useState<string>(DEFAULTS.TASK_TEXT);
  const [taskHours, setTaskHours] = useState<number>(DEFAULTS.TASK_HOURS);

  const handleAddTask = (
    containerRef: React.RefObject<HTMLDivElement>,
    inputRef: React.RefObject<HTMLDivElement>
  ) => {
    if (
      !taskText.trim() ||
      taskHours <= 0 ||
      !containerRef.current ||
      !inputRef.current
    ) {
      return;
    }

    // Get the container and input positions
    const containerRect = containerRef.current.getBoundingClientRect();
    const inputRect = inputRef.current.getBoundingClientRect();

    // Calculate initial position relative to the input
    const initialPosition = calculateInitialPosition(containerRect, inputRect);

    // Calculate a random final position in the container
    const finalPosition = calculateRandomPosition(containerRect);

    const newTask: Task = {
      id: nanoid(),
      text: taskText,
      hours: taskHours,
      position: finalPosition,
      zIndex: tasks.length + 1,
      color: getRandomColor(),
    };

    // Add task with initial position for animation
    addTask({ ...newTask, position: initialPosition });

    // Animate the task to its final position after a short delay
    setTimeout(() => {
      updateTask(newTask.id, { position: finalPosition });
    }, ANIMATION.TASK_SPAWN_DELAY);

    // Reset input
    setTaskText(DEFAULTS.TASK_TEXT);
    setTaskHours(DEFAULTS.TASK_HOURS);
  };

  return {
    taskText,
    taskHours,
    setTaskText,
    setTaskHours,
    handleAddTask,
  };
}
