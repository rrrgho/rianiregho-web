import apiClient from "@/lib/api-client";
import { ApiTokenRequestResponse } from "@/types/auth.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * OAuth User mutation
 * Sends GitHub email to backend to validate/create user and get bearer token
 */

async function validateUser(email: string): Promise<ApiTokenRequestResponse> {
  const response = await apiClient.post<ApiTokenRequestResponse>(
    "/oauth/user",
    {
      email,
    }
  );
  return response.data;
}

export function useOAuthUser(
  options?: Omit<
    UseMutationOptions<
      ApiTokenRequestResponse,
      AxiosError<{ message: string }>,
      string
    >,
    "mutationFn"
  >
) {
  return useMutation({
    mutationFn: validateUser,
    ...options,
  });
}
