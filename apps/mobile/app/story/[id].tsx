import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { getContentById } from '@/lib/api';
import type { Content } from '@/types/content';
import { lightTheme } from '@/lib/theme';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>جاري التحميل...</Text>
      </View>
    );
  }
  if (error || !content) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.text, { color: lightTheme.error }]}>{error ?? 'المحتوى غير موجود'}</Text>
      </View>
    );
  }

  const pages = content.pages ?? [];
  const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{content.title}</Text>
      {content.description ? (
        <Text style={styles.description}>{content.description}</Text>
      ) : null}
      {sortedPages.map((page) => (
        <View key={page.pageNumber} style={styles.page}>
          <Image
            source={{ uri: page.imageUrl }}
            style={styles.pageImage}
            resizeMode="contain"
          />
          {page.text ? (
            <Text style={styles.pageText}>{page.text}</Text>
          ) : null}
        </View>
      ))}
      {sortedPages.length === 0 && (
        <Text style={styles.empty}>لا توجد صفحات لهذه القصة</Text>
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
    color: lightTheme.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: lightTheme.textSecondary,
    marginBottom: 20,
  },
  page: { marginBottom: 24 },
  pageImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    backgroundColor: lightTheme.neutral[200],
  },
  pageText: {
    fontSize: 16,
    color: lightTheme.text,
    marginTop: 8,
    lineHeight: 24,
  },
  text: { fontSize: 16, color: lightTheme.text },
  empty: { fontSize: 16, color: lightTheme.textSecondary, textAlign: 'center' },
});
