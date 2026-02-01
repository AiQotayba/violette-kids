/**
 * ألوان التطبيق - متوافقة مع الثيم في lib/theme
 */
import { lightTheme, darkTheme } from '@/lib/theme';

export default {
  light: {
    text: lightTheme.text,
    background: lightTheme.background,
    tint: lightTheme.tint,
    tabIconDefault: lightTheme.tabIconDefault,
    tabIconSelected: lightTheme.tabIconSelected,
  },
  dark: {
    text: darkTheme.text,
    background: darkTheme.background,
    tint: darkTheme.tint,
    tabIconDefault: darkTheme.tabIconDefault,
    tabIconSelected: darkTheme.tabIconSelected,
  },
};
