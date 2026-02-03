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

  const points = 0;
  const level = 1;
  const levelLabel = level === 1 ? 'مبتدئ' : level < 5 ? 'نشيط' : 'بطل';

  const cardBg = isDark ? 'rgba(255,255,255,0.07)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const statBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.08)';
  const statBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.12)';

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
          <View style={[styles.statPill, { backgroundColor: statBg, borderColor: statBorder }]}>
            <View style={[styles.statIconWrap, { backgroundColor: theme.accent[400] + '22' }]}>
              <FontAwesome name="star" size={18} color={theme.accent[500]} />
            </View>
            <View style={styles.statTextWrap}>
              <Text style={[styles.statValue, { color: theme.foreground }]}>{points}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>نقاط</Text>
            </View>
          </View>
          <View style={[styles.statPill, { backgroundColor: statBg, borderColor: statBorder }]}>
            <View style={[styles.levelBadge, { backgroundColor: theme.primary[500] }]}>
              <Text style={styles.levelNum}>{level}</Text>
            </View>
            <View style={styles.statTextWrap}>
              <Text style={[styles.statValue, { color: theme.foreground }]}>{levelLabel}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>المستوى</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    fontSize: 15,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextWrap: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
