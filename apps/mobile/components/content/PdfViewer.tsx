import Colors from '@/constants/Colors';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

function normalizePdfUrl(url: string): string {
  if (url.startsWith('https:/-')) {
    return url.replace('https:/-', 'https://');
  }
  if (url.startsWith('http:/-')) {
    return url.replace('http:/-', 'http://');
  }
  return url;
}

export interface PdfViewerProps {
  uri: string;
}

export function PdfViewer({ uri }: PdfViewerProps) {
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const pdfUrl = normalizePdfUrl(uri);
  const { width } = Dimensions.get('window');
  const pdfHeight = Math.max(400, Dimensions.get('window').height * 0.55);
  const contentWidth = width - 32;
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const dir = new Directory(Paths.document, 'downloads');
      dir.create({ intermediates: true, idempotent: true });
      const downloaded = await File.downloadFileAsync(pdfUrl, dir);
      setDownloading(false);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare && downloaded?.uri) {
        await Sharing.shareAsync(downloaded.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'حفظ أو مشاركة الملف',
        });
      } else {
        Alert.alert('تم التحميل', 'تم حفظ الملف. يمكنك فتحه من جهازك.');
      }
    } catch (err: unknown) {
      setDownloading(false);
      const message = err instanceof Error ? err.message : 'لم نتمكن من تحميل الملف. جرّب مرة أخرى.';
      Alert.alert('خطأ', message);
    }
  };

  if (error) {
    return (
      <View className="p-6 rounded-xl my-4 items-center" style={{ backgroundColor: colors.muted }}>
        <Text className="text-base font-semibold text-center" style={{ color: colors.textSecondary }}>
          لم نتمكن من عرض الملف
        </Text>
      </View>
    );
  }

  return (
    <View className="my-4">
      <View
        className="self-center rounded-xl overflow-hidden flex-1"
        style={{ width: contentWidth, height: pdfHeight }}
      >
        <WebView
          source={{ uri: viewerUrl }}
          className="flex-1 bg-gray-100"
          onError={() => setError(true)}
          onHttpError={() => setError(true)}
          scrollEnabled={true}
        />
      </View>
      <Pressable
        className="w-full mt-4 rounded-xl items-center justify-center flex-row gap-3 py-4 px-4 active:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: colors.secondary[500] }}
        onPress={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-[15px] font-medium text-white">حفظ الملف</Text>
        )}
      </Pressable>
    </View>
  );
}
