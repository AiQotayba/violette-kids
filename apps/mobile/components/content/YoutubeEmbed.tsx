import Colors from '@/constants/Colors';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Dimensions, Image, Linking, Pressable, Text, View } from 'react-native';

export function getYoutubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}

export interface YoutubeEmbedProps {
  url: string;
}

export function YoutubeEmbed({ url }: YoutubeEmbedProps) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme];
  if (!colors) return null;
  const videoId = useMemo(() => getYoutubeVideoId(url), [url]);
  const [thumbnailError, setThumbnailError] = useState(false);
  const { width } = Dimensions.get('window');
  const height = Math.round((width - 32) * (9 / 16));
  const thumbnailUri = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  const openVideo = () => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  if (!videoId) return null;

  if (thumbnailError) {
    return (
      <View
        className="self-center rounded-xl overflow-hidden mb-6 bg-black justify-center items-center p-5 gap-2.5"
        style={{ width: width - 32, height }}
      >
        <Text className="text-lg font-bold text-white text-center">هذا الفيديو غير متوفر</Text>
        <Text className="text-sm text-white/80 text-center">
          قد يكون محذوفاً أو غير متاح في منطقتك (خطأ 152 من يوتيوب).
        </Text>
        <Pressable
          className="mt-2 py-3 px-5 bg-white/20 rounded-xl"
          onPress={openVideo}
        >
          <Text className="text-[15px] font-semibold text-white">فتح الرابط على أي حال</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      className="self-center rounded-xl overflow-hidden mb-6 bg-black"
      style={{ width: width - 32, height }}
      onPress={openVideo}
    >
      {thumbnailUri ? (
        <Image
          source={{ uri: thumbnailUri }}
          className="absolute inset-0"
          resizeMode="cover"
          onError={() => setThumbnailError(true)}
        />
      ) : null}
      <View className="absolute inset-0 bg-black/40 justify-center items-center gap-3">
        <View className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center">
          <Text className="text-[28px] text-black flex items-center justify-center">
            <Ionicons name="play" size={24} color={colors.text} />
          </Text>
        </View> 
      </View>
    </Pressable>
  );
}
