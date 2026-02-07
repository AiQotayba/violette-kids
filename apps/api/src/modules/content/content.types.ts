/** Content type enum (matches Prisma schema) */
export type ContentType = "story" | "video" | "game";
/** Content source type (matches Prisma schema) */
export type ContentSourceType = "uploaded" | "youtube" | "external";

/** Category summary (up to 3 per content in public list) */
export interface ContentCategoryItem {
  id: number;
  name: string;
  icon: string | null;
}

/** Age group summary */
export interface ContentAgeGroupItem {
  id: number;
  label: string;
  ageMin: number;
  ageMax: number;
}

/** Game content: either YouTube video or uploaded PDF only (PRD) */
export type GameContent =
  | { sourceType: "youtube"; contentUrl: string }
  | { sourceType: "uploaded"; fileUrl: string };

export interface ContentPublicItem {
  id: number;
  title: string;
  description: string | null;
  type: ContentType;
  ageMin: number;
  ageMax: number;
  thumbnailUrl: string | null;
  contentUrl: string | null;
  fileUrl: string | null;
  sourceType: ContentSourceType;
  orderIndex: number;
  categories: ContentCategoryItem[];
  ageGroups: ContentAgeGroupItem[];
}

export interface ContentPublicDetail extends ContentPublicItem {}

export interface ContentListQuery {
  age?: string;
  type?: ContentType;
  category?: string;
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  page?: number;
}
