"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Trophy,
  BookOpen,
  Video,
  Gamepad2,
  Flame,
  Lock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import {
  getGamificationState,
  resetProgress,
  type GamificationState,
  type Achievement,
} from "@/lib/gamification";

export default function AchievementsPage() {
  const [gamificationState, setGamificationState] =
    useState<GamificationState | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setGamificationState(getGamificationState());
  }, []);

  const handleReset = () => {
    resetProgress();
    setGamificationState(getGamificationState());
    setShowResetConfirm(false);
  };

  if (!gamificationState) {
    return (
      <div className="min-h-screen flex flex-col bg-background pb-24">
        <MobileHeader title="نجومي" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-bounce-soft">
            <Star className="w-12 h-12 text-accent-foreground fill-accent-foreground" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const unlockedCount = gamificationState.achievements.filter(
    (a) => a.unlocked
  ).length;
  const totalCount = gamificationState.achievements.length;
  const progressToNextLevel = ((gamificationState.stars % 50) / 50) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <MobileHeader title="نجومي" />
      <main className="flex-1 overflow-auto">
        {/* Hero Stats */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-gradient-to-br from-accent/30 via-accent/20 to-primary/20 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-6">
              {/* Total Stars */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center shadow-md">
                  <Star className="w-8 h-8 text-accent-foreground fill-accent-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {gamificationState.stars}
                  </p>
                  <p className="text-sm text-muted-foreground">نجمة</p>
                </div>
              </div>
              {/* Level */}
              <div className="text-center px-4 py-2 bg-card/80 backdrop-blur-sm rounded-xl">
                <p className="text-2xl font-bold text-primary">
                  {gamificationState.level}
                </p>
                <p className="text-xs text-muted-foreground">المستوى</p>
              </div>
            </div>

            {/* Progress to next level */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  المستوى التالي
                </span>
                <span className="font-medium text-foreground">
                  {gamificationState.stars % 50} / 50
                </span>
              </div>
              <div className="h-3 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-card rounded-2xl p-3 text-center border border-border">
              <Flame className="w-6 h-6 text-destructive mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {gamificationState.currentStreak}
              </p>
              <p className="text-xs text-muted-foreground">يوم</p>
            </div>
            <div className="bg-card rounded-2xl p-3 text-center border border-border">
              <BookOpen className="w-6 h-6 text-stories mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {gamificationState.storiesRead}
              </p>
              <p className="text-xs text-muted-foreground">قصة</p>
            </div>
            <div className="bg-card rounded-2xl p-3 text-center border border-border">
              <Video className="w-6 h-6 text-videos mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {gamificationState.videosWatched}
              </p>
              <p className="text-xs text-muted-foreground">فيديو</p>
            </div>
            <div className="bg-card rounded-2xl p-3 text-center border border-border">
              <Gamepad2 className="w-6 h-6 text-games mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {gamificationState.gamesPlayed}
              </p>
              <p className="text-xs text-muted-foreground">لعبة</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent-foreground" />
              الإنجازات
            </h2>
            <span className="text-sm text-muted-foreground">
              {unlockedCount}/{totalCount}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {gamificationState.achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Reset Progress */}
        <div className="px-4 py-6">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-bold text-foreground mb-1 text-sm">
              إعادة تعيين التقدم
            </h3>
            <p className="text-muted-foreground text-xs mb-3">
              سيؤدي هذا إلى حذف جميع النجوم والإنجازات
            </p>
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                  className="rounded-xl flex-1"
                >
                  تأكيد
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                  className="rounded-xl flex-1 bg-transparent"
                >
                  إلغاء
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                className="rounded-xl bg-transparent"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={`relative bg-card rounded-2xl p-4 border border-border transition-all ${
        achievement.unlocked ? "shadow-sm" : "opacity-50 grayscale"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl ${
          achievement.unlocked ? "bg-accent/20" : "bg-muted"
        }`}
      >
        {achievement.unlocked ? (
          achievement.icon
        ) : (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="text-center">
        <h4 className="font-bold text-foreground text-sm mb-0.5">
          {achievement.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {achievement.description}
        </p>
      </div>

      {/* Unlocked Badge */}
      {achievement.unlocked && (
        <div className="absolute top-2 left-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
        </div>
      )}
    </div>
  );
}
