/**
 * مكوّن Text يطبّق خط تجوال (Tajawal) افتراضياً.
 * استخدمه بدل استيراد Text من 'react-native' لضمان ظهور الخط في كل الواجهة.
 */
import { fontFamily } from '@/lib/theme/fonts';
import type { TextProps as RNTextProps } from 'react-native';
import { Platform, Text as RNText } from 'react-native';

export type TextProps = RNTextProps;

// على الويب نستخدم 'Tajawal' (من رابط Google Fonts في +html)، على native الاسم المسجّل في useFonts
const DEFAULT_FONT = {
  fontFamily: Platform.OS === 'web' ? 'Tajawal' : fontFamily.body,
};

export function Text(props: TextProps) {
  const { style, className, ...rest } = props;
  // font-sans في Tailwind = Tajawal_400Regular؛ إضافته يضمن تطبيق الخط حتى مع NativeWind
  const resolvedClassName = className ? `font-sans ${className}` : 'font-sans';
  const flatStyle =
    style == null
      ? [DEFAULT_FONT]
      : Array.isArray(style)
        ? [...style, DEFAULT_FONT]
        : [style, DEFAULT_FONT];
  return (
    <RNText
      {...rest}
      className={resolvedClassName}
      style={flatStyle}
    />
  );
}
