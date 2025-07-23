import { Layout } from "@/components/Layout";
import TaskCard, { Task } from "@/components/OverwhelmOrganizer/TaskCard";
import TaskInput from "@/components/OverwhelmOrganizer/TaskInput";
import useAutoFocus from "@/hooks/use-auto-focus";
import useTasks from "@/hooks/use-tasks";
import { nanoid } from "nanoid";
import React, { useCallback, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const OverwhelmOrganizer: React.FC = () => {
  const { tasks, addTask, updateTask, updateTasks, removeTask, clearTasks } =
    useTasks();
  const [taskText, setTaskText] = React.useState("");
  const [taskHours, setTaskHours] = React.useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const dragPositionRef = useRef<{ [key: string]: { x: number; y: number } }>(
    {},
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const colors = [
    "bg-plansync-purple-100 border-plansync-purple-500 text-plansync-purple-800",
    "bg-plansync-teal-100 border-plansync-teal-500 text-plansync-teal-800",
    "bg-blue-100 border-blue-500 text-blue-800",
    "bg-amber-100 border-amber-500 text-amber-800",
    "bg-rose-100 border-rose-500 text-rose-800",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddTask = () => {
    if (
      !taskText.trim() ||
      taskHours <= 0 ||
      !containerRef.current ||
      !inputRef.current
    )
      return;

    // Get the container and input positions
    const containerRect = containerRef.current.getBoundingClientRect();
    const inputRect = inputRef.current.getBoundingClientRect();

    // Calculate initial position relative to the input
    const initialPosition = {
      x: inputRect.left - containerRect.left + inputRect.width / 2,
      y: inputRect.top - containerRect.top,
    };

    // Calculate a random final position in the container
    const randomX = Math.random() * (containerRect.width - 150);
    const randomY = Math.random() * (containerRect.height - 100);

    const newTask: Task = {
      id: nanoid(),
      text: taskText,
      hours: taskHours,
      position: { x: randomX, y: randomY },
      zIndex: tasks.length + 1,
      color: getRandomColor(),
    };

    addTask({ ...newTask, position: initialPosition });

    // Animate the task to its final position after a short delay
    setTimeout(() => {
      updateTask(newTask.id, { position: { x: randomX, y: randomY } });
    }, 10);

    // Reset input
    setTaskText("");
    setTaskHours(1);
  };

  const handleDragStart = (taskId: string) => {
    setIsDragging(true);
    setCurrentTask(taskId);

    // Bring the dragged task to the front
    const updatedTasks = tasks.map((task) => ({
      ...task,
      zIndex: task.id === taskId ? tasks.length + 1 : task.zIndex,
    }));
    updateTasks(updatedTasks);
  };

  const debouncedUpdatePosition = useDebouncedCallback(
    (taskId: string, position: { x: number; y: number }) => {
      if (taskId !== currentTask) {
        updateTask(taskId, { position });
      }
    },
    200, // 200ms debounce time - increased to reduce state updates
    { maxWait: 300 }, // maximum time to wait before updating
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
    150, // 150ms debounce time for collision detection
  );

  // Function to handle collisions between tasks
  const handleCollisions = (taskId: string) => {
    if (!containerRef.current) return;

    const currentTaskIndex = tasks.findIndex((t) => t.id === taskId);
    if (currentTaskIndex === -1) return;

    // Use the current position from the ref if available (for smoother updates)
    const currentTaskObj = {
      ...tasks[currentTaskIndex],
      position:
        dragPositionRef.current[taskId] || tasks[currentTaskIndex].position,
    };
    const currentRect = {
      left: currentTaskObj.position.x,
      right: currentTaskObj.position.x + 150, // Approximate width
      top: currentTaskObj.position.y,
      bottom: currentTaskObj.position.y + 100, // Approximate height
    };

    // Check collision with each other task
    tasks.forEach((otherTask, i) => {
      if (otherTask.id === taskId) return;

      const otherRect = {
        left: otherTask.position.x,
        right: otherTask.position.x + 150,
        top: otherTask.position.y,
        bottom: otherTask.position.y + 100,
      };

      // Check if tasks overlap
      if (
        currentRect.left < otherRect.right &&
        currentRect.right > otherRect.left &&
        currentRect.top < otherRect.bottom &&
        currentRect.bottom > otherRect.top
      ) {
        // Calculate push direction and distance
        const overlapX = Math.min(
          currentRect.right - otherRect.left,
          otherRect.right - currentRect.left,
        );
        const overlapY = Math.min(
          currentRect.bottom - otherRect.top,
          otherRect.bottom - currentRect.top,
        );

        // Choose the direction with the smaller overlap
        let newX = otherTask.position.x;
        let newY = otherTask.position.y;

        if (overlapX < overlapY) {
          // Push horizontally
          if (
            currentRect.right - otherRect.left <
            otherRect.right - currentRect.left
          ) {
            newX -= overlapX + 5; // Push left
          } else {
            newX += overlapX + 5; // Push right
          }
        } else {
          // Push vertically
          if (
            currentRect.bottom - otherRect.top <
            otherRect.bottom - currentRect.top
          ) {
            newY -= overlapY + 5; // Push up
          } else {
            newY += overlapY + 5; // Push down
          }
        }

        // Keep the task within container bounds
        if (containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          newX = Math.max(0, Math.min(newX, containerRect.width - 150));
          newY = Math.max(0, Math.min(newY, containerRect.height - 100));
        }

        // Store the updated position in the ref and update state in a debounced manner
        dragPositionRef.current[otherTask.id] = { x: newX, y: newY };
        debouncedUpdatePosition(otherTask.id, { x: newX, y: newY });
      }
    });
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-plansync-purple-900 font-lilita-one">
              Overwhelm Organizer
            </h1>
            <p className="text-muted-foreground">
              Visualize all your tasks and organize your overwhelm
            </p>
          </div>
          {tasks.length > 0 && (
            <button
              onClick={clearTasks}
              className="text-sm px-3 py-1 border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-[70vh] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden"
        >
          {/* Tasks */}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={{
                ...task,
                position: dragPositionRef.current[task.id] || task.position,
              }}
              containerRef={containerRef}
              isSelected={currentTask === task.id}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              dragElastic={0}
              dragTransition={{ power: 0, timeConstant: 0 }}
              onDelete={removeTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground">
              <img
                src="assets/idea.png"
                alt="No tasks"
                className="w-32 mx-auto"
              />
              <p className="text-center text-muted-foreground mt-2">
                Start clearing your mind ...
              </p>
            </div>
          )}
        </div>

        {/* Floating Input */}
        <TaskInput
          ref={inputRef}
          taskText={taskText}
          taskHours={taskHours}
          onTaskTextChange={setTaskText}
          onTaskHoursChange={setTaskHours}
          onAddTask={handleAddTask}
        />
      </div>
    </Layout>
  );
};

export default OverwhelmOrganizer;
