import { PlanDetail } from "@/api/types";
import { toast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, Clock, Download, Edit, Link } from "lucide-react";
import { Button } from "../ui/button";

interface PlanDetailsHeaderProps {
    plan: PlanDetail;
    handleExport: () => void;
}

export default function PlanDetailsHeader(props: PlanDetailsHeaderProps) {
    const { plan, handleExport } = props;

    const handleEditPlan = () => {
        toast({
            title: "Edit Plan",
            description: "to be implemented, entazeroona",
        });
    };

    return (
        <div className="flex items-start justify-between">
            <div>
                <Link
                    to="/"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span>Back to plans</span>
                </Link>
                <h1 className="text-2xl font-bold text-Fluiva-purple-900 font-lilita-one capitalize">
                    {plan.title}
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
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="flex gap-2 items-center"
                    onClick={handleExport}
                >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </Button>
                <Button
                    variant="outline"
                    className="flex gap-2 items-center"
                    onClick={handleEditPlan}
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit Plan</span>
                </Button>
            </div>
        </div>
    );
}
