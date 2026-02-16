import { HeaderTitleWithPoints } from '@/components/nav/HeaderTitleWithPoints';
import Colors from '@/constants/Colors';
import { kidSpring } from '@/lib/animations/springs';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { TAB_BAR_HEIGHT } from '@/lib/useTabBarBottomPadding';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_SIZE = 26;
const BAR_RADIUS = 32;
const BAR_MARGIN_H = 12;

function getActivePillColor(
  focused: boolean,
  href: string | undefined,
  tabPillColors: Record<string, string>
): string {
  if (!focused) return 'transparent';
  const path = typeof href === 'string' ? href : '';
  return tabPillColors[path] ?? tabPillColors['/'];
}

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color }: { name: IconName; color: string }) {
  return <Ionicons name={name} size={ICON_SIZE} color={color} />;
}

function AnimatedTabPill({
  focused,
  pillBg,
  children,
}: {
  focused: boolean;
  pillBg: string;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.06 : 1, kidSpring.entrance);
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className="rounded-[24px] py-2.5 px-3 self-center"
      style={[{ backgroundColor: pillBg }, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}

export default function TabLayout() {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const tabPillColors = useMemo(
    () => ({
      '/': colors.tabPillHomeProfile,
      '/profile': colors.tabPillHomeProfile,
      '/stories': colors.tabPillStories,
      '/games': colors.tabPillGames,
      '/videos': colors.tabPillVideos,
    }),
    [colors]
  );

  const tabBarStyle = {
    position: 'absolute' as const,
    left: BAR_MARGIN_H,
    right: BAR_MARGIN_H,
    bottom: 0,
    height: TAB_BAR_HEIGHT + insets.bottom,
    paddingBottom: insets.bottom,
    paddingTop: 12,
    paddingHorizontal: 6,
    borderRadius: BAR_RADIUS,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // backgroundColor: colors.tabBarBackground,
    borderTopWidth: 0,
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  };

  const screenOptions = {
    headerShown: true,
    headerTintColor: colors.secondary[500],
    headerTitle: () => <HeaderTitleWithPoints />,
    headerStyle: {
      // backgroundColor: colors.background,
      // shadowColor: 'transparent',
      elevation: 0,
    },
    headerShadowVisible: false,
    tabBarStyle,
    tabBarShowLabel: false,
    tabBarActiveTintColor:  "#fff",
    tabBarInactiveTintColor: colors.tabIconDefault,
    tabBarItemStyle: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 4,
      paddingHorizontal: 2,
      marginHorizontal: 0,
    },
    tabBarButton: (props: {
      children: React.ReactNode;
      style?: unknown;
      'aria-selected'?: boolean;
      [key: string]: unknown;
    }) => {
      const focused = props['aria-selected'] ?? false;
      const pillBg = getActivePillColor(focused, props.href as string | undefined, tabPillColors);
      return (
        <View className="flex-1 items-center justify-center">
          <AnimatedTabPill focused={focused} pillBg={pillBg}>
            <Pressable
              {...props}
              style={[props.style as object]}
              className="flex-row items-center justify-center"
            />
          </AnimatedTabPill>
        </View>
      );
    },
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{ title: 'الرئيسية', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="stories"
        options={{ title: 'القصص', tabBarIcon: ({ color }) => <TabIcon name="book" color={color} /> }}
      />
      <Tabs.Screen
        name="games"
        options={{ title: 'الألعاب', tabBarIcon: ({ color }) => <TabIcon name="game-controller" color={color} /> }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: 'الفيديوهات',
          tabBarIcon: ({ color }) => <TabIcon name="play-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'أنا',
          tabBarIcon: ({ color }) => <TabIcon name="person" color={color} />,
        }}
      />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
