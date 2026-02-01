"use client";

import { useEffect, useState } from "react";
import { Star, Sparkles } from "lucide-react";
import { getGamificationState, type GamificationState } from "@/lib/gamification";

export function MobileHero() {
  const [gamificationState, setGamificationState] =
    useState<GamificationState | null>(null);

  useEffect(() => {
    setGamificationState(getGamificationState());
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 17) return "مرحباً";
    return "مساء الخير";
  };

  return (
    <section className="px-4 pt-4 pb-2">
      <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-3xl p-5 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-accent/30 animate-float" />
        <div className="absolute bottom-6 right-8 w-6 h-6 rounded-full bg-primary/30 animate-float stagger-2" />
        <Sparkles className="absolute top-6 right-6 w-5 h-5 text-accent/50 animate-sparkle" />

        {/* Content */}
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground mb-1">{getGreeting()}</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            ماذا تريد أن تفعل اليوم؟
          </h2>

          {/* Stats Row */}
          {gamificationState && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/80 backdrop-blur-sm">
                <Star className="w-5 h-5 text-accent-foreground fill-accent-foreground" />
                <div>
                  <p className="text-lg font-bold text-foreground leading-none">
                    {gamificationState.stars}
                  </p>
                  <p className="text-xs text-muted-foreground">نجمة</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/80 backdrop-blur-sm">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {gamificationState.level}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground leading-none">
                    المستوى
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {gamificationState.level === 1
                      ? "مبتدئ"
                      : gamificationState.level < 5
                        ? "نشيط"
                        : "بطل"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
