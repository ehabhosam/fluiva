import { useState } from "react";
import { planApi } from "@/api/plan";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Task } from "../TaskCard";
import {
  calculateFinishTodayConstraints,
  calculateTotalTime,
  createOverwhelmPlanRequest,
  getDefaultPlanInfo,
} from "@/lib/overwhelm";

export function useOverwhelmFlow(tasks: Task[]) {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Multi-step flow state
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isTimeConstraintsOpen, setIsTimeConstraintsOpen] = useState(false);
  const [isPlanCustomizationOpen, setIsPlanCustomizationOpen] = useState(false);
  const [selectedConstraints, setSelectedConstraints] = useState<{
    nBlocks: number;
    nPeriods: number;
  } | null>(null);

  // Mutation for creating the plan
  const createPlanMutation = useMutation({
    mutationFn: planApi.generatePlan,
    onSuccess: (response) => {
      toast({
        title: "Plan Created Successfully!",
        description: `Your plan has been created with ${tasks.length} tasks.`,
      });
      navigate(`/plans/${response.plan.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Plan",
        description: error.message || "Something went wrong while creating your plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Step 1: Handle the mess button - open confirmation popup
  const handleHandleTheMess = () => {
    setIsConfirmationOpen(true);
  };

  // Step 2a: User chooses "Yes, finish today"
  const handleConfirmationYes = () => {
    const constraints = calculateFinishTodayConstraints(tasks);
    setSelectedConstraints(constraints);
    setIsConfirmationOpen(false);
    setIsPlanCustomizationOpen(true);
  };

  // Step 2b: User chooses "No, let me customize"
  const handleConfirmationNo = () => {
    setIsConfirmationOpen(false);
    setIsTimeConstraintsOpen(true);
  };

  // Step 2c: User cancels confirmation
  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  // Step 3: Time constraints completed (only if user chose "No")
  const handleTimeConstraintsComplete = (data: { nBlocks: number; nPeriods: number }) => {
    setSelectedConstraints(data);
    setIsTimeConstraintsOpen(false);
    setIsPlanCustomizationOpen(true);
  };

  const handleTimeConstraintsClose = () => {
    setIsTimeConstraintsOpen(false);
  };

  // Step 4: Plan customization completed
  const handlePlanCustomizationComplete = (data: { title: string; description: string }) => {
    if (selectedConstraints) {
      const planRequest = createOverwhelmPlanRequest(
        tasks,
        selectedConstraints.nBlocks,
        selectedConstraints.nPeriods,
        data.title,
        data.description
      );
      createPlanMutation.mutate(planRequest);
    }
    // setIsPlanCustomizationOpen(false);
  };

  const handlePlanCustomizationClose = () => {
    setIsPlanCustomizationOpen(false);
    setSelectedConstraints(null);
  };

  // Computed values
  const totalHours = calculateTotalTime(tasks);
  const defaultPlanInfo = getDefaultPlanInfo(tasks);

  return {
    // State
    isConfirmationOpen,
    isTimeConstraintsOpen,
    isPlanCustomizationOpen,
    selectedConstraints,

    // Handlers
    handleHandleTheMess,
    handleConfirmationYes,
    handleConfirmationNo,
    handleConfirmationClose,
    handleTimeConstraintsComplete,
    handleTimeConstraintsClose,
    handlePlanCustomizationComplete,
    handlePlanCustomizationClose,

    // Computed values
    totalHours,
    defaultPlanInfo,

    // Mutation state
    isCreatingPlan: createPlanMutation.isPending,
  };
}
