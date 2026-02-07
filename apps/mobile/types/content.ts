/**
 * أنواع المحتوى متوافقة مع openapi.yaml والـ Backend
 */
export type ContentType = 'story' | 'video' | 'game';
export type ContentSourceType = 'uploaded' | 'youtube' | 'external';

export interface CategoryItem {
  id: number;
  name: string;
  icon: string | null;
}

export interface AgeGroupItem {
  id: number;
  label: string;
  ageMin: number;
  ageMax: number;
}

export interface ContentPage {
  pageNumber: number;
  imageUrl: string;
  text: string | null;
}

export interface Content {
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
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  categories?: CategoryItem[];
  ageGroups?: AgeGroupItem[];
  pages?: ContentPage[];
}

/** شكل الاستجابة من الـ API عند وجود علاقات (مثلاً Prisma include) */
export interface ContentApiResponse extends Omit<Content, 'categories' | 'ageGroups'> {
  categories?: Array<{ category: CategoryItem }>;
  ageGroups?: Array<{ ageGroup: AgeGroupItem }>;
}

export interface PaginatedContent {
  data: Content[];
  total: number;
  limit: number;
  offset: number;
  page?: number | null;
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export interface AgeGroup {
  id: number;
  label: string;
  ageMin: number;
  ageMax: number;
}

export interface AppSetting {
  id: number;
  key: string;
  value: string;
}
