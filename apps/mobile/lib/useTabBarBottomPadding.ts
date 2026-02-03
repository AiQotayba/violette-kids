import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** ارتفاع شريط التبويبات (بدون safe area) - حجم أكبر مناسب للأطفال */
export const TAB_BAR_HEIGHT = 80;

/**
 * المسافة السفلية التي يجب إضافتها لمحتوى شاشات التبويبات
 * حتى لا يختفي المحتوى تحت أزرار التنقل (شريط التبويبات + منطقة الأمان).
 */
export function useTabBarBottomPadding(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + insets.bottom;
}
