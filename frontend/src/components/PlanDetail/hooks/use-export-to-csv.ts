import { PlanDetail } from "@/api/types";
import { toast } from "@/hooks/use-toast";
import { aggregatePlan, formatToCsv } from "@/lib/export";
import { useState } from "react";

export default function useExportToCsv(plan: PlanDetail, onError: () => void) {
    const [isProcessingCsv, setIsProcessingCsv] = useState(false);
    const [csvData, setCsvData] = useState<(string | number)[][] | null>(null);

    const handleGenerateCsv = (startDate: Date, startHour: number) => {
        if (!plan) return;

        setIsProcessingCsv(true);
        setTimeout(() => {
            try {
                const aggregated = aggregatePlan(plan as PlanDetail);
                const csv = formatToCsv(
                    aggregated,
                    startDate,
                    startHour,
                    plan.type,
                );
                setCsvData(csv);
            } catch (error) {
                console.error("Error generating CSV:", error);
                toast({
                    title: "Error Generating CSV",
                    description:
                        "Could not generate the file. Please try again.",
                    variant: "destructive",
                });
                onError();
            } finally {
                setIsProcessingCsv(false);
            }
        }, 50);
    };

    return {
        isProcessingCsv,
        csvData,
        handleGenerateCsv,
        setCsvData,
    };
}
