import api from "./index";
import { TimeConstraintsRequest, TimeConstraintsResponse } from "./types";

export const plannerApi = {
  /**
   * Get time constraints for plan generation
   * @param data - Tasks and routines information
   */
  getTimeConstraints: (
    data: TimeConstraintsRequest,
  ): Promise<TimeConstraintsResponse> => {
    return api.post("/planner/time-constraints", { data });
  },
};

export default plannerApi;
