// Content Types
export type ContentType = "story" | "video" | "game"
export type ContentSourceType = "uploaded" | "youtube" | "external"

export interface ContentPage {
  id?: number
  pageNumber: number
  imageUrl: string
  text?: string | null
}

export interface Category {
  id: number
  name: string
  icon?: string | null
}

export interface AgeGroup {
  id: number
  label: string
  ageMin: number
  ageMax: number
}

export interface Content {
  id: number
  title: string
  description?: string | null
  type: ContentType
  ageMin: number
  ageMax: number
  thumbnailUrl?: string | null
  contentUrl?: string | null
  fileUrl?: string | null
  sourceType: ContentSourceType
  isActive: boolean
  orderIndex: number
  createdAt: string
  categories?: Category[]
  ageGroups?: AgeGroup[]
  pages?: ContentPage[]
}

export interface Admin {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface AppSetting {
  id: number
  key: string
  value: string
}

// Form Types
export interface ContentFormData {
  title: string
  description?: string
  type: ContentType
  ageMin: number
  ageMax: number
  thumbnailUrl?: string
  contentUrl?: string
  fileUrl?: string
  sourceType: ContentSourceType
  isActive: boolean
  orderIndex?: number
  categoryIds?: number[]
  ageGroupIds?: number[]
  pages?: ContentPage[]
}

export interface CategoryFormData {
  name: string
  icon?: string
}

export interface AgeGroupFormData {
  label: string
  ageMin: number
  ageMax: number
}

export interface AdminFormData {
  name: string
  email: string
  password?: string
}

export interface SettingFormData {
  key: string
  value: string
}

// Dashboard Stats
export interface DashboardStats {
  totalContent: number
  totalStories: number
  totalVideos: number
  totalGames: number
  totalCategories: number
  totalAgeGroups: number
  activeContent: number
  recentContent: Content[]
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface LoginResponse {
  token: string
  admin: Admin
}
