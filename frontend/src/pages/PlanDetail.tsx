import { planApi } from "@/api/plan";
import { BlockReorder, PeriodReorder, PlanType } from "@/api/types";
import AuthGuard from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import DroppablePeriod from "@/components/PlanDetail/DroppablePeriod";
import PeriodsTabs from "@/components/PlanDetail/PeriodsTabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, Clock, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Link, useParams } from "react-router-dom";

const PlanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [activePeriod, setActivePeriod] = useState<number | null>(null);

  // Fetch plan details
  const {
    data: plan,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plan", id],
    queryFn: () => planApi.getPlanDetails(Number(id)),
    enabled: !!id,
  });

  // Set active period to first period when plan loads
  useEffect(() => {
    if (plan?.periods && plan.periods.length > 0) {
      setActivePeriod(plan.periods[0].id);
    }
  }, [plan?.periods]);

  // Mutations for drag and drop operations
  const reorderPeriodsMutation = useMutation({
    mutationFn: planApi.reorderPeriods,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", id] });
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
      queryClient.invalidateQueries({ queryKey: ["plan", id] });
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
      queryClient.invalidateQueries({ queryKey: ["plan", id] });
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
      const sourcePeriodId = Number(source.droppableId.replace("period-", ""));
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

  // Mark block as done/undone
  const handleMarkBlockDone = (blockId: number, isDone: boolean) => {
    // In a real implementation, this would call an API endpoint
    console.log(`Block ${blockId} marked as ${isDone ? "done" : "undone"}`);
    toast({
      title: isDone ? "Block marked as done" : "Block marked as not done",
      description: "Block status has been updated",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <div className="space-y-6">
          <h3>Plan Not Found.</h3>
        </div>
      </Layout>
    );
  }

  let periodUnit, blockUnit;
  if (plan.type === PlanType.DAILY) {
    periodUnit = "day";
    blockUnit = "hour";
  } else if (plan.type === PlanType.WEEKLY) {
    periodUnit = "week";
    blockUnit = "day";
  } else {
    periodUnit = "month";
    blockUnit = "week";
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>Back to plans</span>
              </Link>
              <h1 className="text-2xl font-bold text-plansync-purple-900 font-lilita-one capitalize">
                {isLoading ? "Loading plan..." : plan.title}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(parseISO(plan.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{plan.type.toLowerCase()} plan</span>
                </div>
              </div>
              {plan.description && (
                <p className="mt-3 text-muted-foreground max-w-2xl">
                  {plan.description}
                </p>
              )}
            </div>
            <Button variant="outline" className="flex gap-2 items-center">
              <Edit className="w-4 h-4" />
              <span>Edit Plan</span>
            </Button>
          </div>

          {/* Periods Tabs */}
          <div className="mb-8">
            <PeriodsTabs
              activePeriod={activePeriod}
              plan={plan}
              onPeriodClick={(periodId) => setActivePeriod(periodId)}
              periodUnit={periodUnit}
            />
          </div>

          {/* Periods and Blocks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="capitalize font-lilita-one">
                    Plan {periodUnit}s Content
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Drag and drop to reorder {periodUnit}s and {blockUnit}s
                  </CardDescription>
                </div>
                {activePeriod && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePeriod(null)}
                    className={cn(
                      "text-xs capitalize",
                      activePeriod === null && "hidden",
                    )}
                  >
                    View All {periodUnit}s
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-md"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500 mb-3">
                    Error loading plan details
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable
                    droppableId="periods"
                    type="PERIOD"
                    direction="vertical"
                  >
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {plan.periods
                          ?.filter(
                            (period) =>
                              activePeriod === null ||
                              period.id === activePeriod,
                          )
                          .map((period, index) => (
                            <DroppablePeriod
                              key={period.id}
                              period={period}
                              index={index}
                              onMarkBlockDone={handleMarkBlockDone}
                              blockUnit={blockUnit}
                              periodUnit={periodUnit}
                            />
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default PlanDetail;
