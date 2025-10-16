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
    HIGH: "bg-card border-2 border-destructive/20 shadow-sm hover:shadow-md",
    NORMAL: "bg-card border-2 border-Fluiva-purple/20 shadow-sm hover:shadow-md",
    LOW: "bg-card border-2 border-muted shadow-sm hover:shadow-md",
    NULL: "bg-card border-2 border-accent/30 shadow-sm hover:shadow-md", // routine
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
                            "transition-all duration-200 animate-fade-in rounded-2xl",
                            priorityColor,
                            snapshot.isDragging &&
                                "shadow-lg ring-2 ring-primary/20",
                            isDone && "opacity-60 bg-muted/50",
                        )}
                    >
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex-1">
                                <h4
                                    className={cn(
                                        "font-primary font-medium text-sm text-foreground",
                                        isDone &&
                                            "line-through text-muted-foreground",
                                    )}
                                >
                                    {todo.title}
                                </h4>
                                {todo.description && (
                                    <p
                                        className={cn(
                                            "text-xs text-muted-foreground mt-1",
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
                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200",
                                    isDone
                                        ? "bg-button-primary border-button-primary text-white"
                                        : "border-muted-foreground/30 hover:border-button-primary hover:bg-primary hover:text-primary-foreground",
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
