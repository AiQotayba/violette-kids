/**
 * نظام الألوان - مطابق لموقع الويب (Kids Library Theme)
 * primary: أزرق سماوي | accent: أصفر | stories/videos/games: ألوان المحتوى
 */
export const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
  },
  secondary: {
    400: '#F9A8D4',
    500: '#EC4899',
  },
  accent: {
    400: '#FACC15',
    500: '#EAB308',
  },
  neutral: {
    100: '#FAFAF9',
    200: '#F3F4F6',
    300: '#E5E7EB',
    800: '#374151',
    900: '#1F2937',
  },
  /** قصص - برتقالي */
  stories: '#EA580C',
  /** فيديوهات - بنفسجي */
  videos: '#8B5CF6',
  /** ألعاب - أخضر */
  games: '#22C55E',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

/** ألوان الثيم الفاتح (مطابق للموقع) */
export const lightTheme = {
  text: colors.neutral[900],
  textSecondary: colors.neutral[800],
  foreground: colors.neutral[900],
  background: colors.neutral[100],
  card: '#FFFFFF',
  muted: colors.neutral[200],
  tint: colors.primary[500],
  tabIconDefault: colors.neutral[300],
  tabIconSelected: colors.primary[500],
  border: colors.neutral[300],
  ...colors,
} as const;

/** ألوان الثيم الداكن (مطابق للموقع) */
export const darkTheme = {
  text: colors.neutral[100],
  textSecondary: colors.neutral[200],
  foreground: colors.neutral[100],
  background: colors.neutral[900],
  card: '#374151',
  muted: '#4B5563',
  tint: colors.primary[400],
  tabIconDefault: colors.neutral[300],
  tabIconSelected: colors.primary[400],
  border: '#4B5563',
  ...colors,
} as const;

export type ThemeColors = typeof lightTheme;
