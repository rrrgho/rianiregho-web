"use client";

import { IPaginationParams } from "@/types/global.type";
import { ColumnDef } from "@tanstack/react-table";
import { IAPIResponse } from "@/types/global.type";
import apiClient from "../api-client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorState } from "@/components/error-state";
import TableSkeleton from "@/components/table-skeleton";
import { DataTable } from "@/components/data-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  endpoint: string;
  onRowClick?: (row: TData) => void;
}

async function fetchData(
  endpoint: string,
  params: IPaginationParams | any
): Promise<IAPIResponse<any>> {
  const response = await apiClient.get<IAPIResponse<any>>(endpoint, { params });
  return response.data;
}

function useQueryData(
  endpoint: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<IAPIResponse<any>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [endpoint, params],
    queryFn: () => fetchData(endpoint, params),
    ...options,
  });
}

function AppDatatable<TData, TValue>({
  columns,
  endpoint,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [params, setParams] = useState<IPaginationParams>({
    page: 1,
    per_page: 10,
  });
  const response = useQueryData(endpoint, params);
  const { data, isLoading, error, refetch } = response;
  return (
    <>
      {error && <ErrorState onRetry={refetch} />}
      {isLoading && <TableSkeleton />}
      {!isLoading && !error && (
        <DataTable
          isLoading={isLoading}
          columns={columns}
          params={params}
          setParams={setParams}
          data={data?.data}
          total={data?.total}
          last_page={data?.last_page}
          onRowClick={onRowClick}
        />
      )}
    </>
  );
}

export default AppDatatable;
