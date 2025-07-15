import { PaginatedResult } from '../models/commons/paginated-result.model';

export function getPaginatedFallback<T>(page = 1, pageSize = 20): PaginatedResult<T> {
  return {
    items: [],
    page,
    pageSize,
    totalItems: 0,
  };
}
