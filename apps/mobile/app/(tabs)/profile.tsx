import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';
import { useGamification } from '@/lib/gamification/context';
import type { StoredAchievement } from '@/lib/gamification/types';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { useTabBarBottomPadding } from '@/lib/useTabBarBottomPadding';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const appName = Constants.expoConfig?.name;

type AppColors = (typeof Colors)['light'];

function RowLink({
  label,
  onPress,
  colors,
  icon,
  showBorder = true,
}: {
  label: string;
  onPress: () => void;
  colors: AppColors;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  showBorder?: boolean;
}) {
  return (
    <Pressable
      className={`py-2.5 ${showBorder ? 'border-b' : ''} active:opacity-70`}
      style={showBorder ? { borderBottomColor: colors.border } : undefined}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between p-2.5">
        <View className="flex-row items-center gap-2.5 flex-1">
          <View
            className="w-9 h-9 rounded-lg justify-center items-center mr-3"
            style={{ backgroundColor: colors.muted }}
          >
            <FontAwesome name={icon} size={16} color={colors.tint} />
          </View>
          <Text className="text-base flex-1" style={{ color: colors.text, fontFamily: 'Tajawal_500Medium' }}>
            {label}
          </Text>
        </View>
        <FontAwesome
          name="chevron-left"
          size={12}
          color={colors.textSecondary}
          style={{ transform: [{ rotate: '180deg' }] }}
        />
      </View>
    </Pressable>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function AchievementGridCard({
  achievement,
  colors,
  index,
}: {
  achievement: StoredAchievement;
  colors: AppColors;
  index: number;
}) {
  const locked = !achievement.unlocked;
  return (
    <Animated.View
      entering={FadeInDown.delay(40 + index * 25).duration(350).springify()}
      className="rounded-2xl border p-2 flex-1 min-w-0 items-center justify-center"
      style={{
        backgroundColor: locked ? colors.muted : colors.card,
        borderColor: colors.border,
        marginHorizontal: 3,
        marginBottom: 6,
        minHeight: 88,
      }}
    >
      {locked ? (
        <View
          className="w-11 h-11 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${colors.neutral[300]}22` }}
        >
          <Ionicons name="lock-closed" size={26} color={colors.neutral[300]} />
        </View>
      ) : (
        <>
          <View className="absolute top-1.5 left-1.5 z-[1]">
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          </View>
          <View
            className="w-11 h-11 rounded-xl items-center justify-center mb-1.5"
            style={{ backgroundColor: `${colors.tabPillGames}22` }}
          >
            <Text className="text-xl" selectable={false}>
              {achievement.icon}
            </Text>
          </View>
          <Text
            className="text-[12px] text-center"
            style={{ fontFamily: 'Tajawal_700Bold', color: colors.text }}
            numberOfLines={2}
          >
            {achievement.title}
          </Text>
        </>
      )}
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const tabBarBottomPadding = useTabBarBottomPadding();
  const { achievements, points, level, isLoading } = useGamification();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const rows = chunk(achievements, 3);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: '#eeeeee' }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: tabBarBottomPadding }}
      showsVerticalScrollIndicator={false}
    >
      {/* بطاقة التطبيق */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        className="rounded-3xl border overflow-hidden mb-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <View className="py-6 px-5 items-center">
          <Image
            source={require('../../assets/images/logo.png')}
            className="w-44 h-44 mb-3"
            resizeMode="contain"
            accessibilityLabel="عالم همسة - نتعلم ونمرح معاً"
          />
          <Text className="text-lg" style={{ color: colors.textSecondary, fontFamily: 'Tajawal_700Bold' }}>
            {appName}
          </Text>
        </View>
      </Animated.View>

      {/* الإنجازات — مع ملخص وشبكة الشارات */}
      <Animated.View
        entering={FadeInDown.delay(60).duration(400).springify()}
        className="rounded-3xl border overflow-hidden mb-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <View className="flex-row items-center gap-3">
            <View
              className="w-11 h-11 rounded-2xl items-center justify-center"
              style={{ backgroundColor: `${colors.tabPillGames}22` }}
            >
              <Ionicons name="trophy" size={24} color={colors.tabPillGames} />
            </View>
            <View>
              <Text className="text-lg" style={{ color: colors.foreground, fontFamily: 'Tajawal_700Bold' }}>
                الشارات
              </Text>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                {points} نقطة · المستوى {level}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-xl" style={{ color: colors.primary[500], fontFamily: 'Tajawal_700Bold' }}>
              {unlockedCount}/{totalCount}
            </Text>
            <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
              مفتوحة
            </Text>
          </View>
        </View>
        {isLoading ? (
          <View className="py-8 items-center">
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              جاري تحميل الشارات...
            </Text>
          </View>
        ) : (
          <View className="px-1 pb-4 pt-1">
            {rows.map((row, rowIndex) => (
              <View
                key={rowIndex}
                className="flex-row"
                style={{ marginBottom: rowIndex < rows.length - 1 ? 0 : 0 }}
              >
                {row.map((a, colIndex) => (
                  <AchievementGridCard
                    key={a.id}
                    achievement={a}
                    colors={colors}
                    index={rowIndex * 3 + colIndex}
                  />
                ))}
                {row.length < 3 && <View className="flex-1" style={{ marginHorizontal: 3 }} />}
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      {/* صفحات */}
      <Animated.View
        entering={FadeInDown.delay(120).duration(400).springify()}
        className="rounded-3xl border overflow-hidden mb-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
          <View
            className="w-11 h-11 rounded-2xl items-center justify-center"
            style={{ backgroundColor: `${colors.tabPillStories}22` }}
          >
            <Ionicons name="document-text" size={24} color={colors.tabPillStories} />
          </View>
          <Text className="text-lg" style={{ color: colors.foreground, fontFamily: 'Tajawal_700Bold' }}>
            صفحات
          </Text>
        </View>
        <View className="px-2 pb-2">
          <RowLink
            label="سياسة الخصوصية"
            colors={colors}
            icon="lock"
            onPress={() => router.push('/pages/privacy' as never)}
          />
          <RowLink
            label="سياسة الاستخدام"
            colors={colors}
            icon="file-text-o"
            onPress={() => router.push('/pages/policy' as never)}
          />
          <RowLink
            label="من نحن"
            colors={colors}
            icon="info-circle"
            onPress={() => router.push('/pages/about' as never)}
            showBorder={false}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}
