import { Period, PlanDetail } from "@/api/types";
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
    periodUnit,
}) => {
    const periodsData: PeriodData[] = useMemo(() => {
        if (!plan.periods) return [];

        return plan.periods.map((period) => {
            const totalTime = period.blocks?.length || 0;
            const completedTime = calculateCompletedTime(period);
            const completionPercentage =
                totalTime > 0
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

    function calculateCompletedTime(period: Period): number {
        if (!period.blocks) return 0;

        return period.blocks.reduce((total, block) => {
            if (block.done_at === null) return total;
            return total + 1;
        }, 0);
    }

    const handlePeriodClick = (periodId: number) => {
        onPeriodClick(periodId);
    };

    return (
        <div className="overflow-x-auto max-md:mb-5">
            <div className="flex gap-2 min-w-max md:min-w-0 md:grid md:grid-cols-auto-fit md:gap-3 font-lilita-one max-h-[50vh] overflow-y-auto">
                {periodsData.map((period) => (
                    <button
                        key={period.id}
                        onClick={() => handlePeriodClick(period.id)}
                        className={`
                    relative flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-200
                    min-w-[120px] md:min-w-0 overflow-hidden h-20 shadow-md
                    ${
                        activePeriod === period.id
                            ? "border-primary bg-button-accent-hover !font-bold border-[3px] border-white text-white"
                            : "border-border hover:border-Fluiva-green/50 hover:bg-Fluiva-green/10"
                    }
                `}
                    >
                        <div
                            className="absolute top-0 left-0 bg-Fluiva-green/20 transition-all duration-300 z-0"
                            style={{
                                width: `${period.completionPercentage}%`,
                                height: "100%",
                            }}
                        />
                        <span
                            className={`font-medium capitalize relative z-10 transition-all duration-300 text-lg ${
                                activePeriod === period.id
                                    ? "translate-y-0"
                                    : "translate-y-2"
                            }`}
                        >
                            {period.name}
                        </span>
                        <span
                            className={`text-xs relative z-10 transition-opacity duration-300 ${
                                activePeriod === period.id
                                    ? "opacity-100"
                                    : "opacity-0 absolute"
                            }`}
                        >
                            {period.completionPercentage}% complete
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PeriodsTabs;
