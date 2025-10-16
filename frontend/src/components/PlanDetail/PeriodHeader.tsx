import { Period, PlanDetail } from "@/api/types";
import { getUnitsFromPlanType } from "@/lib/utils";
import { Clock } from "lucide-react";

interface PeriodHeaderProps {
    plan: PlanDetail;
    period: Period;
}

export default function PeriodHeader(props: PeriodHeaderProps) {
    const { plan, period } = props;
    const [blockUnit, periodUnit] = getUnitsFromPlanType(plan.type);

    const totalTime = period.blocks.length;
    const completedBlocks =
        period.blocks?.filter((block) => block.done_at !== null).length || 0;
    const totalBlocks = period.blocks?.length || 0;

    return (
        <div className="flex items-center gap-3">
            <div>
                <h3 className="font-medium text-lg capitalize font-lilita-one">
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
    );
}
