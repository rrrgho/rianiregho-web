export interface IAPIResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
}

export interface IPaginationParams {
  page: number;
  per_page?: number;
}

export interface IHandlePagination {
  type: "PREVIOUS" | "NEXT";
}
