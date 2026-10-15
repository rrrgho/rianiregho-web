import apiClient from "@/lib/api-client";
import { Gallery } from "@/types/gallery.types";
import { IAPIResponse } from "@/types/global.type";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

const endpoint = "/galleries";

/** Columns for the admin datatable (actions are added at page level). */
export const galleryColumns: ColumnDef<Gallery>[] = [
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "taken_date",
    header: "Date",
    cell: ({ row }) => {
      const value = row.getValue<string | null>("taken_date");
      return value ? formatGalleryDate(value) : "-";
    },
  },
  {
    id: "photos",
    header: "Photos",
    cell: ({ row }) => row.original.photos?.length ?? 0,
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) =>
      moment(row.getValue<string>("created_at")).format("DD MMM YYYY, HH:mm"),
  },
];

/** `2025-10-15T00:00:00.000000Z` -> "15 October 2025" (no timezone shift). */
export function formatGalleryDate(value: string) {
  return moment(value.slice(0, 10), "YYYY-MM-DD").format("D MMMM YYYY");
}

/** Local-calendar `YYYY-MM-DD` (toISOString would shift the day by timezone). */
function toLocalDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export type GalleryFormValues = {
  title: string;
  story?: string;
  taken_date?: Date;
  photos?: File[];
};

function buildFormData(values: GalleryFormValues) {
  const fd = new FormData();
  fd.append("title", values.title);
  fd.append("story", values.story ?? "");
  fd.append("taken_date", values.taken_date ? toLocalDate(values.taken_date) : "");
  (values.photos ?? []).forEach((file) => fd.append("photos", file));
  return fd;
}

// Photo uploads can be large; the client default of 10s would cut them off.
const uploadConfig = {
  headers: { "Content-Type": "multipart/form-data" },
  timeout: 0,
};

export function useGalleries(
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<IAPIResponse<Gallery>>, "queryKey" | "queryFn">
) {
  return useQuery<IAPIResponse<Gallery>>({
    queryKey: [endpoint, params],
    queryFn: async () => (await apiClient.get(endpoint, { params })).data,
    ...options,
  });
}

export function useGalleryDetail(id: string) {
  return useQuery<{ data: Gallery | null }>({
    queryKey: [endpoint, "detail", id],
    queryFn: async () => (await apiClient.get(`${endpoint}/${id}`)).data,
  });
}

export function useCreateGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: GalleryFormValues) =>
      (await apiClient.post(endpoint, buildFormData(values), uploadConfig)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [endpoint] }),
  });
}

export function useUpdateGallery(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: GalleryFormValues) =>
      (await apiClient.post(`${endpoint}/${id}`, buildFormData(values), uploadConfig)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [endpoint] }),
  });
}

export function useDeleteGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`${endpoint}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [endpoint] }),
  });
}

export function useDeleteGalleryPhoto(galleryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (photoId: string) =>
      (await apiClient.delete(`${endpoint}/${galleryId}/photos/${photoId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [endpoint] }),
  });
}
