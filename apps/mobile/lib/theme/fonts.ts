/**
 * الخطوط - Violette Kids (حسب mobile-PRD)
 * عناوين: Bold | نصوص: Regular | أرقام: Medium
 * Rubik أو Cairo للعربية
 */
export const fontFamily = {
  heading: 'System', // استبدل بـ Rubik-Bold أو Cairo-Bold عند إضافة الخطوط
  body: 'System',
  numeric: 'System',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
