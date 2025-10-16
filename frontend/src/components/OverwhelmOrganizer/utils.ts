import { Task } from "./TaskCard";
import { TASK_CARD, TASK_COLORS } from "./constants";

// Color utilities
export function getTaskCardColor(index): string {
    return TASK_COLORS[index % TASK_COLORS.length];
}

// Position utilities
export function calculateInitialPosition(
    containerRect: DOMRect,
    inputRect: DOMRect,
): { x: number; y: number } {
    return {
        x: inputRect.left - containerRect.left + inputRect.width / 2,
        y: inputRect.top - containerRect.top,
    };
}

export function calculateRandomPosition(containerRect: DOMRect): {
    x: number;
    y: number;
} {
    return {
        x: Math.random() * (containerRect.width - TASK_CARD.WIDTH),
        y: Math.random() * (containerRect.height - TASK_CARD.HEIGHT),
    };
}

export function keepWithinBounds(
    position: { x: number; y: number },
    containerRect: DOMRect,
): { x: number; y: number } {
    return {
        x: Math.max(
            0,
            Math.min(position.x, containerRect.width - TASK_CARD.WIDTH),
        ),
        y: Math.max(
            0,
            Math.min(position.y, containerRect.height - TASK_CARD.HEIGHT),
        ),
    };
}

// Collision detection utilities
interface Rectangle {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export function createTaskRectangle(position: {
    x: number;
    y: number;
}): Rectangle {
    return {
        left: position.x,
        right: position.x + TASK_CARD.WIDTH,
        top: position.y,
        bottom: position.y + TASK_CARD.HEIGHT,
    };
}

export function rectanglesOverlap(rect1: Rectangle, rect2: Rectangle): boolean {
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

export function calculateOverlap(
    rect1: Rectangle,
    rect2: Rectangle,
): { x: number; y: number } {
    return {
        x: Math.min(rect1.right - rect2.left, rect2.right - rect1.left),
        y: Math.min(rect1.bottom - rect2.top, rect2.bottom - rect1.top),
    };
}

export function calculatePushDirection(
    currentRect: Rectangle,
    otherRect: Rectangle,
    overlap: { x: number; y: number },
): { x: number; y: number } {
    let newX = otherRect.left;
    let newY = otherRect.top;

    if (overlap.x < overlap.y) {
        // Push horizontally
        if (
            currentRect.right - otherRect.left <
            otherRect.right - currentRect.left
        ) {
            newX -= overlap.x + TASK_CARD.COLLISION_PADDING; // Push left
        } else {
            newX += overlap.x + TASK_CARD.COLLISION_PADDING; // Push right
        }
    } else {
        // Push vertically
        if (
            currentRect.bottom - otherRect.top <
            otherRect.bottom - currentRect.top
        ) {
            newY -= overlap.y + TASK_CARD.COLLISION_PADDING; // Push up
        } else {
            newY += overlap.y + TASK_CARD.COLLISION_PADDING; // Push down
        }
    }

    return { x: newX, y: newY };
}

// Task manipulation utilities
export function updateTaskZIndex(tasks: Task[], taskId: string): Task[] {
    const maxZIndex = Math.max(...tasks.map((t) => t.zIndex));
    return tasks.map((task) => ({
        ...task,
        zIndex: task.id === taskId ? maxZIndex + 1 : task.zIndex,
    }));
}

export function findTaskById(tasks: Task[], taskId: string): Task | undefined {
    return tasks.find((task) => task.id === taskId);
}

export function getTaskIndex(tasks: Task[], taskId: string): number {
    return tasks.findIndex((task) => task.id === taskId);
}
