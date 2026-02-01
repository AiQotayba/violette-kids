import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';
import { kidTiming } from '@/lib/animations/springs';

export function HomeHero() {
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مرحباً';
    return 'مساء الخير';
  };

  const stars = 0;
  const level = 1;
  const levelLabel = level === 1 ? 'مبتدئ' : level < 5 ? 'نشيط' : 'بطل';

  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const statBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <Animated.View
      entering={FadeInDown.duration(kidTiming.normal).springify()}
      style={styles.wrap}
    >
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.greeting, { color: theme.textSecondary }]}>
          {getGreeting()}
        </Text>
        <Text style={[styles.title, { color: theme.foreground }]}>
          ماذا تريد أن تفعل اليوم؟
        </Text>

        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: statBg }]}>
            <FontAwesome name="star" size={16} color={theme.accent[500]} />
            <Text style={[styles.statValue, { color: theme.foreground }]}>{stars}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>نجمة</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: statBg }]}>
            <View style={[styles.levelBadge, { backgroundColor: theme.primary[500] }]}>
              <Text style={styles.levelNum}>{level}</Text>
            </View>
            {/* <Text style={[styles.statValue, { color: theme.foreground }]}>المستوى</Text> */}
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{levelLabel}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 1,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
