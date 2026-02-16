/**
 * خدمة الـ Gamification: قواعد النقاط، المستوى، فتح الشارات
 * معايير الـ 20 شارة المحفّزة
 */

import { ACHIEVEMENT_IDS } from './achievements';
import { LEVEL_THRESHOLDS, POINTS } from './constants';
import { getGamificationState, setGamificationState } from './storage';
import type { ContentType } from './types';
import type { GamificationState, RecordCompletionResult, StoredAchievement } from './types';

function getLevelFromPoints(points: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
}

function getCounts(state: GamificationState) {
  const total = state.completions.length;
  const storyCount = state.completions.filter((c) => c.contentType === 'story').length;
  const videoCount = state.completions.filter((c) => c.contentType === 'video').length;
  const gameCount = state.completions.filter((c) => c.contentType === 'game').length;
  const level = state.level;
  const points = state.points;
  return { total, storyCount, videoCount, gameCount, level, points };
}

/** معايير فتح كل شارة — تدرّج ذكي يحافظ على الدافعية */
function checkAchievementCriteria(id: string, state: GamificationState): boolean {
  const { total, storyCount, videoCount, gameCount, level, points } = getCounts(state);

  switch (id) {
    case ACHIEVEMENT_IDS.FIRST_STEP:
      return total >= 1;
    case ACHIEVEMENT_IDS.STRONG_START:
      return total >= 3;
    case ACHIEVEMENT_IDS.ON_THE_RIGHT_PATH:
      return total >= 5;
    case ACHIEVEMENT_IDS.LITTLE_LEARNER:
      return points >= 50;
    case ACHIEVEMENT_IDS.STORY_FRIEND:
      return storyCount >= 5;
    case ACHIEVEMENT_IDS.VIDEO_LOVER:
      return videoCount >= 5;
    case ACHIEVEMENT_IDS.GAMES_LOVER:
      return gameCount >= 5;
    case ACHIEVEMENT_IDS.NEW_EXPLORER:
      return total >= 10;
    case ACHIEVEMENT_IDS.ACTIVE_LEARNER:
      return total >= 15;
    case ACHIEVEMENT_IDS.SMART_MIND:
      return points >= 100;
    case ACHIEVEMENT_IDS.LEVEL_TWO:
      return level >= 2;
    case ACHIEVEMENT_IDS.LITTLE_CHAMPION:
      return total >= 20;
    case ACHIEVEMENT_IDS.DISTINGUISHED_READER:
      return storyCount >= 20;
    case ACHIEVEMENT_IDS.DISTINGUISHED_VIEWER:
      return videoCount >= 20;
    case ACHIEVEMENT_IDS.DISTINGUISHED_PLAYER:
      return gameCount >= 20;
    case ACHIEVEMENT_IDS.LEARNING_STAR:
      return points >= 200;
    case ACHIEVEMENT_IDS.LEARNING_CHAMPION:
      return total >= 30;
    case ACHIEVEMENT_IDS.VIOLETTE_STAR:
      return level >= 5;
    case ACHIEVEMENT_IDS.LITTLE_LEGEND:
      return points >= 300;
    case ACHIEVEMENT_IDS.GREAT_VIOLETTE_CHAMPION:
      return total >= 50;
    case ACHIEVEMENT_IDS.VIOLETTE_LEGEND:
      return level >= 10 && points >= 500 && total >= 50;
    default:
      return false;
  }
}

export async function loadGamificationState(): Promise<GamificationState> {
  return getGamificationState();
}

export async function recordCompletion(
  contentType: ContentType,
  contentId: string
): Promise<RecordCompletionResult> {
  const state = await getGamificationState();
  const idStr = String(contentId);
  const alreadyCompleted = state.completions.some(
    (c) => c.contentType === contentType && c.contentId === idStr
  );
  if (alreadyCompleted) {
    return {
      pointsEarned: 0,
      levelUp: false,
      achievementsUnlocked: [],
      alreadyCompleted: true,
    };
  }

  const pointsEarned = POINTS[contentType];
  const newPoints = state.points + pointsEarned;
  const newLevel = getLevelFromPoints(newPoints);
  const levelUp = newLevel > state.level;
  const completedAt = new Date().toISOString();

  const newCompletions = [
    ...state.completions,
    { contentType, contentId: idStr, completedAt },
  ];

  const newState: GamificationState = {
    ...state,
    points: newPoints,
    level: newLevel,
    completions: newCompletions,
    achievements: state.achievements.map((a) => {
      if (a.unlocked) return a;
      const unlocked = checkAchievementCriteria(a.id, { ...state, completions: newCompletions });
      return unlocked
        ? { ...a, unlocked: true, unlockedAt: completedAt }
        : a;
    }),
  };

  const achievementsUnlocked = newState.achievements.filter(
    (a) => a.unlocked && !state.achievements.find((s) => s.id === a.id && s.unlocked)
  );

  await setGamificationState(newState);

  return {
    pointsEarned,
    levelUp,
    achievementsUnlocked,
    alreadyCompleted: false,
  };
}

/** نسبة التقدم داخل المستوى الحالي (0–100) */
export function getProgressPercentInLevel(state: GamificationState): number {
  const idx = state.level - 1;
  const currentThreshold = LEVEL_THRESHOLDS[idx] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[state.level] ?? currentThreshold + 100;
  const range = nextThreshold - currentThreshold;
  if (range <= 0) return 100;
  const progressInLevel = state.points - currentThreshold;
  return Math.min(100, Math.max(0, Math.round((progressInLevel / range) * 100)));
}
