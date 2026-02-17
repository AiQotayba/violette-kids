import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';
import { kidTiming } from '@/lib/animations/springs';
import { useGamification } from '@/lib/gamification/context';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const QUICK_ACCESS: { key: string; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; route: string }[] = [
  { key: 'stories', label: 'القصص', icon: 'book', route: '/(tabs)/stories' },
  { key: 'games', label: 'الألعاب', icon: 'game-controller', route: '/(tabs)/games' },
  { key: 'videos', label: 'الفيديوهات', icon: 'play-circle', route: '/(tabs)/videos' },
  { key: 'achievements', label: 'الإنجازات', icon: 'trophy', route: '/(tabs)/profile' },
];

export function HomeHero() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مرحباً';
    return 'مساء الخير';
  };

  const { level, progressPercent } = useGamification();
  const levelMessage = level === 1 ? 'هذه أول خطوة نحو التميز!' : 'استمر، أنت رائع!';

  const cardBg = colors.levelCardBg;
  const progressTrack = 'rgba(255,255,255,0.35)';
  const progressFill = colors.accent[500];

  return (
    <Animated.View
      entering={FadeInDown.duration(kidTiming.normal).springify()}
      className="px-4 pt-3 pb-5"
    >
      {/* الهيدر: صورة الملف + التحية والتقدم + الإشعارات */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="flex-1">
            <Text className="text-base" style={{ color: colors.foreground, fontFamily: 'Tajawal_500Medium' }}>
              {getGreeting()}، صديقنا
            </Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text className="text-xs font-medium" style={{ color: colors.textSecondary, fontFamily: 'Tajawal_500Medium' }}>
                التقدم {progressPercent}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* بطاقة المستوى: عنوان + وصف + شريط تقدم + كأس */}
      <View
        className="rounded-[28px] overflow-hidden mb-6 px-5 pt-5 pb-6"
        style={{ backgroundColor: cardBg }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-xl text-white" style={{ fontFamily: 'Tajawal_700Bold' }}>{`المستوى ${level}`}</Text>
            <Text className="text-sm mt-1.5 opacity-95 text-white">{levelMessage}</Text>
          </View>
          <View
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Ionicons name="trophy" size={32} color={colors.accent[500]} />
          </View>
        </View>
        <View className="mt-5 flex-row items-center" style={{ overflow: 'visible' }}>
          <View
            className="flex-1 h-3 rounded-full overflow-visible"
            style={{ backgroundColor: progressTrack }}
          >
            <View
              className="h-full rounded-full absolute left-0 top-0"
              style={{
                width: `${Math.max(progressPercent, 4)}%`,
                minWidth: 12,
                backgroundColor: progressFill,
              }}
            />
            <View
              className="absolute w-5 h-5 rounded-full border-2 border-white"
              style={{
                left: `${Math.min(progressPercent, 96)}%`,
                marginLeft: -10,
                top: -4,
                backgroundColor: progressFill,
              }}
            />
          </View>
        </View>
      </View>

      {/* أيقونات الوصول السريع: دوائر متدرجة (خلفية شفافة + دائرة داخلية) */}
      <View className="flex-row justify-between mb-6">
        {QUICK_ACCESS.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => router.push(item.route as never)}
            className="items-center gap-2.5 active:opacity-85"
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.card }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: `${colors.primary[500]}18` }}
              >
                <Ionicons name={item.icon} size={24} color={colors.primary[500]} />
              </View>
            </View>
            <Text className="text-xs font-semibold" style={{ color: colors.foreground }} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}
