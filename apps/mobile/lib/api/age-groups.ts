import { api } from './client';
import type { AgeGroup } from '@/types/content';

export interface PaginatedAgeGroups {
  data: AgeGroup[];
  total: number;
  limit: number;
  offset: number;
}

export function getAgeGroups(params?: {
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
}): Promise<PaginatedAgeGroups> {
  const query: Record<string, string | number | undefined> = {};
  if (params?.limit != null) query.limit = params.limit;
  if (params?.offset != null) query.offset = params.offset;
  if (params?.page != null) query.page = params.page;
  if (params?.search) query.search = params.search;
  return api.get<PaginatedAgeGroups>('/age-groups', query);
}
