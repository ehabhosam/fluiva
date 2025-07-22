import { Task } from "@/components/OverwhelmOrganizer/TaskCard";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook for managing tasks
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Function to add a new task
  const addTask = useCallback((task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  }, []);

  // Function to update a task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    );
  }, []);

  // Function to remove a task
  const removeTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  // Update multiple tasks at once
  const updateTasks = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  }, []);

  // Clear all tasks
  const clearTasks = useCallback(() => {
    if (confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
    }
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    removeTask,
    updateTasks,
    clearTasks,
  };
};

export default useTasks;
