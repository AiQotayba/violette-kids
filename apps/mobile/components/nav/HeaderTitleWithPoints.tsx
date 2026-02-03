import Constants from 'expo-constants';
import { View, Text, Image, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import Colors from '@/constants/Colors';
import { kidTiming } from '@/lib/animations/springs';

const APP_NAME = Constants.expoConfig?.name ?? 'Violette Kids';

/** النقاط المستحصلة - يُربط لاحقاً بنظام الإنجازات/التخزين */
const PLACEHOLDER_POINTS = 0;

export function HeaderTitleWithPoints() {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View
      entering={FadeInDown.duration(kidTiming.normal).springify().damping(18)}
      style={styles.wrap}
    >
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="شعار قصص همسة"
      />
      <Text style={[styles.appName, { color: colors.text }]} numberOfLines={1}>
        {APP_NAME}
      </Text>
      <View style={[styles.pointsRow, { backgroundColor: colors.pointsPillBg }]}>
        <FontAwesome name="star" size={12} color={colors.pointsPillStar} />
        <Text style={[styles.pointsText, { color: colors.text }]}>
          {PLACEHOLDER_POINTS} نقاط
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  logo: {
    width: 36,
    height: 36,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
