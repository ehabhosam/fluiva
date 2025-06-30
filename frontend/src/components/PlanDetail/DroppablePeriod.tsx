import { Period } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DraggableBlock from "./DraggableBlock";
import GridBackground from "./GridBackground";

interface DroppablePeriodProps {
  period: Period;
  index: number;
  onMarkBlockDone: (blockId: number, isDone: boolean) => void;
  blockUnit: string;
  periodUnit: string;
}

const DroppablePeriod: React.FC<DroppablePeriodProps> = ({
  period,
  index,
  onMarkBlockDone,
  blockUnit,
  periodUnit,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalTime = period.blocks.length;
  const completedBlocks =
    period.blocks?.filter((block) => block.done_at !== null).length || 0;
  const totalBlocks = period.blocks?.length || 0;
  const progressPercentage =
    totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 0;

  return (
    <Draggable draggableId={`period-${period.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-4"
        >
          <Card className="overflow-hidden">
            <CardHeader
              {...provided.dragHandleProps}
              className="p-4 bg-gray-50 cursor-grab flex flex-row items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <div>
                  <h3 className="font-medium text-sm capitalize font-lilita-one">
                    {periodUnit} {period.index + 1}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {totalTime} {blockUnit}
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      {completedBlocks}/{totalBlocks} {blockUnit}s completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-plansync-purple-600"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </CardHeader>

            <div className={cn(!isExpanded && "hidden")}>
              <CardContent className="p-3">
                <Droppable droppableId={`period-${period.id}`} type="BLOCK">
                  {(provided) => (
                    <div
                      className="flex relative gap-5 p-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <GridBackground />
                      <div>
                        <ul className="capitalize font-lilita-one text-sm opacity-50 h-full flex flex-col justify-between text-plansync-purple-950">
                          {[
                            period.blocks && period.blocks.length > 0
                              ? period.blocks.map((p, i) => (
                                  <li>
                                    {blockUnit} {i + 1}
                                  </li>
                                ))
                              : null,
                          ]}
                          <span></span> {/* spacer to keep last line empty */}
                        </ul>
                      </div>
                      <div className="space-y-2 min-h-[50px] flex-1 z-10">
                        {period.blocks && period.blocks.length > 0 ? (
                          period.blocks.map((block, blockIndex) => (
                            <DraggableBlock
                              key={block.id}
                              block={block}
                              index={blockIndex}
                              onMarkDone={onMarkBlockDone}
                              blockUnit={blockUnit}
                            />
                          ))
                        ) : (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            No blocks in this period
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default DroppablePeriod;
