
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { planApi } from "@/api/plan";
import { PlanType, TaskInput, RoutineInput, GeneratePlanRequest } from "@/api/types";
import { Layout } from "@/components/Layout";
import AuthGuard from "@/components/AuthGuard";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import StepIndicator from "@/components/NewPlanForm/StepIndicator";
import PlanDetailsStep from "@/components/NewPlanForm/PlanDetailsStep";
import TasksStep from "@/components/NewPlanForm/TasksStep";
import RoutinesStep from "@/components/NewPlanForm/RoutinesStep";
import TimeConstraintsStep from "@/components/NewPlanForm/TimeConstraintsStep";

const STEPS = ["Plan Details", "Tasks", "Routines", "Time Constraints"];

const NewPlan = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: PlanType;
    tasks: TaskInput[];
    routines: RoutineInput[];
    blocksUnit: string;
    periodUnit: string;
    nBlocks: number;
    nPeriods: number;
  }>({
    title: "",
    description: "",
    type: PlanType.DAILY,
    tasks: [],
    routines: [],
    blocksUnit: "minutes",
    periodUnit: "hours",
    nBlocks: 0,
    nPeriods: 0,
  });

  // Generate plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: (data: GeneratePlanRequest) => planApi.generatePlan(data),
    onSuccess: (response) => {
      toast({
        title: "Plan created successfully!",
        description: `"${response.plan.title}" has been created with ${response.plan.periods.length} periods.`,
      });
      navigate(`/plans/${response.plan.id}`);
    },
    onError: (error) => {
      console.error("Error generating plan:", error);
      toast({
        title: "Failed to create plan",
        description: "There was an error creating your plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleUpdatePlanDetails = (data: Partial<{ title: string; description: string; type: PlanType }>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleUpdateTasks = (tasks: TaskInput[]) => {
    setFormData((prev) => ({ ...prev, tasks }));
  };

  const handleUpdateRoutines = (routines: RoutineInput[]) => {
    setFormData((prev) => ({ ...prev, routines }));
  };

  const handleComplete = (data: {
    blocksUnit: string;
    periodUnit: string;
    nBlocks: number;
    nPeriods: number;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    
    // Generate plan
    const generatePlanRequest: GeneratePlanRequest = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      buildUnit: data.blocksUnit,
      periodUnit: data.periodUnit,
      nBlocks: data.nBlocks,
      nPeriods: data.nPeriods,
      tasks: formData.tasks,
      routines: formData.routines,
    };
    
    generatePlanMutation.mutate(generatePlanRequest);
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PlanDetailsStep
            formData={formData}
            onUpdate={handleUpdatePlanDetails}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <TasksStep
            tasks={formData.tasks}
            onUpdate={handleUpdateTasks}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <RoutinesStep
            routines={formData.routines}
            onUpdate={handleUpdateRoutines}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <TimeConstraintsStep
            tasks={formData.tasks}
            routines={formData.routines}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-plansync-purple-900">
              Create New Plan
            </h1>
            <p className="text-muted-foreground">
              Follow the steps below to create a new plan
            </p>
          </div>

          <Card className="p-6 bg-white">
            <StepIndicator currentStep={currentStep} steps={STEPS} />
            
            <div className="mt-6">
              {renderStepContent()}
            </div>
          </Card>

          {generatePlanMutation.isPending && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <div className="animate-pulse-gentle text-plansync-purple-600 mb-4">
                  <div className="w-12 h-12 border-4 border-plansync-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">Generating your plan</h3>
                <p className="text-muted-foreground">
                  This may take a moment as we optimize your tasks and routines...
                </p>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default NewPlan;
