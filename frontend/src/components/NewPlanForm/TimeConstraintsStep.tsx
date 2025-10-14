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

    console.log({ type, buildUnit });

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
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-medium">
                                        Blocks
                                    </h4>
                                    <div className="inline-flex items-center rounded-full bg-Fluiva-purple-100 px-3 py-1 text-sm font-medium text-Fluiva-purple-800">
                                        {constraints.least_blocks} -{" "}
                                        {constraints.max_blocks}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="n-blocks">
                                            Number of Blocks
                                        </Label>
                                        <ControlledCounter
                                            count={nBlocks}
                                            increment={incrementBlocks}
                                            decrement={decrementBlocks}
                                            min={constraints.least_blocks}
                                            max={constraints.max_blocks}
                                        />
                                        {errors.nBlocks && (
                                            <p className="text-sm text-red-500">
                                                {errors.nBlocks}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-medium">
                                        Periods
                                    </h4>
                                    <div className="inline-flex items-center rounded-full bg-Fluiva-teal-100 px-3 py-1 text-sm font-medium text-Fluiva-teal-800">
                                        {constraints.least_periods} -{" "}
                                        {constraints.max_periods}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="n-periods">
                                            Number of Periods
                                        </Label>
                                        <ControlledCounter
                                            count={nPeriods}
                                            increment={incrementPeriods}
                                            decrement={decrementPeriods}
                                            min={constraints.least_periods}
                                            max={constraints.max_periods}
                                        />
                                        {errors.nPeriods && (
                                            <p className="text-sm text-red-500">
                                                {errors.nPeriods}
                                            </p>
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
                    <div className="text-Fluiva-purple-600">
                        <CircleCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-medium">Almost Done!</h4>
                        <p className="text-muted-foreground text-sm">
                            After you submit, we'll generate your optimized plan
                            with the time constraints you've specified.
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
