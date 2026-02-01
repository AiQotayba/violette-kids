import { View, Text, Pressable, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInRight,
} from 'react-native-reanimated';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';
import { kidSpring } from '@/lib/animations/springs';

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
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const config = SECTION_CONFIG[type];
  const tint = theme[config.colorKey];

  const scale = useSharedValue(1);
  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).duration(350).springify()}
      style={styles.row}
    >
      <View style={styles.left}>
        <View style={[styles.iconBox, { backgroundColor: `${tint}22` }]}>
          <FontAwesome name={config.icon} size={24} color={tint} />
        </View>
        <Text style={[styles.title, { color: theme.foreground }]}>
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
        style={styles.pressableHitSlop}
      >
        <Animated.View
          style={[
            styles.viewAllBtn,
            {
              backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)',
            },
            animatedBtnStyle,
          ]}
        >
          <Text style={[styles.viewAllText, { color: theme.primary[500] }]}>
            عرض الكل
          </Text>
          <FontAwesome
            name="chevron-left"
            size={12}
            color={theme.primary[500]}
            style={styles.chevron}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  pressableHitSlop: { minHeight: 48, minWidth: 48 },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    minHeight: 48,
    minWidth: 100,
  },
  viewAllText: { fontSize: 15, fontWeight: '700' },
  chevron: { marginTop: 1 },
});
