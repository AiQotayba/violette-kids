/**
 * تخزين حالة الـ Gamification محلياً (AsyncStorage)
 * متوافق مع docs/GAMIFICATION-ARCHITECTURE.md
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMIFICATION_STORAGE_KEY } from './constants';
import type { GamificationState } from './types';
import { DEFAULT_ACHIEVEMENTS } from './achievements';

function toStoredAchievement(a: (typeof DEFAULT_ACHIEVEMENTS)[number], unlocked?: boolean, unlockedAt?: string) {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    icon: a.icon,
    unlocked: unlocked ?? a.unlocked,
    ...(unlockedAt && { unlockedAt }),
  };
}

const defaultState: GamificationState = {
  points: 0,
  level: 1,
  completions: [],
  achievements: DEFAULT_ACHIEVEMENTS.map((a) => toStoredAchievement(a)),
};

export async function getGamificationState(): Promise<GamificationState> {
  try {
    const raw = await AsyncStorage.getItem(GAMIFICATION_STORAGE_KEY);
    if (!raw) return { ...defaultState, achievements: [...defaultState.achievements] };
    const parsed = JSON.parse(raw) as Partial<GamificationState>;
    const achievements = DEFAULT_ACHIEVEMENTS.map((a) => {
      const stored = parsed.achievements?.find((s) => s.id === a.id);
      return toStoredAchievement(a, stored?.unlocked, stored?.unlockedAt);
    });
    return {
      points: typeof parsed.points === 'number' ? parsed.points : defaultState.points,
      level: typeof parsed.level === 'number' ? parsed.level : defaultState.level,
      completions: Array.isArray(parsed.completions) ? parsed.completions : defaultState.completions,
      achievements,
    };
  } catch {
    return { ...defaultState, achievements: defaultState.achievements.map((a) => ({ ...a })) };
  }
}

export async function setGamificationState(state: GamificationState): Promise<void> {
  try {
    await AsyncStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // تجاهل فشل الحفظ
  }
}
