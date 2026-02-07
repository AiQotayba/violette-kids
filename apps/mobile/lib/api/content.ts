import { api } from './client';
import type { Content, ContentApiResponse, PaginatedContent } from '@/types/content';

function normalizeContent(raw: ContentApiResponse): Content {
  const { categories: rawCategories, ageGroups: rawAgeGroups, ...rest } = raw;
  const categories = rawCategories?.map((c) => c.category);
  const ageGroups = rawAgeGroups?.map((a) => a.ageGroup);
  return { ...rest, categories, ageGroups };
}

export interface ContentListParams {
  age?: string;
  type?: 'story' | 'video' | 'game';
  category?: string;
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
}

export function getContentList(params?: ContentListParams): Promise<PaginatedContent> {
  const query: Record<string, string | number | undefined> = {};
  if (params?.age) query.age = params.age;
  if (params?.type) query.type = params.type;
  if (params?.category) query.category = params.category;
  if (params?.limit != null) query.limit = params.limit;
  if (params?.offset != null) query.offset = params.offset;
  if (params?.page != null) query.page = params.page;
  if (params?.search) query.search = params.search;
  return api.get<PaginatedContent>('/content', query);
}

export function getContentById(id: number): Promise<Content> {
  return api.get<ContentApiResponse>(`/content/${id}`).then(normalizeContent);
}
