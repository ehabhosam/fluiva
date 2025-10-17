import { Period, PlanType } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Droppable } from "react-beautiful-dnd";
import DraggableBlock from "./DraggableBlock";
import GridBackground from "./GridBackground";
import { getBlockUnitFromPlanType } from "@/lib/utils";

interface DroppablePeriodProps {
    period: Period;
    planType: PlanType;
}

const PeriodData: React.FC<DroppablePeriodProps> = ({ period, planType }) => {
    const blockUnit = getBlockUnitFromPlanType(planType);
    return (
        <div>
            <div className="mb-4">
                <Card className="overflow-hidden m-3 rounded-2xl">
                    <div>
                        <CardContent className="p-0">
                            <Droppable
                                droppableId={`period-${period.id}`}
                                type="BLOCK"
                            >
                                {(provided) => (
                                    <div
                                        className="flex relative gap-5 p-3"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <GridBackground />
                                        <div>
                                            <ul className="capitalize font-lilita-one text-xs lg:text-sm h-full flex flex-col justify-between text-Fluiva-blue/60">
                                                {[
                                                    period.blocks &&
                                                    period.blocks.length > 0
                                                        ? period.blocks.map(
                                                              (p, i) => (
                                                                  <li>
                                                                      {
                                                                          blockUnit
                                                                      }{" "}
                                                                      {i + 1}
                                                                  </li>
                                                              ),
                                                          )
                                                        : null,
                                                ]}
                                                <span></span>{" "}
                                                {/* spacer to keep last line empty */}
                                            </ul>
                                        </div>
                                        <div className="space-y-2 min-h-[50px] flex-1 z-10">
                                            {period.blocks &&
                                            period.blocks.length > 0 ? (
                                                period.blocks.map(
                                                    (block, blockIndex) => (
                                                        <DraggableBlock
                                                            key={block.id}
                                                            block={block}
                                                            index={blockIndex}
                                                        />
                                                    ),
                                                )
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
        </div>
    );
};

export default PeriodData;
