import { Task } from '@/components/OverwhelmOrganizer/TaskCard';
import { useCallback, useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'overwhelm-organizer-tasks';

/**
 * Custom hook for managing tasks with localStorage persistence
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Initialize from localStorage if available
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  // Sync tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Function to add a new task
  const addTask = useCallback((task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  }, []);

  // Function to update a task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === taskId ? { ...task, ...updates } : task))
    );
  }, []);

  // Function to remove a task
  const removeTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  // Update multiple tasks at once
  const updateTasks = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  }, []);

  // Clear all tasks
  const clearTasks = useCallback(() => {
    if (confirm('Are you sure you want to clear all tasks?')) {
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
