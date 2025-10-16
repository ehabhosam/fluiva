import planApi from "@/api/plan";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function usePlanMutations(planId: string) {
    const queryClient = useQueryClient();

    // Mutations for drag and drop operations
    const reorderPeriodsMutation = useMutation({
        mutationFn: planApi.reorderPeriods,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plan", planId] });
            toast({
                title: "Periods reordered",
                description: "The order of periods has been updated",
            });
        },
        onError: () => {
            toast({
                title: "Error reordering periods",
                description: "Failed to update period order",
                variant: "destructive",
            });
        },
    });

    const reorderBlocksMutation = useMutation({
        mutationFn: planApi.reorderBlocks,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plan", planId] });
            toast({
                title: "Blocks reordered",
                description: "The order of blocks has been updated",
            });
        },
        onError: () => {
            toast({
                title: "Error reordering blocks",
                description: "Failed to update block order",
                variant: "destructive",
            });
        },
    });

    const moveBlockMutation = useMutation({
        mutationFn: planApi.moveBlock,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plan", planId] });
            toast({
                title: "Block moved",
                description: "The block has been moved to a new period",
            });
        },
        onError: () => {
            toast({
                title: "Error moving block",
                description: "Failed to move block to new period",
                variant: "destructive",
            });
        },
    });

    return {
        reorderPeriodsMutation,
        reorderBlocksMutation,
        moveBlockMutation,
    };
}
