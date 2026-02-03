import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { HeaderTitleWithPoints } from '@/components/nav/HeaderTitleWithPoints';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { TAB_BAR_HEIGHT } from '@/lib/useTabBarBottomPadding';
import { kidSpring } from '@/lib/animations/springs';

const ICON_SIZE = 26;
const PILL_RADIUS = 24;
const PILL_PADDING_V = 10;
const PILL_PADDING_H = 12;
const BAR_RADIUS = 32;
const BAR_MARGIN_H = 12;

type IconName = React.ComponentProps<typeof FontAwesome>['name'];

function TabIcon({ name, color }: { name: IconName; color: string }) {
  return <FontAwesome name={name} size={ICON_SIZE} color={color} />;
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
    <Animated.View style={[styles.pill, { backgroundColor: pillBg }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

export default function TabLayout() {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

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
    backgroundColor: colors.tabBarBackground,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  };

  const screenOptions = {
    headerShown: true,
    headerTintColor: colors.text,
    headerTitle: () => <HeaderTitleWithPoints />,
    headerStyle: {
      backgroundColor: colors.background,
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerShadowVisible: false,
    tabBarStyle,
    tabBarShowLabel: false,
    tabBarActiveTintColor: colors.tabBarActivePillTint,
    tabBarInactiveTintColor: colors.tabIconDefault,
    tabBarActiveBackgroundColor: 'transparent',
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
      accessibilityState?: { selected?: boolean };
      [key: string]: unknown;
    }) => {
      const focused = props.accessibilityState?.selected ?? false;
      const pillBg = focused
        ? colors.tabBarActivePillBackground
        : colors.tabBarInactivePillBackground;
      return (
        <View style={styles.tabItemOuter}>
          <AnimatedTabPill focused={focused} pillBg={pillBg}>
            <Pressable {...props} style={[styles.tabItemInner, props.style as object]} />
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
        options={{ title: 'الألعاب', tabBarIcon: ({ color }) => <TabIcon name="gamepad" color={color} /> }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: 'الفيديوهات',
          tabBarIcon: ({ color }) => <TabIcon name="video-camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'أنا',
          tabBarIcon: ({ color }) => <TabIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItemOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    borderRadius: PILL_RADIUS,
    paddingVertical: PILL_PADDING_V,
    paddingHorizontal: PILL_PADDING_H,
    alignSelf: 'center',
  },
  tabItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
