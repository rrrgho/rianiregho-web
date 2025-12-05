import apiClient from "@/lib/api-client";
import { IAPIResponse } from "@/types/global.type";
import { Project } from "@/types/project.types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

export const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "project_date",
    header: "Project Start",
    cell: ({ row }) => {
      const value = row.getValue<string>("project_date");
      return moment(value).format("MMMM YYYY");
    },
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) => {
      const value = row.getValue<string>("created_at");
      return moment(value).format("DD MMM YYYY, HH:mm");
    },
  },
];

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
