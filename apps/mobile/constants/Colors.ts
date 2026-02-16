/**
 * ألوان التطبيق - هوية جديدة للأطفال
 * Sky Blue, Mint Green, Peach Orange, Soft Purple
 * مصدر واحد للألوان يُستخدم في كل التطبيق
 */

/** الألوان الأساسية */
const SKY_BLUE = '#6EC6FF';     // أزرق سماوي
const SKY_BLUE_DARK = '#3BA8E6'; // أزرق أغمق (أزرار/نشط)
const MINT_GREEN = '#7FE3C1';   // أخضر نعناع
const PEACH_ORANGE = '#FFB37E'; // برتقالي خوخي
const SOFT_PURPLE = '#C6B7FF';  // بنفسجي فاتح
const WARM_BG = '#FDFEFE';      // أبيض مريح
const SUCCESS = '#22C55E';
const ERROR = '#EF4444';
const WARNING = '#F59E0B';

/** التبويب */
const TAB_BAR_ACCENT = SKY_BLUE;
const TAB_BAR_DARK_BG = '#1E1E1E';
const TAB_BAR_ACTIVE_PILL_BG = SKY_BLUE;
const TAB_BAR_ACTIVE_PILL_TINT = '#FFFFFF';
const TAB_BAR_INACTIVE_PILL_LIGHT = 'rgba(0,0,0,0.04)';
const TAB_BAR_INACTIVE_PILL_DARK = 'rgba(255,255,255,0.08)';

/** الهيدر والنقاط */
const HEADER_BAR_BG_LIGHT = 'rgba(253,254,254,0.96)';
const HEADER_BAR_BG_DARK = 'rgba(30,30,30,0.95)';
const POINTS_PILL_BG_LIGHT = 'rgba(110,198,255,0.18)';
const POINTS_PILL_BG_DARK = 'rgba(110,198,255,0.22)';
const POINTS_PILL_STAR = PEACH_ORANGE;

/** ألوان التبويب حسب القسم */
const TAB_PILL_HOME_PROFILE = '#8B7FD8';
const TAB_PILL_STORIES = MINT_GREEN;
const TAB_PILL_GAMES = PEACH_ORANGE;
const TAB_PILL_VIDEOS = SOFT_PURPLE;

/** بطاقة المستوى في الهيرو */
const LEVEL_CARD_BG = '#8B7FD8';
const LEVEL_CARD_BG_DARK = '#6D5BBF';
const NOTIFICATION_DOT = '#F97316';

/** خلفيات أزرار الشيب عند التحديد (rgba ثابتة — React Native لا يفسّر hex+alpha بشكل موثوق) */
const CHIP_SELECTED_BG_STORIES = 'rgba(127, 227, 193, 0.32)';   // MINT_GREEN
const CHIP_SELECTED_BG_VIDEOS = 'rgba(198, 183, 255, 0.32)';   // SOFT_PURPLE
const CHIP_SELECTED_BG_GAMES = 'rgba(255, 179, 126, 0.32)';    // PEACH_ORANGE

/** خلفية أزرار الشيب غير المحددة (bg-slate-200 للجميع) */
const CHIP_BG_SLATE_200 = '#E2E8F0';

/** محايدات للوضع الفاتح */
const LIGHT_CARD = '#FFFFFF';
const LIGHT_MUTED = '#F0F4F8';
const LIGHT_BORDER = '#E5E9ED';
const LIGHT_TEXT = '#2B2B2B';
const LIGHT_TEXT_SEC = '#5A5A5A';

/** محايدات للوضع الداكن */
const DARK_CARD = '#252525';
const DARK_MUTED = '#3A3A3A';
const DARK_BORDER = 'rgba(255,255,255,0.12)';
const DARK_TEXT = '#FFFFFF';
const DARK_TEXT_SEC = 'rgba(255,255,255,0.75)';
const DARK_NEUTRAL_300 = 'rgba(255,255,255,0.4)';

export default {
  light: {
    text: LIGHT_TEXT,
    textSecondary: LIGHT_TEXT_SEC,
    foreground: LIGHT_TEXT,
    background: WARM_BG,
    card: LIGHT_CARD,
    muted: LIGHT_MUTED,
    border: LIGHT_BORDER,
    tint: SKY_BLUE,
    primary: { 100: 'rgba(110,198,255,0.28)', 400: SKY_BLUE, 500: SKY_BLUE_DARK },
    secondary: { 500: MINT_GREEN },
    accent: { 500: PEACH_ORANGE },
    stories: MINT_GREEN,
    videos: SOFT_PURPLE,
    games: PEACH_ORANGE,
    success: SUCCESS,
    error: ERROR,
    warning: WARNING,
    neutral: { 300: LIGHT_BORDER },
    tabIconDefault: '#7A7A7A',
    tabIconSelected: SKY_BLUE,
    tabBarAccent: TAB_BAR_ACCENT,
    tabBarBackground: LIGHT_CARD,
    tabBarActiveBackground: 'transparent',
    tabBarActivePillBackground: TAB_BAR_ACTIVE_PILL_BG,
    tabBarActivePillTint: TAB_BAR_ACTIVE_PILL_TINT,
    tabBarInactivePillBackground: TAB_BAR_INACTIVE_PILL_LIGHT,
    tabBarBaseline: LIGHT_BORDER,
    headerBarBg: HEADER_BAR_BG_LIGHT,
    headerBorder: 'rgba(0,0,0,0.05)',
    pointsPillBg: POINTS_PILL_BG_LIGHT,
    pointsPillStar: POINTS_PILL_STAR,
    tabPillHomeProfile: TAB_PILL_HOME_PROFILE,
    tabPillStories: TAB_PILL_STORIES,
    tabPillGames: TAB_PILL_GAMES,
    tabPillVideos: TAB_PILL_VIDEOS,
    levelCardBg: LEVEL_CARD_BG,
    notificationDot: NOTIFICATION_DOT,
    chipSelectedBg: {
      stories: CHIP_SELECTED_BG_STORIES,
      videos: CHIP_SELECTED_BG_VIDEOS,
      games: CHIP_SELECTED_BG_GAMES,
    },
    chipBgUnselected: CHIP_BG_SLATE_200,
  },
  dark: {
    text: DARK_TEXT,
    textSecondary: DARK_TEXT_SEC,
    foreground: DARK_TEXT,
    background: '#121212',
    card: DARK_CARD,
    muted: DARK_MUTED,
    border: DARK_BORDER,
    tint: SKY_BLUE,
    primary: { 100: 'rgba(110,198,255,0.28)', 400: SKY_BLUE, 500: SKY_BLUE_DARK },
    secondary: { 500: MINT_GREEN },
    accent: { 500: PEACH_ORANGE },
    stories: MINT_GREEN,
    videos: SOFT_PURPLE,
    games: PEACH_ORANGE,
    success: SUCCESS,
    error: ERROR,
    warning: WARNING,
    neutral: { 300: DARK_NEUTRAL_300 },
    tabIconDefault: 'rgba(255,255,255,0.7)',
    tabIconSelected: SKY_BLUE,
    tabBarAccent: TAB_BAR_ACCENT,
    tabBarBackground: TAB_BAR_DARK_BG,
    tabBarActiveBackground: 'transparent',
    tabBarActivePillBackground: SKY_BLUE,
    tabBarActivePillTint: TAB_BAR_ACTIVE_PILL_TINT,
    tabBarInactivePillBackground: TAB_BAR_INACTIVE_PILL_DARK,
    tabBarBaseline: 'rgba(255,255,255,0.25)',
    headerBarBg: HEADER_BAR_BG_DARK,
    headerBorder: 'rgba(255,255,255,0.1)',
    pointsPillBg: POINTS_PILL_BG_DARK,
    pointsPillStar: PEACH_ORANGE,
    tabPillHomeProfile: TAB_PILL_HOME_PROFILE,
    tabPillStories: TAB_PILL_STORIES,
    tabPillGames: TAB_PILL_GAMES,
    tabPillVideos: TAB_PILL_VIDEOS,
    levelCardBg: LEVEL_CARD_BG_DARK,
    notificationDot: NOTIFICATION_DOT,
    chipSelectedBg: {
      stories: CHIP_SELECTED_BG_STORIES,
      videos: CHIP_SELECTED_BG_VIDEOS,
      games: CHIP_SELECTED_BG_GAMES,
    },
    chipBgUnselected: CHIP_BG_SLATE_200,
  },
};
