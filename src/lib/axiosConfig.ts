import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// Type for the error response
interface ErrorResponse {
  response?: {
    status: number;
  };
}

const axiosConfig = async (): Promise<void> => {
  // Set base URL with fallback for build time
  axios.defaults.baseURL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:8000");

  // Enable credentials to send HTTP-only cookies
  axios.defaults.withCredentials = true;

  // No need for request interceptor since backend uses HTTP-only cookies

  // ✅ Response interceptor for handling auth errors
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ErrorResponse>) => {
      const isLoggedOut = useAuthStore.getState().isLoggedOut;

      if (error.response?.status === 401 && !isLoggedOut) {
        useAuthStore.getState().setIsLoggedOut(true);
        toast.error("Session expired");
        window.location.href = "/login";
        useAuthStore.getState().logout();
        return Promise.reject("Unauthorized");
      }

      return Promise.reject(error);
    }
  );
};

export default axiosConfig;
