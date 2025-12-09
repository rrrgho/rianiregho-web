import apiClient from "@/lib/api-client";
import { formatDateToAPI } from "@/lib/utils";
import { IAPIResponse } from "@/types/global.type";
import { Project } from "@/types/project.types";
import {
  useMutation,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

const endpoint = "/projects";

/**
 * Defining project columns for datatable.
 * These columns will be used in the datatable component to display project data.
 */

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
 * Fetch Projects
 * This function fetches the list of projects from the API.
 */

async function fetchProjects(
  params?: Record<string, any>
): Promise<IAPIResponse<Project>> {
  const response = await apiClient.get<IAPIResponse<Project>>(endpoint, {
    params,
  });
  return response.data;
}

export function useProjects(
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<IAPIResponse<Project>>, "queryKey" | "queryFn">
) {
  return useQuery<IAPIResponse<Project>>({
    queryKey: ["projects", params],
    queryFn: () => fetchProjects(params),
    ...options,
  });
}

/**
 * Mutation Projects
 * These functions below belongs to mutation operations like create, update, delete.
 */

async function mutateProject(data: Partial<Project>) {
  // Format project_date to YYYY-MM-DD string if it's a Date object
  let formattedData = { ...data };
  if (formattedData.project_date) {
    formattedData.project_date = formatDateToAPI(
      formattedData.project_date as any
    ) as any;
  }

  // Check if image exists and create FormData
  if (formattedData.image instanceof File) {
    const formData = new FormData();

    // Append all fields except image to formData
    Object.keys(formattedData).forEach((key) => {
      if (key !== "image") {
        const value = formattedData[key as keyof typeof formattedData];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
    });

    // Append the image file
    formData.append("image", formattedData.image);

    const response = await apiClient.post<IAPIResponse<Project>>(
      endpoint,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // If no image, send as regular JSON
  const response = await apiClient.post<IAPIResponse<Project>>(
    endpoint,
    formattedData
  );
  return response.data;
}

export function useMutateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Project>) => mutateProject(data),
    onSuccess: () => {
      // Invalidate both query key formats used in the app
      queryClient.invalidateQueries({ queryKey: ["/projects"], exact: false });
    },
  });
}
