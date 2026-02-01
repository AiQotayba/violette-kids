"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Gamepad2, Star, X, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGameById, games } from "@/lib/content-data";
import { recordVideoWatched, getGamificationState } from "@/lib/gamification";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hasWatched, setHasWatched] = useState(false);

  const game = getGameById(params.id as string);

  const handleVideoPlay = () => {
    if (!hasWatched) {
      recordVideoWatched();
      setHasWatched(true);
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            الفيديو غير موجود
          </h1>
          <p className="text-muted-foreground mb-6">
            عذرا، لم نتمكن من العثور على هذا الفيديو
          </p>
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/games">
              <Gamepad2 className="w-5 h-5 ml-2" />
              تصفح الفيديوهات
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const gamificationState = getGamificationState();

  // Get related videos (same category, excluding current)
  const relatedVideos = games
    .filter((g) => g.id !== game.id && g.category === game.category)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 bg-background flex flex-col safe-area-inset">
      {/* Header */}
      <header className="bg-card border-b-2 border-border px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          {/* Close & Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted active:bg-muted/70 transition-colors touch-target shrink-0"
              aria-label="رجوع"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-bold text-foreground truncate text-base">
              {game.title}
            </h1>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/30">
            <Star className="w-4 h-4 text-accent-foreground fill-accent-foreground" />
            <span className="text-sm font-bold text-accent-foreground">
              {gamificationState.stars}
            </span>
          </div>
        </div>
      </header>

      {/* Video Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Video Player */}
        <div className="relative aspect-video bg-foreground/5">
          <iframe
            src={game.videoUrl}
            title={game.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            onLoad={handleVideoPlay}
          />
        </div>

        {/* Video Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {game.title}
            </h2>
            {/* Stars earned indicator */}
            {hasWatched && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50 animate-pop-in shrink-0">
                <Star className="w-4 h-4 text-accent-foreground fill-accent-foreground" />
                <span className="text-sm font-bold text-accent-foreground">
                  +3
                </span>
              </div>
            )}
          </div>

          {/* Duration & Age */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{game.duration}</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
              {game.ageGroup === "3-4"
                ? "٣-٤ سنوات"
                : game.ageGroup === "5-6"
                  ? "٥-٦ سنوات"
                  : "٧-٨ سنوات"}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <div className="px-4 pb-4">
            <h3 className="font-bold text-foreground mb-3">فيديوهات مشابهة</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/games/${video.id}`}
                  className="block active:scale-95 transition-transform"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                      <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground mr-[-1px]" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs font-medium text-foreground mt-1.5 line-clamp-2">
                    {video.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="p-4 border-t-2 border-border safe-area-bottom mt-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-2xl bg-transparent"
            onClick={() => router.back()}
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            العودة
          </Button>
        </div>
      </main>
    </div>
  );
}
