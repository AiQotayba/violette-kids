import { ScrollView, StyleSheet, Text } from 'react-native';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';

export default function AboutScreen() {
  const colorScheme = useEffectiveColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>من نحن</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        تطبيق Violette Kids موجّه للأطفال ويوفّر قصصاً وألعاباً وفيديوهات تعليمية. فريق التطوير:
        Osus plus.
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
