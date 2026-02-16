import { PageHeader } from '@/components/content/page/header';
import Colors from '@/constants/Colors';
import { getSettingByKey } from '@/lib/api';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const TITLE_BY_KEY: Record<string, string> = {
  about: 'من نحن',
  policy: 'سياسة الاستخدام',
  privacy: 'سياسة الخصوصية',
};

/** عرض نص يشبه Markdown (عناوين، فقرات، نقاط) */
function SimpleMarkdownBody({
  content,
  colors,
}: {
  content: string;
  colors: typeof Colors.light;
}) {
  const blocks = content.split(/\n\n+/).filter(Boolean);
  const elements: React.ReactNode[] = [];

  blocks.forEach((block, i) => {
    const line = block.trim();
    if (!line) return;

    // عنوان رئيسي # أو ##
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h1Match) {
      elements.push(
        <Text key={`h1-${i}`} style={[styles.h1, { color: colors.foreground }]}>
          {h1Match[1]}
        </Text>
      );
      return;
    }
    if (h2Match) {
      elements.push(
        <Text key={`h2-${i}`} style={[styles.h2, { color: colors.foreground }]}>
          {h2Match[1]}
        </Text>
      );
      return;
    }

    // قائمة نقاط (* أو -)
    const listItems = line.split(/\n/).filter((l) => /^[\*\-]\s+/.test(l.trim()));
    if (listItems.length > 0) {
      listItems.forEach((item, j) => {
        const text = item.replace(/^[\*\-]\s+/, '').trim();
        elements.push(
          <View key={`li-${i}-${j}`} style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: colors.foreground }]}>• </Text>
            <Text style={[styles.paragraph, { color: colors.textSecondary, flex: 1 }]}>
              {text}
            </Text>
          </View>
        );
      });
      return;
    }

    // نص عادي (قد يحتوي ** للعريض)
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const paragraphContent = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={j} style={[styles.bold, { color: colors.textSecondary }]}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return part;
    });
    elements.push(
      <Text key={`p-${i}`} style={[styles.paragraph, { color: colors.textSecondary }]}>
        {paragraphContent}
      </Text>
    );
  });

  return <View style={styles.body}>{elements}</View>;
}

const styles = StyleSheet.create({
  body: { gap: 12 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  h2: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  paragraph: { fontSize: 16, lineHeight: 24 },
  bold: { fontWeight: '700' },
  bulletRow: { flexDirection: 'row', marginLeft: 8 },
  bullet: { fontSize: 16, lineHeight: 24 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

export default function PageByKeyScreen() {
  const { key: keyParam } = useLocalSearchParams<{ key: string }>();
  const key = keyParam ?? '';
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();

  const { data: value, isPending, error } = useQuery({
    queryKey: ['setting', key],
    queryFn: () => getSettingByKey(key),
    enabled: !!key,
  });

  const title = TITLE_BY_KEY[key] ?? key;

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [title, navigation]);

  if (!key) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
          صفحة غير موجودة
        </Text>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ marginTop: 12, color: colors.textSecondary }}>جاري التحميل...</Text>
      </View>
    );
  }

  if (error || value == null) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error, textAlign: 'center' }}>
          لم نتمكن من تحميل المحتوى. جرّب مرة أخرى.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <PageHeader title={title} />
      <SimpleMarkdownBody content={value} colors={colors} />
    </ScrollView>
  );
}

