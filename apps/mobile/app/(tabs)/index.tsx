import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  StyleSheet,
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

export default function HomeScreen() {
  const router = useRouter();
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const tabBarBottomPadding = useTabBarBottomPadding();
  const [stories, setStories] = useState<Content[]>([]);
  const [games, setGames] = useState<Content[]>([]);
  const [videos, setVideos] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    setLoading(true);
    Promise.all([
      getContentList({ type: 'story', limit: 6 }),
      getContentList({ type: 'game', limit: 6 }),
      getContentList({ type: 'video', limit: 6 }),
    ])
      .then(([s, g, v]) => {
        setStories(s.data);
        setGames(g.data);
        setVideos(v.data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'حدث خطأ'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && stories.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          نجهز لك المحتوى...
        </Text>
      </View>
    );
  }

  if (error && stories.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.errorIconWrap,
            { backgroundColor: `${theme.error}18` },
          ]}
        >
          <FontAwesome name="exclamation-circle" size={48} color={theme.error} />
        </View>
        <Text style={[styles.errorTitle, { color: theme.foreground }]}>
          لا يمكن تحميل المحتوى
        </Text>
        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
          {error}
        </Text>
        <Pressable
          onPress={load}
          style={({ pressed }) => [
            styles.retryBtn,
            {
              backgroundColor: theme.primary[500],
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <FontAwesome name="refresh" size={18} color="#fff" />
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarBottomPadding }]}
      showsVerticalScrollIndicator={false}
    >
      <HomeHero />

      <Animated.View
        entering={FadeInDown.delay(80).duration(400).springify()}
        style={styles.section}
      >
        <SectionHeader
          type="stories"
          index={0}
          onViewAll={() => router.push('/(tabs)/stories' as never)}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {stories.map((item, i) => (
            <ContentCard key={item.id} item={item} type="story" index={i} />
          ))}
        </ScrollView>
        {stories.length === 0 && (
          <View style={styles.empty}>
            <FontAwesome name="book" size={36} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              لا توجد قصص حالياً
            </Text>
          </View>
        )}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(160).duration(400).springify()}
        style={styles.section}
      >
        <SectionHeader
          type="videos"
          index={1}
          onViewAll={() => router.push('/(tabs)/videos' as never)}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {videos.map((item, i) => (
            <ContentCard key={item.id} item={item} type="video" index={i} />
          ))}
        </ScrollView>
        {videos.length === 0 && (
          <View style={styles.empty}>
            <FontAwesome name="video-camera" size={36} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              لا توجد فيديوهات حالياً
            </Text>
          </View>
        )}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(240).duration(400).springify()}
        style={styles.section}
      >
        <SectionHeader
          type="games"
          index={2}
          onViewAll={() => router.push('/(tabs)/games' as never)}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {games.map((item, i) => (
            <ContentCard key={item.id} item={item} type="game" index={i} />
          ))}
        </ScrollView>
        {games.length === 0 && (
          <View style={styles.empty}>
            <FontAwesome name="gamepad" size={36} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              لا توجد ألعاب حالياً
            </Text>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingVertical: 24,
  },
  row: {
    paddingHorizontal: 16,
    gap: 4,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 14,
  },
});
