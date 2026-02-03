import '../global.css';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { SettingsProvider, useEffectiveColorScheme } from '@/lib/settings/context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <RootLayoutNav />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useEffectiveColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, direction: 'rtl' }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="story/[id]" options={{ title: 'قصة' }} />
          <Stack.Screen name="game/[id]" options={{ title: 'لعبة' }} />
          <Stack.Screen name="video/[id]" options={{ title: 'فيديو' }} />
          <Stack.Screen name="settings" options={{ title: 'الإعدادات' }} />
          <Stack.Screen name="achievements" options={{ title: 'الإنجازات' }} />
          <Stack.Screen name="privacy" options={{ title: 'سياسة الخصوصية' }} />
          <Stack.Screen name="terms" options={{ title: 'شروط الخدمة' }} />
          <Stack.Screen name="about" options={{ title: 'من نحن' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
