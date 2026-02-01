import { api } from './client';
import type { Category } from '@/types/content';

export interface PaginatedCategories {
  data: Category[];
  total: number;
  limit: number;
  offset: number;
}

export function getCategories(params?: {
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
}): Promise<PaginatedCategories> {
  const query: Record<string, string | number | undefined> = {};
  if (params?.limit != null) query.limit = params.limit;
  if (params?.offset != null) query.offset = params.offset;
  if (params?.page != null) query.page = params.page;
  if (params?.search) query.search = params.search;
  return api.get<PaginatedCategories>('/categories', query);
}
