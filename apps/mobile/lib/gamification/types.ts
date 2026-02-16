/**
 * نموذج بيانات الـ Gamification (محلي أولاً)
 * متوافق مع docs/GAMIFICATION-ARCHITECTURE.md
 */

export type ContentType = 'story' | 'video' | 'game';

export interface ContentCompletion {
  contentType: ContentType;
  contentId: string;
  completedAt: string;
}

/** إنجاز كما يُخزَّن مع تاريخ الفتح */
export interface StoredAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

/** حالة الـ Gamification الكاملة في التخزين */
export interface GamificationState {
  points: number;
  level: number;
  completions: ContentCompletion[];
  achievements: StoredAchievement[];
}

export interface RecordCompletionResult {
  pointsEarned: number;
  levelUp: boolean;
  achievementsUnlocked: StoredAchievement[];
  alreadyCompleted: boolean;
}
