import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DEFAULT_ACHIEVEMENTS, type Achievement } from '@/lib/gamification/achievements';
import { lightTheme } from '@/lib/theme';

export default function AchievementsScreen() {
  const [achievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  // TODO: تحميل/حفظ من AsyncStorage عند إضافة @react-native-async-storage/async-storage

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>الإنجازات</Text>
      <Text style={styles.subtitle}>أكمل المهام لفتح الشارات</Text>
      {achievements.map((a) => (
        <View key={a.id} style={[styles.card, !a.unlocked && styles.cardLocked]}>
          <Text style={styles.icon}>{a.icon}</Text>
          <View style={styles.body}>
            <Text style={styles.cardTitle}>{a.title}</Text>
            <Text style={styles.cardDesc}>{a.description}</Text>
          </View>
          {a.unlocked ? (
            <Text style={styles.badge}>✓</Text>
          ) : (
            <Text style={styles.badgeLocked}>—</Text>
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
    color: lightTheme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: lightTheme.textSecondary,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  cardLocked: { opacity: 0.85 },
  icon: { fontSize: 32, marginRight: 12 },
  body: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: lightTheme.text },
  cardDesc: { fontSize: 13, color: lightTheme.textSecondary, marginTop: 2 },
  badge: { fontSize: 18, color: lightTheme.success, fontWeight: '700' },
  badgeLocked: { fontSize: 18, color: lightTheme.neutral[300] },
});
