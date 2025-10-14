import { plannerApi } from "@/api/planner";
import {
    PlanType,
    RoutineInput,
    TaskInput,
    TimeConstraintsRequest,
} from "@/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useTimeConstaints from "@/hooks/use-time-constraints";
import { getUnitsFromPlanType } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import ControlledCounter from "./ControlledCounter";
import CounterContainer from "./CounterContainer";

interface TimeConstraintsStepProps {
    tasks: TaskInput[];
    routines: RoutineInput[];
    onComplete: (data: { nBlocks: number; nPeriods: number }) => void;
    onBack: () => void;
    type: PlanType;
}

const TimeConstraintsStep: React.FC<TimeConstraintsStepProps> = ({
    tasks,
    routines,
    onComplete,
    onBack,
    type,
}) => {
    const {
        nBlocks,
        nPeriods,
        incrementBlocks,
        incrementPeriods,
        decrementBlocks,
        decrementPeriods,
        setInitialConstraints,
    } = useTimeConstaints(tasks, routines);
    const [errors, setErrors] = useState<{
        nBlocks?: string;
        nPeriods?: string;
    }>({});

    // Determine units based on plan type
    const [buildUnit] = getUnitsFromPlanType(type);

    // Fetch time constraints
    const timeConstraintsPayload: TimeConstraintsRequest = {
        tasks,
        routines,
        blocksUnit: buildUnit,
    };

    const {
        data: constraints,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["timeConstraints", timeConstraintsPayload],
        queryFn: () => plannerApi.getTimeConstraints(timeConstraintsPayload),
    });

    useEffect(() => {
        if (constraints) {
            setInitialConstraints(
                constraints.max_blocks,
                constraints.least_blocks,
            );
        }
    }, [constraints]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onComplete({
            nBlocks,
            nPeriods,
        });
    };

    const [blocksUnit, periodsUnit] = getUnitsFromPlanType(type);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Time Constraints</h3>
                <p className="text-muted-foreground">
                    Based on your tasks and routines, we've calculated the
                    minimum and maximum number of blocks and periods needed for
                    your plan.
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
                        <CounterContainer
                            name="blocks"
                            count={nBlocks}
                            increment={incrementBlocks}
                            decrement={decrementBlocks}
                            min={constraints.least_blocks}
                            max={constraints.max_blocks}
                            error={errors.nBlocks}
                            label={`Number of ${blocksUnit}s per ${periodsUnit}`}
                        />

                        <CounterContainer
                            name="periods"
                            count={nPeriods}
                            increment={incrementPeriods}
                            decrement={decrementPeriods}
                            min={constraints.least_periods}
                            max={constraints.max_periods}
                            error={errors.nPeriods}
                            label={`Number of ${periodsUnit}s`}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back to Routines
                </Button>
                <Button
                    type="submit"
                    variant="secondary"
                    className="font-bold text-base"
                >
                    Generate Plan !
                </Button>
            </div>
        </form>
    );
};

export default TimeConstraintsStep;
