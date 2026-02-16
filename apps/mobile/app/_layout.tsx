import '../global.css';

import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
} from '@expo-google-fonts/tajawal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nManager, Text, TextInput, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// تفعيل الاتجاه من اليمين لليسار (RTL) للتطبيق العربي — الهيدر والمحتوى يبدآن من اليمين
if (!I18nManager.getConstants().isRTL) {
  I18nManager.forceRTL(true);
}

import { RewardToast } from '@/components/gamification/RewardToast';
import Colors from '@/constants/Colors';
import { GamificationProvider } from '@/lib/gamification/context';
import { QueryProvider } from '@/lib/QueryProvider';
import { SettingsProvider } from '@/lib/settings/context';
import { fontFamily } from '@/lib/theme/fonts';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
  unstable_disableDynamicLoading: true,
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    [fontFamily.body]: Tajawal_400Regular,
    [fontFamily.heading]: Tajawal_700Bold,
    [fontFamily.numeric]: Tajawal_500Medium,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();
    // تطبيق خط تجوال كافتراضي لـ Text و TextInput في التطبيق
    const defaultFontStyle = { fontFamily: fontFamily.body };
    const setDefaultFont = (Component: typeof Text | typeof TextInput) => {
      const C = Component as typeof Text & { defaultProps?: { style?: unknown } };
      C.defaultProps = { ...C.defaultProps, style: [defaultFontStyle] };
    };
    setDefaultFont(Text);
    setDefaultFont(TextInput);
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <SettingsProvider>
          <GamificationProvider>
            <RootLayoutNav />
          </GamificationProvider>
        </SettingsProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}

const colors = Colors.light;
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.tint,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.error,
  },
};

function RootLayoutNav() {
  return (
    <ThemeProvider value={navTheme}>
      <View style={{ flex: 1, direction: 'rtl' }}>
        <RewardToast />
        <Stack >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="story/[id]" options={{ title: 'قصة', headerShown: false }} />
          <Stack.Screen name="game/[id]" options={{ title: 'لعبة', headerShown: false }} />
          <Stack.Screen name="video/[id]" options={{ title: 'فيديو', headerShown: false }} /> 
          <Stack.Screen name="pages/[key]" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
