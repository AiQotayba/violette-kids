/**
 * نظام الألوان - متناسق مع شعار Violette Kids (همسة)
 * وردي رئيسي | أصفر ذهبي | تيل/تركواز | كريم للخلفية
 */
export const colors = {
  primary: {
    50: '#FFE4E9',
    100: '#FFC9D2',
    200: '#FFA3B3',
    300: '#FF7D94',
    400: '#FF6E89',
    500: '#E04E6C',
    600: '#C73D5A',
  },
  secondary: {
    400: '#6BD4DC',
    500: '#4BCAD4',
  },
  accent: {
    400: '#FFE07D',
    500: '#FFD95F',
  },
  neutral: {
    100: '#FFF8E1',
    200: '#F5EDD6',
    300: '#E5E7EB',
    800: '#374151',
    900: '#1F2937',
  },
  /** قصص - تيل (لون الكتاب في الشعار) */
  stories: '#4BCAD4',
  /** فيديوهات - وردي (لون النص همسة) */
  videos: '#FF6E89',
  /** ألعاب - أصفر ذهبي (النجوم في الشعار) */
  games: '#FFD95F',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

/** ألوان الثيم الفاتح (متناسقة مع الشعار) */
export const lightTheme = {
  text: colors.neutral[900],
  textSecondary: colors.neutral[800],
  foreground: colors.neutral[900],
  background: colors.neutral[100],
  card: '#FFFFFF',
  muted: colors.neutral[200],
  tint: colors.primary[400],
  tabIconDefault: colors.neutral[300],
  tabIconSelected: colors.primary[400],
  border: colors.neutral[300],
  ...colors,
} as const;

/** ألوان الثيم الداكن (نفس الهوية، قيم أغمق) */
export const darkTheme = {
  text: colors.neutral[100],
  textSecondary: colors.neutral[200],
  foreground: colors.neutral[100],
  background: colors.neutral[900],
  card: '#374151',
  muted: '#4B5563',
  tint: colors.primary[300],
  tabIconDefault: colors.neutral[300],
  tabIconSelected: colors.primary[300],
  border: '#4B5563',
  ...colors,
} as const;

export type ThemeColors = typeof lightTheme;
