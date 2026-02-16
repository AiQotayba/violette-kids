import Colors from '@/constants/Colors';
import { kidTiming } from '@/lib/animations/springs';
import { useGamification } from '@/lib/gamification/context';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Constants from 'expo-constants';
import { Image, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const APP_NAME = Constants.expoConfig?.name ?? 'Violette Kids';

export function HeaderTitleWithPoints() {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { points } = useGamification();

  return (
    <Animated.View
      entering={FadeInDown.duration(kidTiming.normal).springify().damping(18)}
      className="flex-row items-center gap-3 flex-1 justify-center py-2 px-3.5 rounded-[20px]"
    >
      <Image
        source={require('../../assets/images/logo.png')}
        className="w-9 h-9"
        resizeMode="contain"
        accessibilityLabel="شعار عالم همسة"
      />
      <Text className="text-lg font-bold" style={{ color: colors.text }} numberOfLines={1}>
        {APP_NAME}
      </Text>
      <View
        className="flex-row items-center gap-1.5 py-1.5 px-3 rounded-2xl"
        style={{ backgroundColor: colors.pointsPillBg }}
      >
        <FontAwesome name="star" size={12} color={colors.pointsPillStar} />
        <Text className="text-[13px] font-semibold" style={{ color: colors.text }}>
          {points} نقاط
        </Text>
      </View>
    </Animated.View>
  );
}
