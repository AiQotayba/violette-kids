import { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

/** استخراج معرف فيديو يوتيوب من الرابط */
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
  /** رابط يوتيوب (watch أو youtu.be أو embed) */
  url: string;
}

export function YoutubeEmbed({ url }: YoutubeEmbedProps) {
  const videoId = useMemo(() => getYoutubeVideoId(url), [url]);
  const { width } = Dimensions.get('window');
  const height = Math.round((width - 32) * (9 / 16)); // نفس padding المحتوى

  const embedHtml = useMemo(() => {
    if (!videoId) return '';
    const embedUrl = `https://www.youtube.com/embed/${videoId}?playsinline=1`;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; overflow: hidden; }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <iframe
          src="${embedUrl}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </body>
      </html>
    `;
  }, [videoId]);

  if (!videoId) return null;

  return (
    <View style={[styles.wrapper, { width: width - 32, height }]}>
      <WebView
        source={{ html: embedHtml }}
        style={styles.webview}
        scrollEnabled={false}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});
