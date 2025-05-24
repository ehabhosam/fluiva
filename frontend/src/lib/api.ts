import { VITE_API_URL } from "@/config/constants";
import { ApiError } from "../api/types";
import { supabase } from "./supabase";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  data?: any;
  headers?: HeadersInit;
}

class Api {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: RequestMethod = "GET",
    options: RequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { data, headers = {} } = options;
    const { data: supabaseData } = await supabase.auth.getSession();
    const accessToken = supabaseData.session?.access_token;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    };

    if (data && (method === "POST" || method === "PUT")) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = (await response.json()) as ApiError;
      throw errorData;
    }

    // For GET requests with query parameters
    if (method === "GET" && data) {
      const queryParams = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        queryParams.append(key, JSON.stringify(value));
      });
      const queryUrl = `${url}?${queryParams.toString()}`;
      const queryResponse = await fetch(queryUrl, {
        ...fetchOptions,
        method: "GET", // Ensure method is GET
        body: undefined, // Remove body for GET requests
      });

      if (!queryResponse.ok) {
        const errorData = (await queryResponse.json()) as ApiError;
        throw errorData;
      }

      return queryResponse.json();
    }

    return response.json();
  }

  get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, "GET", options);
  }

  post<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", { ...options, data });
  }

  put<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", { ...options, data });
  }

  delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, "DELETE", options);
  }
}

const api = new Api(VITE_API_URL || "http://localhost:3000");
export default api;
