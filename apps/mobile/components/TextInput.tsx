/**
 * مكوّن TextInput يطبّق خط تجوال (Tajawal) افتراضياً.
 * استخدمه بدل استيراد TextInput من 'react-native' لضمان ظهور الخط في حقول الإدخال.
 */
import type { TextInputProps as RNTextInputProps } from 'react-native';
import { Platform, TextInput as RNTextInput } from 'react-native';
import { fontFamily } from '@/lib/theme/fonts';

export type TextInputProps = RNTextInputProps;

const DEFAULT_FONT = {
  fontFamily: Platform.OS === 'web' ? 'Tajawal' : fontFamily.body,
};

export function TextInput(props: TextInputProps) {
  const { style, ...rest } = props;
  const flatStyle =
    style == null
      ? [DEFAULT_FONT]
      : Array.isArray(style)
        ? [...style, DEFAULT_FONT]
        : [style, DEFAULT_FONT];
  return <RNTextInput style={flatStyle} {...rest} />;
}
