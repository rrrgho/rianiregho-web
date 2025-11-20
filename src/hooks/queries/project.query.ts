import apiClient from "@/lib/api-client";
import { IAPIResponse } from "@/types/global.type";
import { Project } from "@/types/project.types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

/**
 * Fetching projects Data from API.
 */

async function fetchProjects(
  params?: Record<string, any>
): Promise<IAPIResponse<Project>> {
  const response = await apiClient.get<IAPIResponse<Project>>("/projects", {
    params,
  });
  return response.data;
}

export function useProjects(
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<IAPIResponse<Project>>, "queryKey" | "queryFn">
) {
  return useQuery<IAPIResponse<Project>>({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(params),
    ...options,
  });
}

// export function useProjectDetail(
//   project_uid: string,
//   options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">
// ) {
//   return useFetch(`/projects/${project_uid}`, options);
// }
