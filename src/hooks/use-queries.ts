"use client";

import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

/**
 * Generic useQuery hook - provide any endpoint
 */
export function useFetch(
  endpoint: string,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const { data } = await apiClient.get(endpoint);
      return data;
    },
    ...options,
  });
}

/**
 * Generic useMutation hook for POST requests
 */
export function usePostMutation<TData = unknown, TPayload = unknown>(
  endpoint: string,
  options?: UseMutationOptions<TData, unknown, TPayload>
) {
  return useMutation<TData, unknown, TPayload>({
    mutationFn: async (payload: TPayload) => {
      const { data } = await apiClient.post<TData>(endpoint, payload);
      return data;
    },
    ...options,
  });
}

/**
 * Generic useMutation hook for PUT/PATCH requests
 */
export function useUpdateMutation<TData = unknown, TPayload = unknown>(
  endpoint: string,
  method: "put" | "patch" = "put",
  options?: UseMutationOptions<TData, unknown, TPayload>
) {
  return useMutation<TData, unknown, TPayload>({
    mutationFn: async (payload: TPayload) => {
      const { data } = await apiClient[method]<TData>(endpoint, payload);
      return data;
    },
    ...options,
  });
}

/**
 * Generic useMutation hook for DELETE requests
 */
export function useDeleteMutation<TData = unknown>(
  endpoint: string,
  options?: UseMutationOptions<TData, unknown, void>
) {
  return useMutation<TData, unknown, void>({
    mutationFn: async () => {
      const { data } = await apiClient.delete<TData>(endpoint);
      return data;
    },
    ...options,
  });
}
