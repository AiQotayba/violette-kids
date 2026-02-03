import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DEFAULT_ACHIEVEMENTS, type Achievement } from '@/lib/gamification/achievements';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';

export default function AchievementsScreen() {
  const [achievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const colorScheme = useEffectiveColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  // TODO: تحميل/حفظ من AsyncStorage عند إضافة @react-native-async-storage/async-storage

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>الإنجازات</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        أكمل المهام لفتح الشارات
      </Text>
      {achievements.map((a) => (
        <View
          key={a.id}
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
            !a.unlocked && styles.cardLocked,
          ]}
        >
          <Text style={styles.icon}>{a.icon}</Text>
          <View style={styles.body}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{a.title}</Text>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{a.description}</Text>
          </View>
          {a.unlocked ? (
            <Text style={[styles.badge, { color: theme.success }]}>✓</Text>
          ) : (
            <Text style={[styles.badgeLocked, { color: theme.neutral[300] }]}>—</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardLocked: { opacity: 0.85 },
  icon: { fontSize: 32, marginRight: 12 },
  body: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDesc: { fontSize: 13, marginTop: 2 },
  badge: { fontSize: 18, fontWeight: '700' },
  badgeLocked: { fontSize: 18 },
});
