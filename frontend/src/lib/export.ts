import { PlanDetail, Block, Todo, PlanType } from "@/api/types";
import {
    format,
    addDays,
    addHours,
    addWeeks,
    setHours,
    setMinutes,
    setSeconds,
} from "date-fns";

export interface AggregatedBlock {
    title: string;
    duration: number;
    description: string;
}

export interface AggregatedPlan {
    name: string;
    periods: AggregatedBlock[][];
}

const findTodoForBlock = (block: Block, todos: Todo[]): Todo | undefined => {
    return todos.find((todo) => todo.id === block.todo_id);
};

export const aggregatePlan = (plan: PlanDetail): AggregatedPlan => {
    const aggregatedPeriods: AggregatedBlock[][] = [];

    for (const period of plan.periods) {
        const aggregatedBlocks: AggregatedBlock[] = [];
        if (!period.blocks || period.blocks.length === 0) {
            aggregatedPeriods.push(aggregatedBlocks);
            continue;
        }

        let currentAggregatedBlock: AggregatedBlock | null = null;
        let lastTodoId: number | null = null;

        for (const block of period.blocks) {
            const todo = findTodoForBlock(block, plan.todos);
            if (!todo) continue;

            if (lastTodoId === block.todo_id && currentAggregatedBlock) {
                currentAggregatedBlock.duration += 1;
            } else {
                if (currentAggregatedBlock) {
                    aggregatedBlocks.push(currentAggregatedBlock);
                }
                currentAggregatedBlock = {
                    title: todo.title,
                    description: todo.description,
                    duration: 1,
                };
                lastTodoId = todo.id;
            }
        }

        if (currentAggregatedBlock) {
            aggregatedBlocks.push(currentAggregatedBlock);
        }
        aggregatedPeriods.push(aggregatedBlocks);
    }

    return {
        name: plan.title,
        periods: aggregatedPeriods,
    };
};

export const formatToCsv = (
    aggregatedPlan: AggregatedPlan,
    startDate: Date,
    startHour: number,
    planType: PlanType,
): (string | number)[][] => {
    const headers = [
        "Subject",
        "Start Date",
        "Start Time",
        "End Date",
        "End Time",
        "Description",
        "All Day Event",
        "Private",
    ];

    const csvData: (string | number)[][] = [headers];
    let currentDay = startDate;

    if (planType === PlanType.DAILY) {
        aggregatedPlan.periods.forEach((period) => {
            let dayStartTime = setSeconds(
                setMinutes(setHours(currentDay, startHour), 0),
                0,
            );

            period.forEach((block) => {
                const eventStart = dayStartTime;
                const eventEnd = addHours(eventStart, block.duration);

                csvData.push([
                    `${aggregatedPlan.name}: ${block.title}`,
                    format(eventStart, "MM/dd/yyyy"),
                    format(eventStart, "HH:mm"),
                    format(eventEnd, "MM/dd/yyyy"),
                    format(eventEnd, "HH:mm"),
                    block.description,
                    "False",
                    "False",
                ]);
                dayStartTime = eventEnd;
            });
            currentDay = addDays(currentDay, 1);
        });
    } else {
        const allBlocks = aggregatedPlan.periods.flat();
        const addDuration = planType === PlanType.WEEKLY ? addDays : addWeeks;

        allBlocks.forEach((block) => {
            const eventStart = currentDay;
            const eventEnd = addDuration(eventStart, block.duration);

            csvData.push([
                `${aggregatedPlan.name}: ${block.title}`,
                format(eventStart, "MM/dd/yyyy"),
                "",
                format(eventEnd, "MM/dd/yyyy"),
                "",
                block.description,
                "True",
                "False",
            ]);
            currentDay = eventEnd;
        });
    }

    return csvData;
};
