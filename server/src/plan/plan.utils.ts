import { Priority } from "generated/prisma";

export function getPriorityNumericValue(priority: Priority): number {
    switch (priority) {
        case Priority.LOW:
            return 1;
        case Priority.NORMAL:
            return 2;
        case Priority.HIGH:
            return 3;
    }

    throw new Error('Invalid priority');
}