// Task card dimensions
export const TASK_CARD = {
  WIDTH: 150,
  HEIGHT: 100,
  COLLISION_PADDING: 5,
} as const;

// Task colors for random assignment
export const TASK_COLORS = [
  "bg-plansync-purple-100 border-plansync-purple-500 text-plansync-purple-800",
  "bg-plansync-teal-100 border-plansync-teal-500 text-plansync-teal-800",
  "bg-blue-100 border-blue-500 text-blue-800",
  "bg-amber-100 border-amber-500 text-amber-800",
  "bg-rose-100 border-rose-500 text-rose-800",
] as const;

// Animation and interaction settings
export const ANIMATION = {
  TASK_SPAWN_DELAY: 10, // ms
  DEBOUNCE_TIME: 200, // ms
  MAX_DEBOUNCE_WAIT: 300, // ms
  COLLISION_DEBOUNCE: 150, // ms
} as const;

// Default values
export const DEFAULTS = {
  TASK_HOURS: 1,
  TASK_TEXT: "",
} as const;

// Container and layout
export const LAYOUT = {
  CONTAINER_HEIGHT: "70vh",
} as const;
