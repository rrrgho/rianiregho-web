import apiClient from "@/lib/api-client";
import { IAPIResponse } from "@/types/global.type";
import { ProjectGallery } from "@/types/project.types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

async function fetchProjectGalleries(
  project_id: string,
  params?: Record<string, any>
): Promise<IAPIResponse<ProjectGallery>> {
  const response = await apiClient.get(`/projects/${project_id}/gallery`, {
    params,
  });
  return response.data;
}

export function useProjectGaleries(
  project_id: string,
  params?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<IAPIResponse<ProjectGallery>>,
    "queryFn" | "queryKey"
  >
) {
  return useQuery({
    queryKey: ["project_galeries", project_id],
    queryFn: () => fetchProjectGalleries(project_id, params),
    ...options,
  });
}

async function mutateProjectGallery(
  data: Partial<{ image: File | any; project_id: string }>
): Promise<IAPIResponse<any>> {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key !== "image") {
      const value = data[key as keyof typeof data];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }
  });

  // Append the image file
  formData.append("image", data.image);
  const response = await apiClient.post(
    `/projects/${data.project_id}/gallery`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export function useMutateProjectGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<{ image: File | any; project_id: string }>) =>
      mutateProjectGallery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project_galeries"],
        exact: false,
      });
    },
  });
}
