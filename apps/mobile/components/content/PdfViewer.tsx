import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';

/** إصلاح رابط قد يكون خاطئاً (مثلاً https:/- بدل https://) */
function normalizePdfUrl(url: string): string {
  if (url.startsWith('https:/-')) {
    return url.replace('https:/-', 'https://');
  }
  if (url.startsWith('http:/-')) {
    return url.replace('http:/-', 'http://');
  }
  return url;
}

/** عرض PDF داخل WebView (يعمل في Expo Go بدون native modules) */
export interface PdfViewerProps {
  /** رابط ملف الـ PDF */
  uri: string;
}

export function PdfViewer({ uri }: PdfViewerProps) {
  const [error, setError] = useState(false);
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const pdfUrl = normalizePdfUrl(uri);
  const { width } = Dimensions.get('window');
  const pdfHeight = Math.max(400, Dimensions.get('window').height * 0.55);
  const contentWidth = width - 32;
  // Google Docs viewer يعرض الـ PDF بشكل متوافق مع الجوال
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  if (error) {
    return (
      <View style={[styles.errorBox, { backgroundColor: theme.muted }]}>
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          تعذر تحميل ملف PDF
        </Text>
        <Text style={[styles.errorSub, { color: theme.textSecondary }]}>
          استخدم زر «فتح في المتصفح» أدناه
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { width: contentWidth, height: pdfHeight }]}>
      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webview}
        onError={() => setError(true)}
        onHttpError={() => setError(true)}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorBox: {
    padding: 24,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 14,
  },
});
