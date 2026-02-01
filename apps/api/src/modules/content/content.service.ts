import type { ContentType, ContentSourceType } from "@prisma/client";
import { contentRepository } from "./content.repository.js";
import type { ContentPublicItem, ContentPublicDetail, ContentListQuery, PaginatedResult } from "./content.types.js";
import { YOUTUBE_URL_PATTERN, PDF_EXTENSION, GAME_SOURCE_TYPES } from "../../config/constants.js";

function mapCategories(
  raw: { category: { id: number; name: string; icon: string | null } }[]
): ContentPublicItem["categories"] {
  return raw.map((c) => ({ id: c.category.id, name: c.category.name, icon: c.category.icon }));
}

function mapAgeGroups(
  raw: { ageGroup: { id: number; label: string; ageMin: number; ageMax: number } }[]
): ContentPublicItem["ageGroups"] {
  return raw.map((g) => ({
    id: g.ageGroup.id,
    label: g.ageGroup.label,
    ageMin: g.ageGroup.ageMin,
    ageMax: g.ageGroup.ageMax,
  }));
}

function parseAgeFilter(age?: string): { ageMin?: number; ageMax?: number } {
  if (!age?.trim()) return {};
  const match = age.trim().match(/^(\d+)-(\d+)$/);
  if (!match) return {};
  const ageMin = parseInt(match[1], 10);
  const ageMax = parseInt(match[2], 10);
  if (Number.isNaN(ageMin) || Number.isNaN(ageMax) || ageMin > ageMax) return {};
  return { ageMin: ageMax, ageMax: ageMin };
}

function parseCategoryFilter(category?: string): number[] {
  if (!category?.trim()) return [];
  return category
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

export function validateGameContent(data: {
  type: ContentType;
  sourceType: ContentSourceType;
  contentUrl?: string | null;
  fileUrl?: string | null;
}): string | null {
  if (data.type !== "game") return null;
  const { sourceType, contentUrl, fileUrl } = data;
  if (!GAME_SOURCE_TYPES.includes(sourceType as "youtube" | "uploaded")) {
    return "Game content must have sourceType 'youtube' or 'uploaded'";
  }
  if (sourceType === "uploaded") {
    if (!fileUrl?.trim()) return "fileUrl is required for game with sourceType uploaded";
    if (!fileUrl.toLowerCase().endsWith(PDF_EXTENSION)) return "fileUrl must be a valid PDF for sourceType uploaded";
    return null;
  }
  if (sourceType === "youtube") {
    if (!contentUrl?.trim()) return "contentUrl is required for game with sourceType youtube";
    if (!YOUTUBE_URL_PATTERN.test(contentUrl.trim())) return "contentUrl must be a valid YouTube URL for sourceType youtube";
    return null;
  }
  return null;
}

export const contentService = {
  async getListPublic(query: ContentListQuery): Promise<PaginatedResult<ContentPublicItem>> {
    const { age, type, category, limit = 10, offset = 0, page, search } = query;
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safeOffset = page != null ? (Math.max(1, page) - 1) * safeLimit : Math.max(0, offset);
    const { ageMin, ageMax } = parseAgeFilter(age);
    const categoryIds = parseCategoryFilter(category);

    const result = await contentRepository.findManyPublic({
      ageMin,
      ageMax,
      type: type ?? undefined,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      limit: safeLimit,
      offset: safeOffset,
      search: search?.trim() || undefined,
    });

    const data: ContentPublicItem[] = result.data.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      ageMin: row.ageMin,
      ageMax: row.ageMax,
      thumbnailUrl: row.thumbnailUrl,
      contentUrl: row.contentUrl,
      fileUrl: row.fileUrl,
      sourceType: row.sourceType,
      orderIndex: row.orderIndex,
      categories: mapCategories(row.categories),
      ageGroups: mapAgeGroups(row.ageGroups),
    }));

    return {
      data,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      page: page != null ? Math.max(1, page) : undefined,
    };
  },

  async getByIdPublic(id: number): Promise<ContentPublicDetail | null> {
    const row = await contentRepository.findByIdPublic(id);
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      ageMin: row.ageMin,
      ageMax: row.ageMax,
      thumbnailUrl: row.thumbnailUrl,
      contentUrl: row.contentUrl,
      fileUrl: row.fileUrl,
      sourceType: row.sourceType,
      orderIndex: row.orderIndex,
      categories: mapCategories(row.categories),
      ageGroups: mapAgeGroups(row.ageGroups),
      pages: row.pages?.map((p) => ({ pageNumber: p.pageNumber, imageUrl: p.imageUrl, text: p.text })) ?? [],
    };
  },

  async getListAdmin(query: ContentListQuery) {
    const { type, category, limit = 10, offset = 0, page, search } = query;
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safeOffset = page != null ? (Math.max(1, page) - 1) * safeLimit : Math.max(0, offset);
    const categoryIds = parseCategoryFilter(category);
    return contentRepository.findManyAdmin({
      type: type ?? undefined,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      limit: safeLimit,
      offset: safeOffset,
      search: search?.trim() || undefined,
    });
  },

  async getByIdAdmin(id: number) {
    return contentRepository.findByIdAdmin(id);
  },

  async create(data: Parameters<typeof contentRepository.create>[0]) {
    const err = validateGameContent({
      type: data.type,
      sourceType: data.sourceType,
      contentUrl: data.contentUrl,
      fileUrl: data.fileUrl,
    });
    if (err) throw new Error(err);
    return contentRepository.create(data);
  },

  async update(id: number, data: Parameters<typeof contentRepository.update>[1]) {
    const existing = await contentRepository.findByIdAdmin(id);
    if (!existing) return null;
    const err = validateGameContent({
      type: data.type ?? existing.type,
      sourceType: data.sourceType ?? existing.sourceType,
      contentUrl: data.contentUrl ?? existing.contentUrl,
      fileUrl: data.fileUrl ?? existing.fileUrl,
    });
    if (err) throw new Error(err);
    return contentRepository.update(id, data);
  },

  async delete(id: number) {
    return contentRepository.delete(id);
  },
};
