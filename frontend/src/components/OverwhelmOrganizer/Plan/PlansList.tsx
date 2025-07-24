import planApi from "@/api/plan";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";
import CreateFirstPlan from "./CreateFirstPlan";
import NewPlanCard from "./NewPlanCard";
import PlanCard from "./PlanCard";
import PlansLoadError from "./PlansLoadError";

export default function PlansList() {
    const { user } = useAuth();

    // Fetch user plans
    const {
        data: plans,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["plans"],
        queryFn: planApi.getUserPlans,
        enabled: !!user,
    });

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return <>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-plansync-purple-900 font-lilita-one">
                    My Plans
                </h1>
                <p className="text-muted-foreground">
                    View and manage all your productivity plans
                </p>
            </div>
            <Link to="/plans/new">
                <Button className="gradient-bg">New Plan <ArrowRightCircle className="w-4 h-4" /></Button>
            </Link>
        </div>

        {
            error ? (
                <PlansLoadError />
            ) : plans?.length === 0 ? (
                <CreateFirstPlan />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans?.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                    <NewPlanCard />
                </div>
            )
        }
    </>
}