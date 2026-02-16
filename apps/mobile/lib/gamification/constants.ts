/**
 * ثوابت قواعد النقاط والمستوى — قابلة للتعديل
 * متوافق مع docs/GAMIFICATION-ARCHITECTURE.md
 */

import type { ContentType } from './types';

/** نقاط مكتسبة عند إكمال كل نوع محتوى */
export const POINTS: Record<ContentType, number> = {
  story: 10,
  video: 5,
  game: 15,
};

/**
 * عتبات النقاط للمستويات (تراكمي).
 * المستوى 1 = 0–49، المستوى 2 = 50–119، المستوى 3 = 120–199، ...
 */
export const LEVEL_THRESHOLDS = [0, 50, 120, 200, 300, 450, 600, 800, 1000, 1500];

/** مفتاح التخزين المحلي */
export const GAMIFICATION_STORAGE_KEY = '@violette_gamification_state';
