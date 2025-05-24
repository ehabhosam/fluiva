import api from "@/lib/api";
import { UserProfile, UserUpsertResponse } from "./types";

/**
 * User API client for handling user-related operations
 */
export const userApi = {
  /**
   * Retrieves the profile information of the authenticated user
   * @returns Promise containing the user profile data
   */
  getUserProfile: (): Promise<UserProfile> => {
    return api.get("/user/profile");
  },

  /**
   * Creates a new user record or updates an existing one based on the authenticated user
   * @returns Promise containing the created/updated user data
   */
  upsertUser: (): Promise<UserUpsertResponse> => {
    return api.post("/user/upsert");
  },
};

export default userApi;
