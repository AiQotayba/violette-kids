"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getGamificationState, type GamificationState } from "@/lib/gamification";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function MobileHeader({ title, showBack = false }: MobileHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [gamificationState, setGamificationState] =
    useState<GamificationState | null>(null);

  useEffect(() => {
    setGamificationState(getGamificationState());
  }, []);

  // Determine page title based on pathname
  const getPageTitle = () => {
    if (title) return title;
    if (pathname === "/") return "مكتبتي";
    if (pathname === "/stories") return "القصص";
    if (pathname === "/videos") return "الفيديوهات";
    if (pathname === "/games") return "الألعاب";
    if (pathname === "/achievements") return "نجومي";
    return "مكتبتي";
  };

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b-2 border-border safe-area-top">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Back Button or Logo */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted active:bg-muted/70 transition-colors touch-target"
              aria-label="رجوع"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          ) : null}
          <h1 className="text-xl font-bold text-foreground truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Stars Counter */}
        {gamificationState && (
          <Link
            href="/achievements"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/30 active:bg-accent/50 transition-colors"
          >
            <Star className="w-5 h-5 text-accent-foreground fill-accent-foreground" />
            <span className="font-bold text-accent-foreground text-lg">
              {gamificationState.stars}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
