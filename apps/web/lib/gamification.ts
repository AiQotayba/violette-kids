"use client";

// Local Gamification System - No database storage
// Uses localStorage for simple progress tracking

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GamificationState {
  stars: number;
  level: number;
  storiesRead: number;
  videosWatched: number;
  gamesPlayed: number;
  achievements: Achievement[];
  currentStreak: number;
  lastVisit?: string;
}

const STORAGE_KEY = "kids-library-progress";

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-story",
    title: "القارئ الصغير",
    description: "قرأت قصتك الأولى!",
    icon: "📖",
    unlocked: false,
  },
  {
    id: "five-stories",
    title: "محب القراءة",
    description: "قرأت 5 قصص!",
    icon: "📚",
    unlocked: false,
  },
  {
    id: "first-video",
    title: "المشاهد الفضولي",
    description: "شاهدت فيديو تعليمي!",
    icon: "🎬",
    unlocked: false,
  },
  {
    id: "five-videos",
    title: "طالب العلم",
    description: "شاهدت 5 فيديوهات!",
    icon: "🌟",
    unlocked: false,
  },
  {
    id: "first-game",
    title: "اللاعب المبتدئ",
    description: "لعبت لعبتك الأولى!",
    icon: "🎮",
    unlocked: false,
  },
  {
    id: "explorer",
    title: "المستكشف",
    description: "جربت كل أنواع المحتوى!",
    icon: "🧭",
    unlocked: false,
  },
  {
    id: "streak-3",
    title: "المثابر",
    description: "زرت المكتبة 3 أيام متتالية!",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: "level-5",
    title: "نجم المكتبة",
    description: "وصلت للمستوى 5!",
    icon: "⭐",
    unlocked: false,
  },
];

const DEFAULT_STATE: GamificationState = {
  stars: 0,
  level: 1,
  storiesRead: 0,
  videosWatched: 0,
  gamesPlayed: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
  currentStreak: 0,
};

export function getGamificationState(): GamificationState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;

    const state = JSON.parse(stored) as GamificationState;

    // Check and update streak
    const today = new Date().toDateString();
    if (state.lastVisit) {
      const lastVisit = new Date(state.lastVisit);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit.toDateString() === yesterday.toDateString()) {
        state.currentStreak += 1;
      } else if (lastVisit.toDateString() !== today) {
        state.currentStreak = 1;
      }
    } else {
      state.currentStreak = 1;
    }

    state.lastVisit = today;
    saveGamificationState(state);

    return state;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveGamificationState(state: GamificationState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

export function addStars(amount: number): GamificationState {
  const state = getGamificationState();
  state.stars += amount;

  // Level up every 50 stars
  const newLevel = Math.floor(state.stars / 50) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    checkAchievement(state, "level-5", state.level >= 5);
  }

  saveGamificationState(state);
  return state;
}

export function recordStoryRead(): GamificationState {
  const state = getGamificationState();
  state.storiesRead += 1;
  state.stars += 10;

  checkAchievement(state, "first-story", state.storiesRead >= 1);
  checkAchievement(state, "five-stories", state.storiesRead >= 5);
  checkExplorerAchievement(state);

  // Level up
  const newLevel = Math.floor(state.stars / 50) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    checkAchievement(state, "level-5", state.level >= 5);
  }

  saveGamificationState(state);
  return state;
}

export function recordVideoWatched(): GamificationState {
  const state = getGamificationState();
  state.videosWatched += 1;
  state.stars += 8;

  checkAchievement(state, "first-video", state.videosWatched >= 1);
  checkAchievement(state, "five-videos", state.videosWatched >= 5);
  checkExplorerAchievement(state);

  // Level up
  const newLevel = Math.floor(state.stars / 50) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    checkAchievement(state, "level-5", state.level >= 5);
  }

  saveGamificationState(state);
  return state;
}

export function recordGamePlayed(): GamificationState {
  const state = getGamificationState();
  state.gamesPlayed += 1;
  state.stars += 5;

  checkAchievement(state, "first-game", state.gamesPlayed >= 1);
  checkExplorerAchievement(state);

  // Level up
  const newLevel = Math.floor(state.stars / 50) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    checkAchievement(state, "level-5", state.level >= 5);
  }

  saveGamificationState(state);
  return state;
}

function checkAchievement(
  state: GamificationState,
  achievementId: string,
  condition: boolean
): boolean {
  if (!condition) return false;

  const achievement = state.achievements.find((a) => a.id === achievementId);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    return true;
  }
  return false;
}

function checkExplorerAchievement(state: GamificationState): void {
  if (
    state.storiesRead >= 1 &&
    state.videosWatched >= 1 &&
    state.gamesPlayed >= 1
  ) {
    checkAchievement(state, "explorer", true);
  }
}

export function checkStreakAchievement(): GamificationState {
  const state = getGamificationState();
  checkAchievement(state, "streak-3", state.currentStreak >= 3);
  saveGamificationState(state);
  return state;
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
