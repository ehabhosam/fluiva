import { useCallback, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Task } from "../TaskCard";
import { ANIMATION } from "../constants";
import {
  createTaskRectangle,
  rectanglesOverlap,
  calculateOverlap,
  calculatePushDirection,
  keepWithinBounds,
  updateTaskZIndex,
  findTaskById,
} from "../utils";

export function useTaskDragging(
  tasks: Task[],
  updateTask: (id: string, updates: Partial<Task>) => void,
  updateTasks: (tasks: Task[]) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const dragPositionRef = useRef<{ [key: string]: { x: number; y: number } }>({});

  const handleDragStart = (taskId: string) => {
    setIsDragging(true);
    setCurrentTask(taskId);

    // Bring the dragged task to the front
    const updatedTasks = updateTaskZIndex(tasks, taskId);
    updateTasks(updatedTasks);
  };

  const debouncedUpdatePosition = useDebouncedCallback(
    (taskId: string, position: { x: number; y: number }) => {
      if (taskId !== currentTask) {
        updateTask(taskId, { position });
      }
    },
    ANIMATION.DEBOUNCE_TIME,
    { maxWait: ANIMATION.MAX_DEBOUNCE_WAIT }
  );

  const handleDrag = (taskId: string, x: number, y: number) => {
    if (taskId === currentTask) {
      // For currently dragged card, immediately update position without state change
      dragPositionRef.current[taskId] = { x, y };
    } else {
      // For other cards (pushed by collision), use debounced updates
      dragPositionRef.current[taskId] = { x, y };
      debouncedUpdatePosition(taskId, { x, y });
    }

    // Only check for collisions periodically (debounced)
    debouncedHandleCollisions(taskId);
  };

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);

    // If there's a current task, ensure its final position is updated in state
    if (currentTask && dragPositionRef.current[currentTask]) {
      const position = dragPositionRef.current[currentTask];

      // Update state immediately on drag end
      updateTask(currentTask, { position });

      // Clean up
      delete dragPositionRef.current[currentTask];
    }

    setCurrentTask(null);
  }, [currentTask, updateTask]);

  // Debounced collision handler to prevent excessive calculations
  const debouncedHandleCollisions = useDebouncedCallback(
    (taskId: string) => handleCollisions(taskId),
    ANIMATION.COLLISION_DEBOUNCE
  );

  // Function to handle collisions between tasks
  const handleCollisions = (taskId: string, containerRef?: React.RefObject<HTMLDivElement>) => {
    if (!containerRef?.current) return;

    const currentTaskObj = findTaskById(tasks, taskId);
    if (!currentTaskObj) return;

    // Use the current position from the ref if available (for smoother updates)
    const currentPosition = dragPositionRef.current[taskId] || currentTaskObj.position;
    const currentRect = createTaskRectangle(currentPosition);

    // Check collision with each other task
    tasks.forEach((otherTask) => {
      if (otherTask.id === taskId) return;

      const otherRect = createTaskRectangle(otherTask.position);

      // Check if tasks overlap
      if (rectanglesOverlap(currentRect, otherRect)) {
        const overlap = calculateOverlap(currentRect, otherRect);
        const newPosition = calculatePushDirection(currentRect, otherRect, overlap);

        // Keep the task within container bounds
        const containerRect = containerRef.current!.getBoundingClientRect();
        const boundedPosition = keepWithinBounds(newPosition, containerRect);

        // Store the updated position in the ref and update state in a debounced manner
        dragPositionRef.current[otherTask.id] = boundedPosition;
        debouncedUpdatePosition(otherTask.id, boundedPosition);
      }
    });
  };

  return {
    isDragging,
    currentTask,
    dragPositionRef,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleCollisions,
  };
}
