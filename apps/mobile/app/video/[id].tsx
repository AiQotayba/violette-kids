import { ContentDetailSkeleton } from '@/components/content/ContentDetailSkeleton';
import { ContentEngine } from '@/components/content/page/content.engine';
import { Error } from '@/components/content/page/error';
import { PageHeader } from '@/components/content/page/header';
import { NotFound } from '@/components/content/page/notfound';
import Colors from '@/constants/Colors';
import { useGamification } from '@/lib/gamification/context';
import { getContentById } from '@/lib/api';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import type { Content } from '@/types/content';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { recordCompletion, isContentCompleted } = useGamification();
  const completed = id ? isContentCompleted('video', id) : false;

  const Content = new ContentEngine(content!);
  useLayoutEffect(() => {
    if (content?.title) navigation.setOptions({ title: content.title });
  }, [content?.title, navigation]);

  useEffect(() => {
    const numId = id ? parseInt(id, 10) : NaN;
    if (Number.isNaN(numId)) {
      setError('لم نتمكن من فتح هذا الفيديو. جرّب مرة أخرى.');
      setLoading(false);
      return;
    }
    getContentById(numId)
      .then(setContent)
      .catch(() => setError('لم نتمكن من تحميل الفيديو. جرّب مرة أخرى.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ContentDetailSkeleton variant="media" />;
  if (error) return <Error message={error} />;
  if (!content) return <NotFound />;

  const hasVideo = !!content.contentUrl;

  return (
    <ScrollView
      className="flex-1 mt-2"
      style={{ backgroundColor: colors.background }}
    >
      <PageHeader title={content.title} />
      {completed && (
        <View className="mx-4 mb-3 rounded-xl py-2.5 px-4 flex-row items-center justify-center gap-2" style={{ backgroundColor: `${colors.success}22` }}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text className="text-base font-semibold" style={{ color: colors.success }}>تمت المشاهدة</Text>
        </View>
      )}
      <View className="px-4">
        <Content.video />
        {hasVideo && id && !completed && (
          <Pressable
            className="mt-4 mb-4 rounded-xl py-3.5 px-4 flex-row items-center justify-center gap-2 active:opacity-90"
            style={{ backgroundColor: colors.primary[500] }}
            onPress={() => recordCompletion('video', id)}
          >
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text className="text-base font-semibold text-white">انتهيت من المشاهدة</Text>
          </Pressable>
        )}
        {!hasVideo && (
          <View
            className="rounded-2xl mb-5 items-center justify-center overflow-hidden"
            style={{
              backgroundColor: colors.muted,
              paddingVertical: 28,
              paddingHorizontal: 24,
              minHeight: 160,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              className="items-center justify-center rounded-full mb-4"
              style={{
                width: 64,
                height: 64,
                backgroundColor: colorScheme === 'dark' ? 'rgba(198,183,255,0.2)' : 'rgba(198,183,255,0.25)',
              }}
            >
              <Ionicons
                name="videocam-outline"
                size={32}
                color={colors.videos}
              />
            </View>
            <Text
              className="text-base font-semibold text-center mb-1"
              style={{ color: colors.text }}
            >
              الفيديو غير متوفر للمشاهدة
            </Text>
            <Text
              className="text-[14px] text-center"
              style={{ color: colors.textSecondary }}
            >
              يمكنك مشاهدة فيديوهات أخرى من الصفحة الرئيسية
            </Text>
          </View>
        )}
        <Content.title />
        <Content.categories />
        <Content.description />
      </View>
    </ScrollView>
  );
}
