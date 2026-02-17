import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';
import { useEffectiveColorScheme, useSettings } from '@/lib/settings/context';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Dimensions, Linking, Platform, Pressable, View } from 'react-native';
import YoutubePlayer, { type PLAYER_STATES } from 'react-native-youtube-iframe';

/** معاملات المشغّل عند تفعيل وضع الخصوصية: إخفاء الفيديوهات المقترحة والتعليقات والتركيز على الفيديو فقط */
function getPrivacyPlayerParams() {
  return {
    rel: false as const,           // عرض فيديوهات مقترحة من نفس القناة فقط
    iv_load_policy: 2 as const,   // إخفاء التعليقات التوضيحية
    preventFullScreen: true,      // منع الخروج للتطبيق الكامل (أفضل للأطفال)
  };
}

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
  /** يبدأ التشغيل تلقائياً عند العرض (افتراضي: false) */
  autoPlay?: boolean;
}

export function YoutubeEmbed({ url, autoPlay = false }: YoutubeEmbedProps) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme];
  const { youtubePrivacyMode } = useSettings();
  const videoId = useMemo(() => getYoutubeVideoId(url), [url]);
  const initialPlayerParams = youtubePrivacyMode ? getPrivacyPlayerParams() : undefined;
  const [playing, setPlaying] = useState(autoPlay);
  const [playerError, setPlayerError] = useState(false);
  const { width } = Dimensions.get('window');
  const height = Math.round((width - 32) * (9 / 16));

  const openVideo = () => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  if (!videoId) return null;

  /** على الويب قد لا يعمل المشغّل المضمّن؛ نعرض رابط الفتح */
  const useNativePlayer = Platform.OS !== 'web' && !playerError;

  if (!useNativePlayer) {
    return (
      <View
        className="self-center rounded-xl overflow-hidden mb-6 bg-black justify-center items-center p-5 gap-2.5"
        style={{ width: width - 32, minHeight: 180 }}
      >
        <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.8)" />
        <Text className="text-base text-white text-center" style={{ fontFamily: 'Tajawal_700Bold' }}>
          {playerError ? 'هذا الفيديو غير متوفر للتشغيل هنا' : 'شغّل الفيديو من المتصفح'}
        </Text>
        <Text className="text-sm text-white/80 text-center">
          اضغط لفتح الفيديو في يوتيوب.
        </Text>
        <Pressable
          className="mt-2 py-3 px-5 bg-white/20 rounded-xl"
          onPress={openVideo}
        >
          <Text className="text-[15px] font-semibold text-white">فتح في يوتيوب</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      className="self-center rounded-xl overflow-hidden mb-6 bg-black"
      style={{ width: width - 32, height }}
    >
      <YoutubePlayer
        height={height}
        play={playing}
        videoId={videoId}
        initialPlayerParams={initialPlayerParams}
        onChangeState={(state: PLAYER_STATES) => {
          if (state === 'ended' || state === 'paused') setPlaying(false);
        }}
        onError={() => setPlayerError(true)}
      />
    </View>
  );
}
