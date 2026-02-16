/**
 * إشعار احتفالي عند كسب نقاط أو فتح شارة
 * يعزز شعور الطفل أنه بطل في رحلة — وليس عدّاد مهام
 */

import Colors from '@/constants/Colors';
import { useGamification } from '@/lib/gamification/context';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

const TOAST_DURATION_MS = 3200;

export function RewardToast() {
  const { lastReward, clearLastReward } = useGamification();
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (!lastReward) return;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 14, stiffness: 120 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 100 }),
    ]).start();
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -16, duration: 200, useNativeDriver: true }),
      ]).start(() => clearLastReward());
    }, TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [lastReward, opacity, translateY, scale, clearLastReward]);

  if (!lastReward) return null;

  const hasPoints = lastReward.pointsEarned > 0;
  const hasLevelUp = lastReward.levelUp;
  const achievements = lastReward.achievementsUnlocked;
  const hasAchievements = achievements.length > 0;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 30,
        left: 16,
        right: 16,
        zIndex: 9999,
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    >
      <Pressable
        onPress={clearLastReward}
        className="rounded-2xl border-2 shadow-xl px-4 py-4"
        style={{
          backgroundColor: colors.card,
          borderColor: hasAchievements ? colors.primary[500] : colors.border,
        }}
      >
        <View className="flex-row items-center gap-3">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: hasAchievements
                ? `${colors.primary[500]}22`
                : `${colors.accent[500]}22`,
            }}
          >
            {hasAchievements ? (
              <Text className="text-2xl">🎉</Text>
            ) : (
              <Ionicons name="star" size={26} color={colors.accent[500]} />
            )}
          </View>
          <View className="flex-1">
            {hasAchievements && (
              <>
                <Text className="text-base font-bold" style={{ color: colors.text }}>
                  رائع! لقد حصلت على شارة
                </Text>
                {achievements.map((a) => (
                  <Text
                    key={a.id}
                    className="text-lg font-bold mt-0.5"
                    style={{ color: colors.primary[500] }}
                    numberOfLines={1}
                  >
                    {a.title}
                  </Text>
                ))}
              </>
            )}
            {!hasAchievements && hasPoints && (
              <Text className="text-base font-bold" style={{ color: colors.text }}>
                +{lastReward.pointsEarned} نقاط
              </Text>
            )}
            {hasLevelUp && (
              <Text className="text-sm font-semibold mt-1" style={{ color: colors.primary[500] }}>
                ترقية مستوى! 🎉
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
