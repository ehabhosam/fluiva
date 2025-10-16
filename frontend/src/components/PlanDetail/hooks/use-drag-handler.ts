import { BlockReorder, PeriodReorder, PlanDetail } from "@/api/types";
import usePlanMutations from "./use-plan-mutations";
import { DropResult } from "react-beautiful-dnd";

export function useDragHandler(planId: string, plan: PlanDetail) {
    const { reorderPeriodsMutation, reorderBlocksMutation, moveBlockMutation } =
        usePlanMutations(planId);

    // TODO: split into smaller functions
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result;

        // Dropped outside the list or dropped in the same position
        if (
            !destination ||
            (destination.droppableId === source.droppableId &&
                destination.index === source.index)
        ) {
            return;
        }

        if (type === "PERIOD") {
            // Handle period reordering
            const periodId = Number(draggableId.replace("period-", ""));
            const newIndex = destination.index;

            if (plan) {
                const reorderRequest: PeriodReorder[] = [
                    {
                        periodId,
                        newIndex,
                    },
                ];

                reorderPeriodsMutation.mutate({ periods: reorderRequest });
            }
        } else if (type === "BLOCK") {
            const blockId = Number(draggableId.replace("block-", ""));
            const sourcePeriodId = Number(
                source.droppableId.replace("period-", ""),
            );
            const destinationPeriodId = Number(
                destination.droppableId.replace("period-", ""),
            );

            if (sourcePeriodId === destinationPeriodId) {
                // Reordering blocks within the same period
                const reorderRequest: BlockReorder[] = [
                    {
                        blockId,
                        newIndex: destination.index,
                    },
                ];

                reorderBlocksMutation.mutate({
                    periodId: sourcePeriodId,
                    blocks: reorderRequest,
                });
            } else {
                // Moving block to a different period
                moveBlockMutation.mutate({
                    blockId,
                    targetPeriodId: destinationPeriodId,
                    targetIndex: destination.index,
                });
            }
        }
    };

    return { handleDragEnd };
}
