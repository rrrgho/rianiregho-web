import { UseQueryOptions } from "@tanstack/react-query";
import { useFetch } from "../use-queries";

export interface ProjectProperties {
  uid: string;
  name: string;
  description: string;
  project_link: string;
  tech_stack: string;
  role: string;
  github_link: string;
  is_private_project: boolean;
  image: string;
  project_date: string;
  created_at: string;
  updated_at: string;
}

export function useProjects(
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">
) {
  return useFetch("/projects", options);
}

export function useProjectDetail(
  project_uid: string,
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">
) {
  return useFetch(`/projects/${project_uid}`, options);
}
