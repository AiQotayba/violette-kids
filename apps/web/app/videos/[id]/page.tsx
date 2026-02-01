"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Video, Star, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVideoById } from "@/lib/content-data";
import { recordVideoWatched, getGamificationState } from "@/lib/gamification";

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);

  const video = getVideoById(params.id as string);

  // Record video watch after starting
  useEffect(() => {
    if (isPlaying && !hasWatched) {
      const timeout = setTimeout(() => {
        recordVideoWatched();
        setHasWatched(true);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isPlaying, hasWatched]);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Video className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            الفيديو غير موجود
          </h1>
          <p className="text-muted-foreground mb-6">
            عذراً، لم نتمكن من العثور على هذا الفيديو
          </p>
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/videos">
              <Video className="w-5 h-5 ml-2" />
              تصفح الفيديوهات
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const gamificationState = getGamificationState();

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
              {video.title}
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
      <main className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="relative aspect-video bg-foreground/5">
          {!isPlaying ? (
            <div className="absolute inset-0">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl active:scale-95 transition-transform animate-bounce-soft"
                >
                  <Play className="w-10 h-10 text-videos fill-videos mr-[-4px]" />
                </button>
              </div>
              {/* Duration */}
              {video.duration && (
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-foreground/80 backdrop-blur-sm">
                  <span className="text-sm font-medium text-background">
                    {video.duration}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <iframe
              src={`${video.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>

        {/* Video Info */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {video.title}
            </h2>
            {/* Stars earned indicator */}
            {hasWatched && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50 animate-pop-in shrink-0">
                <Star className="w-4 h-4 text-accent-foreground fill-accent-foreground" />
                <span className="text-sm font-bold text-accent-foreground">
                  +8
                </span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Back Button */}
        <div className="p-4 border-t-2 border-border safe-area-bottom">
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-2xl bg-transparent"
            onClick={() => router.back()}
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            العودة للفيديوهات
          </Button>
        </div>
      </main>
    </div>
  );
}
