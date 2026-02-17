import { ContentCard } from '@/components/cards/ContentCard';
import { HomeHero } from '@/components/home/HomeHero';
import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';
import { getContentList } from '@/lib/api';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { useTabBarBottomPadding } from '@/lib/useTabBarBottomPadding';
import type { Content } from '@/types/content';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

async function fetchHomeContent(): Promise<{
  stories: Content[];
  games: Content[];
  videos: Content[];
}> {
  const [s, g, v] = await Promise.all([
    getContentList({ type: 'story', limit: 6 }),
    getContentList({ type: 'game', limit: 6 }),
    getContentList({ type: 'video', limit: 6 }),
  ]);
  return { stories: s.data, games: g.data, videos: v.data };
}

const PART_TYPE_TO_CARD_TYPE: Record<'stories' | 'videos' | 'games', 'story' | 'video' | 'game'> = {
  stories: 'story',
  videos: 'video',
  games: 'game',
};

const SECTION_CONFIG: Record<'stories' | 'videos' | 'games', { title: string; icon: React.ComponentProps<typeof Ionicons>['name']; description: string; colorKey: 'stories' | 'videos' | 'games' }> = {
  stories: {
    title: 'القصص',
    icon: 'book',
    description: 'قصص ممتعة تساعد الأطفال على النمو والاستمتاع كل يوم.',
    colorKey: 'stories',
  },
  videos: {
    title: 'الفيديوهات',
    icon: 'play-circle',
    description: 'فيديوهات تعليمية وترفيهية مناسبة للأطفال.',
    colorKey: 'videos',
  },
  games: {
    title: 'الألعاب',
    icon: 'game-controller',
    description: 'ألعاب تفاعلية ممتعة تنمي المهارات.',
    colorKey: 'games',
  },
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const tabBarBottomPadding = useTabBarBottomPadding();
  const { data, isPending: loading, error } = useQuery({
    queryKey: ['home', 'content'],
    queryFn: fetchHomeContent,
    staleTime: 3000,
    gcTime: 3000,
    refetchOnWindowFocus: false,
  });


  const stories = data?.stories ?? [];
  const games = data?.games ?? [];
  const videos = data?.videos ?? [];
  const errorMessage = error instanceof Error ? error.message : error ? 'حدث خطأ' : null;

  if (errorMessage && stories.length === 0) {
    return (
      <View
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="w-[88px] h-[88px] rounded-full items-center justify-center mb-5"
          style={{ backgroundColor: `${colors.error}18` }}
        >
          <Ionicons name="alert-circle" size={48} color={colors.error} />
        </View>
        <Text className="text-xl mb-2" style={{ color: colors.foreground, fontFamily: 'Tajawal_700Bold' }}>
          لا يمكن تحميل المحتوى
        </Text>
        <Text className="text-[15px] text-center mb-6" style={{ color: colors.textSecondary }}>
          {errorMessage}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: "#eeeeee" }}
      contentContainerStyle={{ paddingBottom: tabBarBottomPadding ?? 24 }}
      showsVerticalScrollIndicator={false}
    >
      <HomeHero />
      <Part
        type="stories"
        items={stories}
        loading={loading}
        index={0}
        onViewAll={() => router.push('/(tabs)/stories' as never)}
      />
      <Part
        type="videos"
        items={videos}
        loading={loading}
        index={1}
        onViewAll={() => router.push('/(tabs)/videos' as never)}
      />
      <Part
        type="games"
        items={games}
        loading={loading}
        index={2}
        onViewAll={() => router.push('/(tabs)/games' as never)}
      />
    </ScrollView>
  );
}

const SECTION_TINT_KEY: Record<'stories' | 'videos' | 'games', 'tabPillStories' | 'tabPillVideos' | 'tabPillGames'> = {
  stories: 'tabPillStories',
  videos: 'tabPillVideos',
  games: 'tabPillGames',
};

function Part({
  type,
  index,
  onViewAll,
  items,
  loading,
}: {
  type: 'stories' | 'videos' | 'games';
  index: number;
  onViewAll: () => void;
  items: Content[];
  loading: boolean;
}) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardType = PART_TYPE_TO_CARD_TYPE[type];
  const config = SECTION_CONFIG[type];
  const sectionColor = colors[SECTION_TINT_KEY[type]];

  return (
    <Animated.View
      entering={FadeInDown.delay(80 + index * 60).duration(400).springify()}
      className="mx-4 mb-6 rounded-3xl border overflow-hidden"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <View className="flex-row items-center gap-3">
          <View
            className="w-11 h-11 rounded-2xl items-center justify-center"
            style={{ backgroundColor: `${sectionColor}22` }}
          >
            <Ionicons name={config.icon} size={24} color={sectionColor} />
          </View>
          <Text className="text-lg" style={{ color: colors.foreground, fontFamily: 'Tajawal_700Bold !important' }}>
            {config.title}
          </Text>
        </View>
        <Pressable
          onPress={onViewAll}
          className="w-10 h-10 rounded-full items-center justify-center active:opacity-80"
          style={{ backgroundColor: colors.muted }}
        >
          <Ionicons name="arrow-forward" size={18} color={colors.foreground} style={{ transform: [{ rotate: '180deg' }] }} />
        </Pressable>
      </View>
      <Text className="text-sm px-4 pb-3" style={{ color: colors.textSecondary }} numberOfLines={2}>
        {config.description}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16, gap: 8 }}
      >
        {items.map((item: Content, i: number) => (
          <ContentCard key={item.id} item={item} type={cardType} index={i} loading={loading} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}
