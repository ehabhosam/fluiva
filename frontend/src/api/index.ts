import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { supabase } from "../supabaseClient";

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token from Supabase
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data } = await supabase.auth.getSession();

    if (data.session?.access_token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default api;
