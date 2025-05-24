
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Block, Todo } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableBlockProps {
  block: Block;
  index: number;
  onMarkDone: (blockId: number, isDone: boolean) => void;
}

const BlockPriorityColor: Record<string, string> = {
  HIGH: "border-red-500 bg-red-50",
  NORMAL: "border-blue-500 bg-blue-50",
  LOW: "border-green-500 bg-green-50",
  NULL: "border-gray-300 bg-gray-50",
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
  const priorityColor = todo.priority ? BlockPriorityColor[todo.priority] : BlockPriorityColor.NULL;
  
  const handleToggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !isDone;
    setIsDone(newStatus);
    onMarkDone(block.id, newStatus);
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
              "border-l-4 transition-all",
              priorityColor,
              snapshot.isDragging && "shadow-lg",
              isDone && "opacity-60"
            )}
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex-1">
                <h4
                  className={cn(
                    "font-medium text-sm",
                    isDone && "line-through text-gray-500"
                  )}
                >
                  {todo.title}
                </h4>
                {todo.description && (
                  <p
                    className={cn(
                      "text-xs text-muted-foreground mt-1",
                      isDone && "line-through"
                    )}
                  >
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{todo.required_time} min</span>
                </div>
              </div>
              <button
                onClick={handleToggleDone}
                className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center",
                  isDone
                    ? "bg-plansync-purple-600 border-plansync-purple-600 text-white"
                    : "border-gray-300 hover:border-plansync-purple-600 hover:bg-plansync-purple-50"
                )}
              >
                {isDone && <Check className="w-4 h-4" />}
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableBlock;
