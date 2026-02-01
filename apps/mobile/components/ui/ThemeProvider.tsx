import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { lightTheme, darkTheme, type ThemeColors } from '@/lib/theme';

const ThemeContext = createContext<ThemeColors | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = useMemo(
    () => (colorScheme === 'dark' ? darkTheme : lightTheme),
    [colorScheme]
  );
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeColors {
  const theme = useContext(ThemeContext);
  if (!theme) return lightTheme;
  return theme;
}
