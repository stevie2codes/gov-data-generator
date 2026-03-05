// ─── Pagination helpers ─────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  pageSize: number;
  isPaginated: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function parsePaginationParams(
  query: Record<string, unknown>
): PaginationParams {
  const page = Math.max(parseInt(query.page as string) || 1, 1);
  const pageSize = Math.min(
    Math.max(parseInt(query.pageSize as string) || 50, 1),
    100
  );
  const isPaginated = query.page !== undefined || query.pageSize !== undefined;
  return { page, pageSize, isPaginated };
}

export function paginateData<T>(
  data: T[],
  params: PaginationParams
): { items: T[]; meta: PaginationMeta } {
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / params.pageSize) || 1;
  const currentPage = Math.min(params.page, totalPages);
  const start = (currentPage - 1) * params.pageSize;
  const items = data.slice(start, start + params.pageSize);

  return {
    items,
    meta: {
      currentPage,
      pageSize: params.pageSize,
      totalPages,
      totalRecords,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  };
}
