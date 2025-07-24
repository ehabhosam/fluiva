import { plannerApi } from "@/api/planner";
import {
  PlanType,
  TaskInput,
  TimeConstraintsRequest,
} from "@/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useTimeConstaints from "@/hooks/use-time-constraints";
import { getUnitsFromPlanType } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ControlledCounter from "../NewPlanForm/ControlledCounter";

interface TimeConstraintsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskInput[];
  onComplete: (data: { nBlocks: number; nPeriods: number }) => void;
}

const TimeConstraintsPopup: React.FC<TimeConstraintsPopupProps> = ({
  isOpen,
  onClose,
  tasks,
  onComplete,
}) => {
  const planType = PlanType.DAILY;
  const {
    nBlocks,
    nPeriods,
    incrementBlocks,
    incrementPeriods,
    decrementBlocks,
    decrementPeriods,
    setInitialConstraints,
  } = useTimeConstaints(tasks, []); // No routines for overwhelm organizer
  
  const [errors, setErrors] = useState<{
    nBlocks?: string;
    nPeriods?: string;
  }>({});

  // Determine units based on plan type
  const [buildUnit] = getUnitsFromPlanType(planType);

  // Fetch time constraints
  const timeConstraintsPayload: TimeConstraintsRequest = {
    tasks,
    routines: [], // No routines for overwhelm organizer
    blocksUnit: buildUnit,
  };

  const {
    data: constraints,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["timeConstraints", timeConstraintsPayload],
    queryFn: () => plannerApi.getTimeConstraints(timeConstraintsPayload),
    enabled: isOpen && tasks.length > 0, // Only fetch when popup is open and has tasks
  });

  useEffect(() => {
    if (constraints) {
      setInitialConstraints(constraints.max_blocks, constraints.least_blocks);
    }
  }, [constraints, setInitialConstraints]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      nBlocks,
      nPeriods,
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-plansync-purple-900">
            Set Time Constraints
          </DialogTitle>
          <DialogDescription>
            Based on your {tasks.length} task{tasks.length !== 1 ? 's' : ''}, we'll calculate the optimal time blocks and periods for your daily plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isLoading ? (
            <Card className="p-6 text-center bg-gray-50">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calculating optimal time constraints...</span>
              </div>
            </Card>
          ) : error ? (
            <Card className="p-6 text-center bg-red-50 text-red-800">
              <p>Error loading time constraints. Please try again.</p>
            </Card>
          ) : constraints ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Blocks</h4>
                    <div className="inline-flex items-center rounded-full bg-plansync-purple-100 px-3 py-1 text-sm font-medium text-plansync-purple-800">
                      {constraints.least_blocks} - {constraints.max_blocks}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="n-blocks">Number of Blocks</Label>
                    <ControlledCounter
                      count={nBlocks}
                      increment={incrementBlocks}
                      decrement={decrementBlocks}
                      min={constraints.least_blocks}
                      max={constraints.max_blocks}
                    />
                    {errors.nBlocks && (
                      <p className="text-sm text-red-500">{errors.nBlocks}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Periods</h4>
                    <div className="inline-flex items-center rounded-full bg-plansync-teal-100 px-3 py-1 text-sm font-medium text-plansync-teal-800">
                      {constraints.least_periods} - {constraints.max_periods}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="n-periods">Number of Periods</Label>
                    <ControlledCounter
                      count={nPeriods}
                      increment={incrementPeriods}
                      decrement={decrementPeriods}
                      min={constraints.least_periods}
                      max={constraints.max_periods}
                    />
                    {errors.nPeriods && (
                      <p className="text-sm text-red-500">{errors.nPeriods}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          <div className="space-y-6 bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="text-plansync-purple-600">
                <CircleCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">Ready to Organize!</h4>
                <p className="text-muted-foreground text-sm">
                  We'll create your "Overwhelm Handled" daily plan with the time
                  constraints you've specified.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-bg"
              disabled={isLoading || !constraints}
            >
              Create Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeConstraintsPopup;
