import api from "./index";
import {
  PlanSummary,
  PlanDetail,
  GeneratePlanRequest,
  GeneratePlanResponse,
  UpdatePlanRequest,
  ReorderPeriodsRequest,
  MoveBlockRequest,
  ReorderBlocksRequest,
  CompleteBlockRequest,
  Period,
  Block,
} from "./types";

export const planApi = {
  /**
   * Get all plans for the current user
   */
  getUserPlans: (): Promise<PlanSummary[]> => {
    return api.get("/plan");
  },

  /**
   * Get detailed plan information by ID
   * @param id - Plan ID
   */
  getPlanDetails: (id: number): Promise<PlanDetail> => {
    return api.get(`/plan/${id}`);
  },

  /**
   * Create a new plan with auto-generated periods and blocks
   * @param planData - Plan generation data
   */
  generatePlan: (
    planData: GeneratePlanRequest,
  ): Promise<GeneratePlanResponse> => {
    return api.post("/plan", planData);
  },

  /**
   * Update plan metadata
   * @param id - Plan ID
   * @param data - Updated plan data
   */
  updatePlan: (id: number, data: UpdatePlanRequest): Promise<PlanDetail> => {
    return api.post(`/plan/${id}`, data);
  },

  /**
   * Reorder periods within a plan
   * @param data - Period reorder information
   */
  reorderPeriods: (data: ReorderPeriodsRequest): Promise<Period[]> => {
    return api.post("/plan/reorder-periods", data);
  },

  /**
   * Move a block to a different period or position
   * @param data - Block move information
   */
  moveBlock: (data: MoveBlockRequest): Promise<Block> => {
    return api.post("/plan/move-block", data);
  },

  /**
   * Reorder blocks within a period
   * @param data - Block reorder information
   */
  reorderBlocks: (data: ReorderBlocksRequest): Promise<Block[]> => {
    return api.post("/plan/reorder-blocks", data);
  },

  /**
   * Mark a block as completed or incomplete
   * @param data - Block completion information
   */
  completeBlock: (data: CompleteBlockRequest): Promise<Block> => {
    return api.post("/plan/complete-block", data);
  },
};

export default planApi;
