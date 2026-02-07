import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getContentList } from '@/lib/api';
import { ContentCard } from '@/components/cards/ContentCard';
import { HomeHero } from '@/components/home/HomeHero';
import { SectionHeader } from '@/components/home/SectionHeader';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { useTabBarBottomPadding } from '@/lib/useTabBarBottomPadding';
import { lightTheme, darkTheme } from '@/lib/theme';
import type { Content } from '@/types/content';

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

export default function HomeScreen() {
  const router = useRouter();
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const tabBarBottomPadding = useTabBarBottomPadding();
  const {
    data,
    isPending: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['home', 'content'],
    queryFn: fetchHomeContent,
    // 30 seconds
    staleTime: 3000,
    gcTime: 3000,
    refetchOnWindowFocus: false,
  });

  const stories = data?.stories ?? [];
  const games = data?.games ?? [];
  const videos = data?.videos ?? [];
  const errorMessage =
    error instanceof Error ? error.message : error ? 'حدث خطأ' : null;


  if (errorMessage && stories.length === 0) {
    return (
      <View
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: theme.background }}
      >
        <View
          className="w-[88px] h-[88px] rounded-full items-center justify-center mb-5"
          style={{ backgroundColor: `${theme.error}18` }}
        >
          <FontAwesome name="exclamation-circle" size={48} color={theme.error} />
        </View>
        <Text
          className="text-xl font-bold mb-2"
          style={{ color: theme.foreground }}
        >
          لا يمكن تحميل المحتوى
        </Text>
        <Text
          className="text-[15px] text-center mb-6"
          style={{ color: theme.textSecondary }}
        >
          {errorMessage}
        </Text>
        {/* <Pressable
          onPress={() => refetch()}
          className="flex-row items-center gap-2.5 px-6 py-3.5 rounded-[20px] active:opacity-90"
          style={{ backgroundColor: theme.primary[500] }}
        >
          <FontAwesome name="refresh" size={18} color="#fff" />
          <Text className="text-white text-base font-bold">إعادة المحاولة</Text>
        </Pressable> */}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: tabBarBottomPadding ?? 24 }}
      showsVerticalScrollIndicator={false}
    >
      <HomeHero />
      <Part type="stories" items={stories} loading={loading} index={0} onViewAll={() => router.push('/(tabs)/stories' as never)} />
      <Part type="videos" items={videos} loading={loading} index={1} onViewAll={() => router.push('/(tabs)/videos' as never)} />
      <Part type="games" items={games} loading={loading} index={2} onViewAll={() => router.push('/(tabs)/games' as never)} />
    </ScrollView>
  );
}
const PART_TYPE_TO_CARD_TYPE: Record<'stories' | 'videos' | 'games', 'story' | 'video' | 'game'> = {
  stories: 'story',
  videos: 'video',
  games: 'game',
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
  const cardType = PART_TYPE_TO_CARD_TYPE[type];
  return (
    <Animated.View
      entering={FadeInDown.delay(80).duration(400).springify()}
      className="py-6"
    >
      <SectionHeader
        type={type}
        index={index}
        onViewAll={onViewAll}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 4 }}
      >
        {items.map((item: Content, i: number) => (
          <ContentCard key={item.id} item={item} type={cardType} index={i} loading={loading} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}
