import { PlanSummary } from "@/api/types";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, List } from "lucide-react";
import { Link } from "react-router-dom";

interface PlanCardProps {
    plan: PlanSummary;
}

export default function PlanCard(props: PlanCardProps) {
    const { plan } = props;

    // Get background image based on plan type
    const getBackgroundImage = (type: string) => {
        switch (type.toUpperCase()) {
            case "DAILY":
                return "url(/assets/cards/green.png)";
            case "WEEKLY":
                return "url(/assets/cards/purple.png)";
            case "MONTHLY":
                return "url(/assets/cards/blue.png)";
            default:
                return "url(/assets/cards/green.png)";
        }
    };

    return (
        <Link key={plan.id} to={`/plans/${plan.id}`} className="h-full">
            <Card
                className="relative p-6 rounded-xl shadow-sm border-0 hover:shadow-md transition-all h-full flex flex-col justify-between overflow-hidden"
                style={{
                    backgroundImage: getBackgroundImage(plan.type),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="text-lg font-semibold text-white mb-4 tracking-wider text-center">
                    <span className="block text-xs tracking-widest">
                        {plan.type}
                    </span>
                    {plan.title}
                </div>

                {/* Progress Circle */}
                <div className="flex justify-center items-center my-6">
                    <div className="relative w-20 h-20">
                        <svg
                            className="w-20 h-20 transform -rotate-90"
                            viewBox="0 0 80 80"
                        >
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke="rgba(255, 255, 255, 0.3)"
                                strokeWidth="6"
                                fill="transparent"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke="white"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 32}`}
                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - plan.progress)}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                                {Math.round(plan.progress * 100)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto text-xs text-white/80 flex justify-between">
                    <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(plan.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                        <List size={14} /> {plan._count.todos} items
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={14} /> {plan._count.periods} periods
                    </span>
                </div>
            </Card>
        </Link>
    );
}
