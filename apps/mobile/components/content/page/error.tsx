import Colors from '@/constants/Colors';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { Text, View } from 'react-native';

const DEFAULT_MESSAGE = 'حدث خطأ. جرّب مرة أخرى.';

export function Error({ message }: { message?: string | null }) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      className="flex-1 justify-center items-center px-6"
      style={{ backgroundColor: colors.background }}
    >
      <Text
        className="text-base text-center"
        style={{ color: colors.error }}
      >
        {message?.trim() || DEFAULT_MESSAGE}
      </Text>
    </View>
  );
}