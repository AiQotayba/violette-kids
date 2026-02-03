/**
 * ألوان التطبيق - متوافقة مع الثيم في lib/theme
 * شريط التبويبات: لون بنفسجي للعنصر النشط، خلفية بيضاء/بنفسجي داكن
 */
import { lightTheme, darkTheme } from '@/lib/theme';

/** لون التبويب النشط في الشريط */
const TAB_BAR_ACCENT = '#8B5CF6';
/** خلفية شريط التبويبات في الوضع الداكن (رمادي داكن) */
const TAB_BAR_DARK_BG = '#2D2D2D';
/** خلفية الحبة النشطة: أزرق صلب (مطابق للصورة) */
const TAB_BAR_ACTIVE_PILL_BG = '#3B82F6';
/** لون الأيقونة والنص على الحبة النشطة (أبيض) */
const TAB_BAR_ACTIVE_PILL_TINT = '#FFFFFF';
/** خلفية عنصر غير نشط (فاتح) - فصل بسيط */
const TAB_BAR_INACTIVE_PILL_LIGHT = 'rgba(0,0,0,0.06)';
/** خلفية عنصر غير نشط (داكن) - أغمق قليلاً من الشريط */
const TAB_BAR_INACTIVE_PILL_DARK = 'rgba(255,255,255,0.08)';

/** خلفية شريط الهيدر وحبة النقاط */
const HEADER_BAR_BG_LIGHT = 'rgba(255,255,255,0.85)';
const HEADER_BAR_BG_DARK = 'rgba(45,45,45,0.95)';
const POINTS_PILL_BG_LIGHT = 'rgba(59,130,246,0.12)';
const POINTS_PILL_BG_DARK = 'rgba(96,165,250,0.18)';
const POINTS_PILL_STAR = TAB_BAR_ACTIVE_PILL_BG;

export default {
  light: {
    text: lightTheme.text,
    background: lightTheme.background,
    tint: lightTheme.tint,
    tabIconDefault: '#5B5B5B',
    tabIconSelected: lightTheme.tabIconSelected,
    tabBarAccent: TAB_BAR_ACCENT,
    tabBarBackground: '#FFFFFF',
    tabBarActiveBackground: 'transparent',
    tabBarActivePillBackground: TAB_BAR_ACTIVE_PILL_BG,
    tabBarActivePillTint: TAB_BAR_ACTIVE_PILL_TINT,
    tabBarInactivePillBackground: TAB_BAR_INACTIVE_PILL_LIGHT,
    tabBarBaseline: lightTheme.tabIconDefault,
    headerBarBg: HEADER_BAR_BG_LIGHT,
    headerBorder: lightTheme.border,
    pointsPillBg: POINTS_PILL_BG_LIGHT,
    pointsPillStar: POINTS_PILL_STAR,
  },
  dark: {
    text: darkTheme.text,
    background: darkTheme.background,
    tint: darkTheme.tint,
    tabIconDefault: 'rgba(255,255,255,0.7)',
    tabIconSelected: darkTheme.tabIconSelected,
    tabBarAccent: TAB_BAR_ACCENT,
    tabBarBackground: TAB_BAR_DARK_BG,
    tabBarActiveBackground: 'transparent',
    tabBarActivePillBackground: TAB_BAR_ACTIVE_PILL_BG,
    tabBarActivePillTint: TAB_BAR_ACTIVE_PILL_TINT,
    tabBarInactivePillBackground: TAB_BAR_INACTIVE_PILL_DARK,
    tabBarBaseline: 'rgba(255,255,255,0.25)',
    headerBarBg: HEADER_BAR_BG_DARK,
    headerBorder: 'rgba(255,255,255,0.1)',
    pointsPillBg: POINTS_PILL_BG_DARK,
    pointsPillStar: '#60A5FA',
  },
};
