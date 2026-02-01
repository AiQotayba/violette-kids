/** Max categories returned per content in public list (PRD: up to 3) */
export const CONTENT_CATEGORIES_LIMIT = 3;

/** Default pagination */
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/** Rate limit: requests per window (public API) */
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 min
export const RATE_LIMIT_MAX_REQUESTS = 100;

/** Game content: only youtube (video) or uploaded (PDF) */
export const GAME_SOURCE_TYPES = ["youtube", "uploaded"] as const;
export const PDF_EXTENSION = ".pdf";
export const YOUTUBE_URL_PATTERN =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

/** Upload: max file size 10MB */
export const UPLOAD_MAX_FILE_SIZE = 10 * 1024 * 1024;
/** Allowed file types for generic file upload (e.g. PDF) */
export const UPLOAD_ALLOWED_FILE_MIMES = ["application/pdf"] as const;
/** Allowed image types */
export const UPLOAD_ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;
