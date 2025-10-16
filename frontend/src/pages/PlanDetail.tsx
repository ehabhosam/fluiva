import AuthGuard from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { ExportToCalendarPopup } from "@/components/PlanDetail/ExportToCalendarPopup";
import { useDragHandler } from "@/components/PlanDetail/hooks/use-drag-handler";
import useExportPlanPopup from "@/components/PlanDetail/hooks/use-export-plan-popup";
import useExportToCsv from "@/components/PlanDetail/hooks/use-export-to-csv";
import usePlanDetailsQuery from "@/components/PlanDetail/hooks/use-plan-details-query";
import PeriodData from "@/components/PlanDetail/PeriodData";
import PeriodHeader from "@/components/PlanDetail/PeriodHeader";
import PeriodsTabs from "@/components/PlanDetail/PeriodsTabs";
import PlanDetailsHeader from "@/components/PlanDetail/PlanDetailsHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";

const PlanDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [activePeriod, setActivePeriod] = useState<number | null>(null);

    const {
        isExportPopupOpen,
        openExportPopup,
        closeExportPopup,
        setIsExportPopupOpen,
    } = useExportPlanPopup();

    const { plan, isLoading, error } = usePlanDetailsQuery(id, setActivePeriod);

    const { isProcessingCsv, csvData, handleGenerateCsv, setCsvData } =
        useExportToCsv(plan, () => {
            closeExportPopup();
        });

    const { handleDragEnd } = useDragHandler(id, plan);

    if (isLoading) {
        return (
            <Layout>
                <Loading />
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="space-y-6">
                    <h3>Error Loading Plan.</h3>
                    <p className="text-gray-500">Please try again later.</p>
                </div>
            </Layout>
        );
    }

    if (!plan) {
        return (
            <Layout>
                <div className="space-y-6">
                    <h3>Plan Not Found.</h3>
                </div>
            </Layout>
        );
    }

    const period =
        plan.periods.find((period) => period.id === activePeriod) ||
        plan.periods[0];

    return (
        <AuthGuard>
            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <PlanDetailsHeader
                        plan={plan}
                        handleExport={openExportPopup}
                    />

                    {/* Content */}
                    <div className="lg:flex gap-5">
                        {/* Periods Tabs */}
                        <PeriodsTabs
                            activePeriod={activePeriod}
                            plan={plan}
                            onPeriodClick={(periodId) =>
                                setActivePeriod(periodId)
                            }
                        />

                        {/* Periods and Blocks */}
                        <Card className="flex-1 rounded-3xl px-5 w-full h-fit">
                            <CardHeader className="p-4 flex flex-row items-center justify-between">
                                <PeriodHeader period={period} plan={plan} />
                            </CardHeader>
                            <CardContent className="px-0">
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <PeriodData
                                        planType={plan.type}
                                        period={period}
                                    />
                                </DragDropContext>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <ExportToCalendarPopup
                    open={isExportPopupOpen}
                    onOpenChange={setIsExportPopupOpen}
                    onSubmit={handleGenerateCsv}
                    isProcessing={isProcessingCsv}
                    csvData={csvData}
                    planTitle={plan?.title || ""}
                    onClearCsvData={() => setCsvData(null)}
                />
            </Layout>
        </AuthGuard>
    );
};

export default PlanDetail;
