"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { games, ageGroups, type AgeGroup } from "@/lib/content-data";
import { Play, Clock } from "lucide-react";

export default function GamesPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<
    AgeGroup | undefined
  >();

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (selectedAgeGroup && game.ageGroup !== selectedAgeGroup) return false;
      return true;
    });
  }, [selectedAgeGroup]);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <MobileHeader title="الألعاب" />
      <main className="flex-1">
        {/* Age Filter Pills */}
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedAgeGroup(undefined)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedAgeGroup
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground active:bg-muted/70"
              }`}
            >
              الكل
            </button>
            {ageGroups.map((age) => (
              <button
                type="button"
                key={age.id}
                onClick={() => setSelectedAgeGroup(age.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedAgeGroup === age.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground active:bg-muted/70"
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid - Video Cards */}
        <div className="px-4 py-2">
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="block active:scale-95 transition-transform"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-md">
                    <Image
                      src={game.thumbnail || "/placeholder.svg"}
                      alt={game.title}
                      fill
                      className="object-cover"
                    />
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground mr-[-2px]" />
                      </div>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-foreground/80 text-background text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {game.duration}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mt-2 line-clamp-2 leading-tight">
                    {game.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">لا توجد فيديوهات تعليمية</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
