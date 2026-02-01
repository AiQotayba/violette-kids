"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Gamepad2, Play, Clock } from "lucide-react";
import { games } from "@/lib/content-data";

export function GamesRow() {
  const featuredGames = games.slice(0, 6);

  return (
    <section className="py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-games/20 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-games" />
          </div>
          <h2 className="text-lg font-bold text-foreground">الألعاب</h2>
        </div>
        <Link
          href="/games"
          className="flex items-center gap-1 text-sm font-medium text-primary active:text-primary/70 transition-colors"
        >
          عرض الكل
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {featuredGames.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="flex-shrink-0 w-44 group"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-md active:scale-95 transition-transform">
                <Image
                  src={game.thumbnail || "/placeholder.svg"}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                  <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground mr-[-1px]" />
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-foreground/80 text-background text-[10px] font-medium flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {game.duration}
                </div>
              </div>
              {/* Title */}
              <h3 className="text-xs font-bold text-foreground mt-2 line-clamp-2 leading-tight">
                {game.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
