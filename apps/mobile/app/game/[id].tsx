import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { getContentById } from '@/lib/api';
import type { Content } from '@/types/content';
import { lightTheme } from '@/lib/theme';

export default function GameDetailScreen() {
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

  const isYoutube = content.sourceType === 'youtube' && content.contentUrl;
  const isPdf = content.sourceType === 'uploaded' && content.fileUrl;

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {content.thumbnailUrl ? (
        <Image
          source={{ uri: content.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : null}
      <Text style={styles.title}>{content.title}</Text>
      {content.description ? (
        <Text style={styles.description}>{content.description}</Text>
      ) : null}
      {isYoutube ? (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => openLink(content.contentUrl!)}
        >
          <Text style={styles.buttonText}>شاهد الفيديو على يوتيوب</Text>
        </Pressable>
      ) : null}
      {isPdf ? (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => openLink(content.fileUrl!)}
        >
          <Text style={styles.buttonText}>افتح ملف PDF</Text>
        </Pressable>
      ) : null}
      {!isYoutube && !isPdf && (
        <Text style={styles.empty}>لا يوجد رابط للعبة حالياً</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: lightTheme.neutral[200],
    marginBottom: 16,
  },
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
  button: {
    backgroundColor: lightTheme.primary[400],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.9 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  text: { fontSize: 16, color: lightTheme.text },
  empty: { fontSize: 16, color: lightTheme.textSecondary, textAlign: 'center' },
});
