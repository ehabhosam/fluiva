import planApi from "@/api/plan";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircle, PlusCircleIcon } from "lucide-react";
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

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl text-neutral-700 font-lilita-one">
                        My Plans
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage all your productivity plans
                    </p>
                </div>
                <Link to="/plans/new">
                    <Button className="gradient-bg font-bold">
                        New Plan <PlusCircleIcon className="w-4 h-4" />
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <Loading />
            ) : error ? (
                <PlansLoadError />
            ) : plans?.length === 0 ? (
                <CreateFirstPlan />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans?.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                    <NewPlanCard />
                </div>
            )}
        </>
    );
}
