import { ScrollView, StyleSheet, Text } from 'react-native';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';

export default function TermsScreen() {
  const colorScheme = useEffectiveColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>شروط الخدمة</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        محتوى شروط الخدمة سيُضاف هنا. يمكنك تحديث هذا النص ليعكس الشروط الفعلية للتطبيق.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 24 },
});
