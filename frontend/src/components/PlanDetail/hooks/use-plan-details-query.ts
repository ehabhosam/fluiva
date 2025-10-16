import planApi from "@/api/plan";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function usePlanDetailsQuery(id: string, setActivePeriod: any) {
    // Fetch plan details
    const {
        data: plan,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["plan", id],
        queryFn: () => planApi.getPlanDetails(Number(id)),
        enabled: !!id,
    });

    // Set active period to first period when plan loads
    useEffect(() => {
        if (plan?.periods && plan.periods.length > 0) {
            setActivePeriod(plan.periods[0].id);
        }
    }, [plan?.periods]);

    return { plan, isLoading, error };
}
