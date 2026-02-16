/**
 * نظام الشارات المحفّزة — 20 شارة بتدرّج ذكي
 * التقدم يُحفظ في AsyncStorage
 * مصمم ليشعر الطفل أنه بطل في رحلة، وليس عدّاد مهام
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const ACHIEVEMENT_IDS = {
  // المرحلة ١: بداية الرحلة
  FIRST_STEP: 'first_step',
  STRONG_START: 'strong_start',
  ON_THE_RIGHT_PATH: 'on_the_right_path',
  LITTLE_LEARNER: 'little_learner',
  // المرحلة ٢: حب الاستكشاف
  STORY_FRIEND: 'story_friend',
  VIDEO_LOVER: 'video_lover',
  GAMES_LOVER: 'games_lover',
  NEW_EXPLORER: 'new_explorer',
  // المرحلة ٣: بناء الثقة
  ACTIVE_LEARNER: 'active_learner',
  SMART_MIND: 'smart_mind',
  LEVEL_TWO: 'level_two',
  LITTLE_CHAMPION: 'little_champion',
  // المرحلة ٤: التميز
  DISTINGUISHED_READER: 'distinguished_reader',
  DISTINGUISHED_VIEWER: 'distinguished_viewer',
  DISTINGUISHED_PLAYER: 'distinguished_player',
  LEARNING_STAR: 'learning_star',
  // المرحلة ٥: الإنجازات الكبيرة
  LEARNING_CHAMPION: 'learning_champion',
  VIOLETTE_STAR: 'violette_star',
  LITTLE_LEGEND: 'little_legend',
  GREAT_VIOLETTE_CHAMPION: 'great_violette_champion',
  // القمة: أسطورة Violette
  VIOLETTE_LEGEND: 'violette_legend',
} as const;

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // 🟢 المرحلة ١
  { id: ACHIEVEMENT_IDS.FIRST_STEP, title: 'الخطوة الأولى', description: 'أكمل أول قصة أو فيديو أو لعبة', icon: '🌟', unlocked: false },
  { id: ACHIEVEMENT_IDS.STRONG_START, title: 'بداية قوية', description: 'أكمل 3 محتويات', icon: '🚀', unlocked: false },
  { id: ACHIEVEMENT_IDS.ON_THE_RIGHT_PATH, title: 'في الطريق الصحيح', description: 'أكمل 5 محتويات', icon: '🎯', unlocked: false },
  { id: ACHIEVEMENT_IDS.LITTLE_LEARNER, title: 'متعلم صغير', description: 'اجمع 50 نقطة', icon: '✨', unlocked: false },
  // 🔵 المرحلة ٢
  { id: ACHIEVEMENT_IDS.STORY_FRIEND, title: 'صديق القصص', description: 'أكمل 5 قصص', icon: '📚', unlocked: false },
  { id: ACHIEVEMENT_IDS.VIDEO_LOVER, title: 'محب الفيديو', description: 'أكمل 5 فيديوهات', icon: '🎬', unlocked: false },
  { id: ACHIEVEMENT_IDS.GAMES_LOVER, title: 'محب الألعاب', description: 'أكمل 5 ألعاب', icon: '🎮', unlocked: false },
  { id: ACHIEVEMENT_IDS.NEW_EXPLORER, title: 'مستكشف جديد', description: 'أكمل 10 محتويات', icon: '🧭', unlocked: false },
  // 🟣 المرحلة ٣
  { id: ACHIEVEMENT_IDS.ACTIVE_LEARNER, title: 'متعلم نشيط', description: 'أكمل 15 محتوى', icon: '🔥', unlocked: false },
  { id: ACHIEVEMENT_IDS.SMART_MIND, title: 'عقل ذكي', description: 'اجمع 100 نقطة', icon: '💡', unlocked: false },
  { id: ACHIEVEMENT_IDS.LEVEL_TWO, title: 'المستوى الثاني', description: 'وصلت إلى المستوى الثاني', icon: '⭐', unlocked: false },
  { id: ACHIEVEMENT_IDS.LITTLE_CHAMPION, title: 'بطل صغير', description: 'أكمل 20 محتوى', icon: '🏅', unlocked: false },
  // 🟡 المرحلة ٤
  { id: ACHIEVEMENT_IDS.DISTINGUISHED_READER, title: 'قارئ مميز', description: 'أكمل 20 قصة', icon: '📖', unlocked: false },
  { id: ACHIEVEMENT_IDS.DISTINGUISHED_VIEWER, title: 'مشاهد مميز', description: 'أكمل 20 فيديو', icon: '🎥', unlocked: false },
  { id: ACHIEVEMENT_IDS.DISTINGUISHED_PLAYER, title: 'لاعب مميز', description: 'أكمل 20 لعبة', icon: '🕹️', unlocked: false },
  { id: ACHIEVEMENT_IDS.LEARNING_STAR, title: 'نجم التعلم', description: 'اجمع 200 نقطة', icon: '⚡', unlocked: false },
  // 🔴 المرحلة ٥
  { id: ACHIEVEMENT_IDS.LEARNING_CHAMPION, title: 'بطل التعلم', description: 'أكمل 30 محتوى', icon: '👑', unlocked: false },
  { id: ACHIEVEMENT_IDS.VIOLETTE_STAR, title: 'النجم المتألق', description: 'وصلت إلى المستوى الخامس', icon: '🌈', unlocked: false },
  { id: ACHIEVEMENT_IDS.LITTLE_LEGEND, title: 'أسطورة صغيرة', description: 'اجمع 300 نقطة', icon: '🏆', unlocked: false },
  { id: ACHIEVEMENT_IDS.GREAT_VIOLETTE_CHAMPION, title: 'البطل العظيم', description: 'أكمل 50 محتوى', icon: '💎', unlocked: false },
  // القمة
  { id: ACHIEVEMENT_IDS.VIOLETTE_LEGEND, title: 'الأسطورة الكبرى', description: 'وصلت إلى أعلى مستوى وأصبحت بطل التعلم الحقيقي', icon: '💠', unlocked: false },
];
