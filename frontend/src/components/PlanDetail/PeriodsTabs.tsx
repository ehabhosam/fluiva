import { Period, PlanDetail } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface PeriodsTabsProps {
    plan: PlanDetail;
    onPeriodClick: (periodId: number) => void;
    activePeriod: number | null;
    periodUnit: string;
}

interface PeriodData {
    id: number;
    name: string;
    index: number;
    totalTime: number;
    completedTime: number;
    completionPercentage: number;
}

const PeriodsTabs: React.FC<PeriodsTabsProps> = ({
    plan,
    onPeriodClick,
    activePeriod,
    periodUnit
}) => {
    const periodsData: PeriodData[] = useMemo(() => {
        if (!plan.periods) return [];

        return plan.periods.map((period) => {
            const totalTime = calculatePeriodTime(period);
            const completedTime = calculateCompletedTime(period);
            const completionPercentage = totalTime > 0
                ? Math.round((completedTime / totalTime) * 100)
                : 0;

            return {
                id: period.id,
                name: `${periodUnit} ${period.index + 1}`,
                index: period.index,
                totalTime,
                completedTime,
                completionPercentage,
            };
        });
    }, [plan]);

    function calculatePeriodTime(period: Period): number {
        if (!period.blocks) return 0;

        return period.blocks.reduce((total, block) => {
            const todo = block.todo;
            return total + (todo ? todo.required_time : 0);
        }, 0);
    }

    function calculateCompletedTime(period: Period): number {
        if (!period.blocks) return 0;

        return period.blocks.reduce((total, block) => {
            if (block.done_at === null) return total;
            const todo = block.todo;
            return total + (todo ? todo.required_time : 0);
        }, 0);
    }

    const handlePeriodClick = (periodId: number) => {
        onPeriodClick(periodId);
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex gap-2 min-w-max md:min-w-0 md:grid md:grid-cols-auto-fit md:gap-3">
                {periodsData.map((period) => (
                    <button
                        key={period.id}
                        onClick={() => handlePeriodClick(period.id)}
                        className={`
                    flex flex-col items-center p-4 rounded-lg border transition-all duration-200
                    min-w-[120px] md:min-w-0
                    ${activePeriod === period.id
                                ? "border-primary bg-primary/5 shadow-md !font-bold"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }
                `}
                    >
                        <span className="font-medium text-sm mb-1 capitalize">{period.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PeriodsTabs;
