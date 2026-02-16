import { ContentDetailSkeleton } from '@/components/content/ContentDetailSkeleton';
import { ContentEngine } from '@/components/content/page/content.engine';
import { Error } from '@/components/content/page/error';
import { PageHeader } from '@/components/content/page/header';
import { NotFound } from '@/components/content/page/notfound';
import { PdfViewer } from '@/components/content/PdfViewer';
import Colors from '@/constants/Colors';
import { useGamification } from '@/lib/gamification/context';
import { getContentById } from '@/lib/api';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import type { Content } from '@/types/content';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();
  const { recordCompletion, isContentCompleted } = useGamification();
  const completed = id ? isContentCompleted('story', id) : false;
  const Content = new ContentEngine(content!);
  useEffect(() => {
    const numId = id ? parseInt(id, 10) : NaN;
    if (Number.isNaN(numId)) {
      setError('لم نتمكن من فتح هذه القصة. جرّب مرة أخرى.');
      setLoading(false);
      return;
    }
    getContentById(numId)
      .then(setContent)
      .catch(() => setError('لم نتمكن من تحميل القصة. جرّب مرة أخرى.'))
      .finally(() => setLoading(false));
  }, [id]);

  useLayoutEffect(() => {
    if (content?.title) navigation.setOptions({ title: content.title });
  }, [content?.title, navigation]);

  if (loading) return <ContentDetailSkeleton variant="story" />;
  if (error) return <Error message={error} />;
  if (!content) return <NotFound />;

  const pages = content.pages ?? [];
  const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);
  const hasPdf = content.sourceType === 'uploaded' && content.fileUrl;
  const ageGroups = content.ageGroups ?? [];
  const ageLabel =
    ageGroups[0]?.label ??
    (content.ageMin != null && content.ageMax != null
      ? `العمر: ${content.ageMin}-${content.ageMax} سنة`
      : null);
  const categories = content.categories ?? [];
  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <PageHeader title={content.title} />
      {completed && (
        <View className="mb-3 rounded-xl py-2.5 px-4 flex-row items-center justify-center gap-2" style={{ backgroundColor: `${colors.success}22` }}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text className="text-base font-semibold" style={{ color: colors.success }}>تمت القراءة</Text>
        </View>
      )}
      <Content.title />
      <Content.categories /> 

      {hasPdf && content.fileUrl ? <PdfViewer uri={content.fileUrl} /> : null}

      {(hasPdf || sortedPages.length > 0) && id && !completed && (
        <Pressable
          className="mt-4 mb-2 rounded-xl py-3.5 px-4 flex-row items-center justify-center gap-2 active:opacity-90"
          style={{ backgroundColor: colors.primary[500] }}
          onPress={() => recordCompletion('story', id)}
        >
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text className="text-base font-semibold text-white">انتهيت من القراءة</Text>
        </Pressable>
      )}

      {!hasPdf && sortedPages.length === 0 && (
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
              backgroundColor: colorScheme === 'dark' ? 'rgba(127,227,193,0.2)' : 'rgba(127,227,193,0.25)',
            }}
          >
            <Ionicons
              name="book-outline"
              size={32}
              color={colors.stories}
            />
          </View>
          <Text
            className="text-base font-semibold text-center mb-1"
            style={{ color: colors.text }}
          >
            القصة غير متوفرة للقراءة
          </Text>
          <Text
            className="text-[14px] text-center"
            style={{ color: colors.textSecondary }}
          >
            يمكنك تصفح قصص أخرى من الصفحة الرئيسية
          </Text>
        </View>
      )}
      <Content.description />
    </ScrollView>
  );
}
