import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';
import { kidSpring } from '@/lib/animations/springs';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, View } from 'react-native';
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type SectionType = 'stories' | 'videos' | 'games';

const SECTION_CONFIG: Record<
  SectionType,
  {
    title: string;
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    colorKey: 'stories' | 'videos' | 'games';
  }
> = {
  stories: { title: 'القصص', icon: 'book', colorKey: 'stories' },
  videos: { title: 'الفيديوهات', icon: 'video-camera', colorKey: 'videos' },
  games: { title: 'الألعاب', icon: 'gamepad', colorKey: 'games' },
};

interface SectionHeaderProps {
  type: SectionType;
  onViewAll: () => void;
  index?: number;
}

export function SectionHeader({ type, onViewAll, index = 0 }: SectionHeaderProps) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const config = SECTION_CONFIG[type];
  const tint = colors[config.colorKey];

  const scale = useSharedValue(1);
  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).duration(350).springify()}
      className="flex-row items-center justify-between px-4 mb-4"
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${tint}22` }}
        >
          <FontAwesome name={config.icon} size={24} color={tint} />
        </View>
        <Text className="text-lg" style={{ color: colors.foreground, fontFamily: 'Tajawal_700Bold' }}>
          {config.title}
        </Text>
      </View>
      <Pressable
        onPress={onViewAll}
        onPressIn={() => {
          scale.value = withSpring(0.92, kidSpring.press);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, kidSpring.press);
        }}
        className="min-h-12 min-w-12"
      >
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              paddingHorizontal: 18,
              paddingVertical: 14,
              borderRadius: 16,
              minHeight: 48,
              minWidth: 100,
              backgroundColor: `${colors.primary[500]}22`,
            },
            animatedBtnStyle,
          ]}
        >
          <Text className="text-[15px]" style={{ color: colors.primary[500], fontFamily: 'Tajawal_700Bold' }}>
            عرض الكل
          </Text>
          <FontAwesome name="chevron-left" size={12} color={colors.primary[500]} style={{ marginTop: 1 }} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
