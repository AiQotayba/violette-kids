import Colors from '@/constants/Colors';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { Text, View } from 'react-native';

export function NotFound() {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      className="flex-1 justify-center items-center px-6"
      style={{ backgroundColor: colors.background }}
    >
      <Text
        className="text-base text-center"
        style={{ color: colors.textSecondary }}
      >
        لم نجد هذا المحتوى
      </Text>
    </View>
  );
}