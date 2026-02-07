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
import type { Content } from '@/types/content';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';
import { ContentDetailSkeleton } from '@/components/content/ContentDetailSkeleton';
import { YoutubeEmbed, getYoutubeVideoId } from '@/components/content/YoutubeEmbed';

export default function VideoDetailScreen() {
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
    return <ContentDetailSkeleton variant="media" />;
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

  const videoUrl = content.contentUrl;
  const isYoutube = videoUrl ? !!getYoutubeVideoId(videoUrl) : false;
  const ageGroups = content.ageGroups ?? [];
  const ageLabel =
    ageGroups[0]?.label ??
    (content.ageMin != null && content.ageMax != null
      ? `العمر: ${content.ageMin}-${content.ageMax} سنة`
      : null);
  const categories = content.categories ?? [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* {isYoutube && videoUrl ? ( */}
        <YoutubeEmbed url={content.contentUrl ?? ''} />
      {/* ) : content.thumbnailUrl ? ( */}
        {/* <Image
          source={{ uri: content.thumbnailUrl }}
          style={[styles.thumbnail, { backgroundColor: theme.muted }]}
          resizeMode="cover"
        />
      ) : null} */}
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
          {categories.map((cat) => (
            <View
              key={cat.id}
              style={[styles.chip, { backgroundColor: theme.muted }]}
            >
              <Text style={[styles.chipText, { color: theme.textSecondary }]}>
                {cat.name}
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

      {videoUrl ? (
        <Pressable
          style={({ pressed }) => [
            styles.linkButton,
            { borderColor: theme.border },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => Linking.openURL(videoUrl).catch(() => {})}
        >
          <Text style={[styles.linkButtonText, { color: theme.tint }]}>
            {isYoutube ? 'فتح الفيديو في يوتيوب' : 'شاهد الفيديو'}
          </Text>
        </Pressable>
      ) : (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>
          لا يوجد رابط للفيديو
        </Text>
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
    marginBottom: 16,
  },
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
  linkButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  linkButtonText: { fontSize: 15, fontWeight: '500' },
  buttonPressed: { opacity: 0.9 },
  text: { fontSize: 16 },
  empty: { fontSize: 16, textAlign: 'center' },
});
