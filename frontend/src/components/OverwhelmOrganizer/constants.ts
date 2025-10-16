// Task card dimensions
export const TASK_CARD = {
    WIDTH: 150,
    HEIGHT: 100,
    COLLISION_PADDING: 5,
} as const;

// Task colors for random assignment
export const TASK_COLORS = [
    "bg-button-primary border-purple-500 text-white",
    "bg-button-secondary border-amber-500 text-white",
    "bg-button-next border-blue-500 text-white",
    "bg-button-accent border-teal-500 text-white",
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
