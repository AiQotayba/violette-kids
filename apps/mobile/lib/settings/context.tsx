'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { setApiBaseUrl as setClientApiBaseUrl } from '@/lib/api/client';

export type Language = 'ar' | 'en';
export type ThemePreference = 'light' | 'dark' | 'system';

const DEFAULT_API_BASE = 'http://localhost:4000/api';

/** وضع خصوصية مشغّل يوتيوب: إخفاء الفيديوهات المقترحة والتعليقات التوضيحية والتركيز على الفيديو فقط */
export type YoutubePrivacyMode = boolean;

interface SettingsState {
  apiBaseUrl: string;
  language: Language;
  themePreference: ThemePreference;
  /** تفعيل وضع الخصوصية للمشغّل (افتراضي: true) */
  youtubePrivacyMode: YoutubePrivacyMode;
}

interface SettingsContextValue extends SettingsState {
  setApiBaseUrl: (url: string) => void;
  setLanguage: (lang: Language) => void;
  setThemePreference: (theme: ThemePreference) => void;
  setYoutubePrivacyMode: (enabled: YoutubePrivacyMode) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [apiBaseUrl, setApiBaseUrlState] = useState(DEFAULT_API_BASE);
  const [language, setLanguageState] = useState<Language>('ar');
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [youtubePrivacyMode, setYoutubePrivacyModeState] = useState<YoutubePrivacyMode>(true);

  const setApi = useCallback((url: string) => {
    setApiBaseUrlState(url);
    setClientApiBaseUrl(url);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      apiBaseUrl,
      language,
      themePreference,
      youtubePrivacyMode,
      setApiBaseUrl: setApi,
      setLanguage: setLanguageState,
      setThemePreference: setThemePreferenceState,
      setYoutubePrivacyMode: setYoutubePrivacyModeState,
    }),
    [apiBaseUrl, language, themePreference, youtubePrivacyMode, setApi]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}

/** الثيم الفعّال: التطبيق يعمل دائماً بالوضع الفاتح (light) */
export function useEffectiveColorScheme(): 'light' | 'dark' {
  return 'light';
}
