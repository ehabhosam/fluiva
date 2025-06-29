import { planApi } from "@/api/plan";
import { Block } from "@/api/types";
import { useState } from "react";
import { toast } from "sonner";

interface UseCompleteBlockOptions {
  onSuccess?: (block: Block) => void;
  onError?: (error: unknown) => void;
}

export function useCompleteBlock(options?: UseCompleteBlockOptions) {
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});

  const completeBlock = async (block: Block, completed: boolean) => {
    // Store original state in case we need to revert
    const originalDoneAt = block.done_at;

    // Set loading state for this block
    setIsLoading((prev) => ({ ...prev, [block.id]: true }));

    try {
      // Make the API call
      const updatedBlock = await planApi.completeBlock({
        blockId: block.id,
        completed,
      });

      // On success
      toast.success(
        completed ? "Task marked as complete" : "Task marked as incomplete",
      );

      // Call the success callback if provided
      options?.onSuccess?.(updatedBlock);

      return updatedBlock;
    } catch (error) {
      console.log(error);
      // On error
      toast.error("Failed to update task. Please try again.");

      // Call the error callback if provided
      options?.onError?.(error);

      // Return the original block to allow the UI to revert
      return {
        ...block,
        done_at: originalDoneAt,
      };
    } finally {
      // Clear loading state
      setIsLoading((prev) => {
        const newState = { ...prev };
        delete newState[block.id];
        return newState;
      });
    }
  };

  // Check if a specific block is loading
  const isBlockLoading = (blockId: number): boolean => {
    return !!isLoading[blockId];
  };

  return {
    completeBlock,
    isBlockLoading,
    isAnyLoading: Object.keys(isLoading).length > 0,
  };
}
