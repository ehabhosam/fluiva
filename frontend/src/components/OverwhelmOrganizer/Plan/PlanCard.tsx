import { PlanSummary } from "@/api/types"
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, List } from "lucide-react";
import { Link } from "react-router-dom";

interface PlanCardProps {
    plan: PlanSummary
}

export default function PlanCard(props: PlanCardProps) {
    const { plan } = props;

    return <Link key={plan.id} to={`/plans/${plan.id}`} className="h-full">
        <Card className="relative p-4 rounded-xl shadow-sm border border-purple-100 bg-[linear-gradient(135deg,rgba(128,90,213,0.09),rgba(168,85,247,0.03))] hover:shadow-md transition-all h-full flex flex-col justify-between">
            <div className="text-xs font-semibold text-purple-600 uppercase mb-2 tracking-wider">
                {plan.type}
            </div>

            <div>
                <h2 className="text-lg font-bold text-gray-800">
                    {plan.title}
                </h2>
                <p className="text-sm text-gray-600">
                    {plan.description || "No description provided."}
                </p>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-gray-500 flex justify-between">
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
}