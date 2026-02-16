/**
 * Context موحد للـ Gamification — المصدر الوحيد للقراءة من الواجهة
 * متوافق مع docs/GAMIFICATION-ARCHITECTURE.md
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getProgressPercentInLevel,
  loadGamificationState,
  recordCompletion as recordCompletionService,
} from './service';
import type { ContentType } from './types';
import type { GamificationState, RecordCompletionResult, StoredAchievement } from './types';

interface GamificationContextValue {
  /** النقاط الحالية */
  points: number;
  /** المستوى الحالي */
  level: number;
  /** نسبة التقدم داخل المستوى (0–100) */
  progressPercent: number;
  /** قائمة الإنجازات مع حالة الفتح */
  achievements: StoredAchievement[];
  /** تحميل أولي */
  isLoading: boolean;
  /** تسجيل إكمال محتوى — يُحدّث النقاط والمستوى والإنجازات فوراً */
  recordCompletion: (contentType: ContentType, contentId: string) => Promise<RecordCompletionResult>;
  /** آخر مكافأة (لإظهار Toast/إشعار) — يُصفَّر بعد القراءة */
  lastReward: {
    pointsEarned: number;
    levelUp: boolean;
    achievementsUnlocked: StoredAchievement[];
  } | null;
  /** مسح lastReward بعد عرض الإشعار */
  clearLastReward: () => void;
  /** هل تم إكمال هذا المحتوى (قصة/فيديو/لعبة)؟ */
  isContentCompleted: (contentType: ContentType, contentId: string) => boolean;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastReward, setLastReward] = useState<GamificationContextValue['lastReward']>(null);

  const refresh = useCallback(async () => {
    const loaded = await loadGamificationState();
    setState(loaded);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadGamificationState().then((loaded) => {
      if (!cancelled) {
        setState(loaded);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const recordCompletion = useCallback(
    async (contentType: ContentType, contentId: string) => {
      const result = await recordCompletionService(contentType, contentId);
      await refresh();
      if (!result.alreadyCompleted && (result.pointsEarned > 0 || result.achievementsUnlocked.length > 0)) {
        setLastReward({
          pointsEarned: result.pointsEarned,
          levelUp: result.levelUp,
          achievementsUnlocked: result.achievementsUnlocked,
        });
      }
      return result;
    },
    [refresh]
  );

  const clearLastReward = useCallback(() => setLastReward(null), []);

  const isContentCompleted = useCallback(
    (contentType: ContentType, contentId: string) =>
      state?.completions.some(
        (c) => c.contentType === contentType && c.contentId === String(contentId)
      ) ?? false,
    [state?.completions]
  );

  const value: GamificationContextValue = {
    points: state?.points ?? 0,
    level: state?.level ?? 1,
    progressPercent: state ? getProgressPercentInLevel(state) : 0,
    achievements: state?.achievements ?? [],
    isLoading,
    recordCompletion,
    lastReward,
    clearLastReward,
    isContentCompleted,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification(): GamificationContextValue {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return ctx;
}

/** للاستخدام في مكونات قد لا تكون داخل الـ Provider (تعيد قيماً افتراضية) */
export function useGamificationOptional(): GamificationContextValue | null {
  return useContext(GamificationContext);
}
