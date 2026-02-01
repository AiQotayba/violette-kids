/**
 * نظام الإنجازات المحلي (بدون سيرفر)
 * التقدم يُحفظ في AsyncStorage
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // اسم أيقونة أو emoji
  unlocked: boolean;
}

export const ACHIEVEMENT_IDS = {
  FIRST_STORY: 'first_story',
  FIRST_VIDEO: 'first_video',
  FIRST_GAME: 'first_game',
  STORIES_5: 'stories_5',
  VIDEOS_3: 'videos_3',
} as const;

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: ACHIEVEMENT_IDS.FIRST_STORY, title: 'أول قصة', description: 'اقرأ أول قصة', icon: '📖', unlocked: false },
  { id: ACHIEVEMENT_IDS.FIRST_VIDEO, title: 'أول فيديو', description: 'شاهد أول فيديو', icon: '🎬', unlocked: false },
  { id: ACHIEVEMENT_IDS.FIRST_GAME, title: 'أول لعبة', description: 'العب أول لعبة', icon: '🎮', unlocked: false },
  { id: ACHIEVEMENT_IDS.STORIES_5, title: 'قارئ نشط', description: 'اقرأ 5 قصص', icon: '⭐', unlocked: false },
  { id: ACHIEVEMENT_IDS.VIDEOS_3, title: 'مشاهد نشط', description: 'شاهد 3 فيديوهات', icon: '🌟', unlocked: false },
];
