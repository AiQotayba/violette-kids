import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import { getContentById } from '@/lib/api';
import type { Category, Content } from '@/types/content';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';
import { ContentDetailSkeleton } from '@/components/content/ContentDetailSkeleton';
import { PdfViewer } from '@/components/content/PdfViewer';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    const numId = id ? parseInt(id, 10) : NaN;
    if (Number.isNaN(numId)) {
      setError('معرف غير صالح');
      setLoading(false);
      return;
    }
    getContentById(numId)
      .then(setContent)
      .catch((e) => setError(e instanceof Error ? e.message : 'خطأ'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <ContentDetailSkeleton variant="story" />;
  }
  if (error || !content) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.error }]}>
          {error ?? 'المحتوى غير موجود'}
        </Text>
      </View>
    );
  }

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

  const openPdfExternal = () => {
    if (content.fileUrl) Linking.openURL(content.fileUrl).catch(() => {});
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>{content.title}</Text>

      {(ageLabel || categories.length > 0) && (
        <View style={styles.detailsRow}>
          {ageLabel ? (
            <View style={[styles.chip, { backgroundColor: theme.muted }]}>
              <Text style={[styles.chipText, { color: theme.textSecondary }]}>
                {ageLabel}
              </Text>
            </View>
          ) : null}
          {categories.map((cat: any) => (
            <View
              key={cat?.category?.id}
              style={[styles.chip, { backgroundColor: theme.muted }]}
            >
              <Text style={[styles.chipText, { color: theme.textSecondary }]}>
                {cat?.category?.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {content.description ? (
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {content.description}
        </Text>
      ) : null}

      {hasPdf && content.fileUrl ? (
        <>
          <PdfViewer uri={content.fileUrl} />
          <Pressable
            style={({ pressed }) => [
              styles.linkButton,
              { borderColor: theme.border },
              pressed && styles.buttonPressed,
            ]}
            onPress={openPdfExternal}
          >
            <Text style={[styles.linkButtonText, { color: theme.tint }]}>
              فتح الملف في المتصفح
            </Text>
          </Pressable>
        </>
      ) : null}

      {!hasPdf && sortedPages.length === 0 && (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>
          لا توجد صفحات لهذه القصة
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
  description: {
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonPressed: { opacity: 0.9 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  linkButtonText: { fontSize: 15, fontWeight: '500' },
  page: { marginBottom: 24 },
  pageImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
  },
  pageText: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 24,
  },
  text: { fontSize: 16 },
  empty: { fontSize: 16, textAlign: 'center' },
});
