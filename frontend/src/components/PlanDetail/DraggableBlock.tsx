import { Block, Todo } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { useCompleteBlock } from "@/hooks/use-complete-block";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

interface DraggableBlockProps {
    block: Block;
    index: number;
    onMarkDone: (blockId: number, isDone: boolean) => void;
}

const BlockPriorityColor: Record<string, string> = {
    HIGH: "border-transparent bg-gradient-to-br from-orange-200 to-pink-300 text-white",
    NORMAL: "border-transparent bg-gradient-to-br from-blue-200 to-blue-400 text-white",
    LOW: "border-transparent bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800",
    NULL: "border-transparent bg-gradient-to-br from-accent to-Fluiva-yellow bg-opacity-50 text-gray-800", // routine
};

export const getDoneStatus = (block: Block): boolean => {
    return block.done_at !== null;
};

const DraggableBlock: React.FC<DraggableBlockProps> = ({
    block,
    index,
    onMarkDone,
}) => {
    const [isDone, setIsDone] = useState<boolean>(getDoneStatus(block));
    const todo = block.todo as Todo;
    const priorityColor = todo.priority
        ? BlockPriorityColor[todo.priority]
        : BlockPriorityColor.NULL;
    const { completeBlock, isBlockLoading } = useCompleteBlock();

    // Update local state when block prop changes (e.g. from parent rerender)
    useEffect(() => {
        setIsDone(getDoneStatus(block));
    }, [block.done_at]);

    const handleToggleDone = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isBlockLoading(block.id)) return;

        const newStatus = !isDone;

        // Optimistically update UI
        setIsDone(newStatus);

        // Call API and notify parent
        const updatedBlock = await completeBlock(block, newStatus);
        onMarkDone(block.id, getDoneStatus(updatedBlock));

        // If API call failed, UI will be reverted by the effect hook
    };

    return (
        <Draggable draggableId={`block-${block.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2"
                >
                    <Card
                        className={cn(
                            "transition-all rounded-2xl animate-fade-in border-none",
                            priorityColor,
                            snapshot.isDragging && "shadow-lg",
                            isDone && "opacity-60",
                        )}
                    >
                        <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex-1">
                                <h4
                                    className={cn(
                                        "font-primary font-medium text-sm text-Fluiva-foreground",
                                        isDone &&
                                            "line-through text-Fluiva-muted-foreground",
                                    )}
                                >
                                    {todo.title}
                                </h4>
                                {todo.description && (
                                    <p
                                        className={cn(
                                            "text-xs text-Fluiva-muted-foreground mt-1",
                                            isDone && "line-through",
                                        )}
                                    >
                                        {todo.description}
                                    </p>
                                )}
                                {/* <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    {todo.required_time}{" "}
                    {blockUnit + (todo.required_time > 1 ? "s" : "")}
                  </span>
                </div> */}
                            </div>
                            <button
                                onClick={handleToggleDone}
                                disabled={isBlockLoading(block.id)}
                                className={cn(
                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                                    isDone
                                        ? "bg-Fluiva-purple border-Fluiva-purple text-white"
                                        : "border-gray-300 hover:border-Fluiva-purple hover:bg-gradient-to-r hover:from-Fluiva-purple hover:to-Fluiva-blue hover:text-white",
                                    isBlockLoading(block.id) &&
                                        "opacity-50 cursor-not-allowed",
                                )}
                            >
                                {isBlockLoading(block.id) ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    isDone && <Check className="w-4 h-4" />
                                )}
                            </button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

export default DraggableBlock;
