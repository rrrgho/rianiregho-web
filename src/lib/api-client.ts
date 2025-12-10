import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

/**
 * Create axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available (from sessionStorage or localStorage)
    let token: string | null = null;

    if (typeof window !== "undefined") {
      // First try sessionStorage (set during OAuth validation)
      token = sessionStorage.getItem("bearerToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: unknown) => {
    const axiosError = error as AxiosError;

    if (axiosError) {
      console.error("API Error:", axiosError);
    }

    // Handle specific error cases
    if (axiosError.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("bearerToken");
        document.cookie = "authToken=; path=/; max-age=0";
        // Redirect to admin login if on admin page, otherwise to home
        const path = window.location.pathname;
        if (path.startsWith("/administrator")) {
          window.location.href = "/login";
        } else {
          window.location.href = "/login";
        }
      }
    }

    if (axiosError.response?.status === 403) {
      toast("Forbiden Access !", {
        description: "Please logout and relogin to continue.",
      });
    } else if (axiosError.response?.status === 404) {
      toast("API Not Found !", {
        description: "Please contact developer for more information.",
      });
    } else if (axiosError.response && axiosError.response.status >= 500) {
      toast("Something went wrong !", {
        description: "Please contact developer for more information.",
      });
    } else {
      toast("Something went wrong !", {
        description: "Please contact developer for more information.",
      });
    }

    return Promise.reject(axiosError);
  }
);

export default apiClient;
