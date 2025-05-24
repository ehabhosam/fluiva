import { plannerApi } from "@/api/planner";
import {
  RoutineInput,
  TaskInput,
  TimeConstraintsRequest,
  TimeConstraintsResponse,
} from "@/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

interface TimeConstraintsStepProps {
  tasks: TaskInput[];
  routines: RoutineInput[];
  onComplete: (data: {
    blocksUnit: string;
    periodUnit: string;
    nBlocks: number;
    nPeriods: number;
  }) => void;
  onBack: () => void;
}

const TimeConstraintsStep: React.FC<TimeConstraintsStepProps> = ({
  tasks,
  routines,
  onComplete,
  onBack,
}) => {
  const [blocksUnit, setBlocksUnit] = useState<string>("minutes");
  const [periodUnit, setPeriodUnit] = useState<string>("hours");
  const [nBlocks, setNBlocks] = useState<number>(0);
  const [nPeriods, setNPeriods] = useState<number>(0);
  const [errors, setErrors] = useState<{
    nBlocks?: string;
    nPeriods?: string;
  }>({});

  // Fetch time constraints
  const timeConstraintsPayload: TimeConstraintsRequest = {
    tasks,
    routines,
    blocksUnit,
  };

  const {
    data: constraints,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["timeConstraints", timeConstraintsPayload],
    queryFn: () => plannerApi.getTimeConstraints(timeConstraintsPayload),
    onSuccess: (data) => {
      // Set default values based on min constraints
      if (data) {
        setNBlocks(data.leastBlocks);
        setNPeriods(data.MaxPeriods);
      }
    },
    // Only fetch if we have tasks or routines
    enabled: tasks.length > 0 || routines.length > 0,
  });

  // Mock data for preview
  const mockConstraints: TimeConstraintsResponse = {
    leastBlocks: 6,
    maxBlocks: 12,
    leastPeriods: 2,
    maxPeriods: 5,
  };

  // Use mock data until real data is available
  const displayedConstraints = constraints || mockConstraints;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate constraints
    const newErrors: {
      nBlocks?: string;
      nPeriods?: string;
    } = {};

    if (nBlocks < displayedConstraints.leastBlocks) {
      newErrors.nBlocks = `Must be at least ${displayedConstraints.leastBlocks}`;
    } else if (nBlocks > displayedConstraints.maxBlocks) {
      newErrors.nBlocks = `Must be at most ${displayedConstraints.maxBlocks}`;
    }

    if (nPeriods < displayedConstraints.leastPeriods) {
      newErrors.nPeriods = `Must be at least ${displayedConstraints.leastPeriods}`;
    } else if (nPeriods > displayedConstraints.maxPeriods) {
      newErrors.nPeriods = `Must be at most ${displayedConstraints.maxPeriods}`;
    }

    setErrors(newErrors);

    // If no errors, complete form
    if (Object.keys(newErrors).length === 0) {
      onComplete({
        blocksUnit,
        periodUnit,
        nBlocks,
        nPeriods,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Time Constraints</h3>
        <p className="text-muted-foreground">
          Based on your tasks and routines, we've calculated the minimum and
          maximum number of blocks and periods needed for your plan.
        </p>

        {isLoading ? (
          <Card className="p-6 text-center bg-gray-50">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-6 text-center bg-red-50 text-red-800">
            <p>Error loading time constraints. Please try again.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Blocks</h4>
                  <div className="inline-flex items-center rounded-full bg-plansync-purple-100 px-3 py-1 text-sm font-medium text-plansync-purple-800">
                    {displayedConstraints.leastBlocks} -{" "}
                    {displayedConstraints.maxBlocks}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Blocks are individual time slots for tasks and routines
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blocks-unit">Block Time Unit</Label>
                    <Select value={blocksUnit} onValueChange={setBlocksUnit}>
                      <SelectTrigger id="blocks-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="n-blocks">Number of Blocks</Label>
                    <Input
                      id="n-blocks"
                      type="number"
                      value={nBlocks}
                      onChange={(e) =>
                        setNBlocks(parseInt(e.target.value) || 0)
                      }
                      className={errors.nBlocks ? "border-red-500" : ""}
                    />
                    {errors.nBlocks && (
                      <p className="text-sm text-red-500">{errors.nBlocks}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Periods</h4>
                  <div className="inline-flex items-center rounded-full bg-plansync-teal-100 px-3 py-1 text-sm font-medium text-plansync-teal-800">
                    {displayedConstraints.leastPeriods} -{" "}
                    {displayedConstraints.maxPeriods}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Periods are larger time divisions containing multiple blocks
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period-unit">Period Time Unit</Label>
                    <Select value={periodUnit} onValueChange={setPeriodUnit}>
                      <SelectTrigger id="period-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="n-periods">Number of Periods</Label>
                    <Input
                      id="n-periods"
                      type="number"
                      value={nPeriods}
                      onChange={(e) =>
                        setNPeriods(parseInt(e.target.value) || 0)
                      }
                      className={errors.nPeriods ? "border-red-500" : ""}
                    />
                    {errors.nPeriods && (
                      <p className="text-sm text-red-500">{errors.nPeriods}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="space-y-6 bg-gray-50 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="text-plansync-purple-600">
            <CircleCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium">Almost Done!</h4>
            <p className="text-muted-foreground text-sm">
              After you submit, we'll generate your optimized plan with the time
              constraints you've specified.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Routines
        </Button>
        <Button type="submit" className="gradient-bg">
          Generate Plan
        </Button>
      </div>
    </form>
  );
};

export default TimeConstraintsStep;
