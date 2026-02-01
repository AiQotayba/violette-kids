"use client";

import React from "react"

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoryById } from "@/lib/content-data";
import { recordStoryRead, getGamificationState } from "@/lib/gamification";

export default function StoryReaderPage() {
  const params = useParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [starsEarned, setStarsEarned] = useState(false);

  const story = getStoryById(params.id as string);

  const goToNextPage = useCallback(() => {
    if (story && currentPage < story.pageImages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, story]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Touch swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left - next page (RTL)
        goToPrevPage();
      } else {
        // Swiped right - prev page (RTL)
        goToNextPage();
      }
    }
    setTouchStart(null);
  };

  // Record story completion
  useEffect(() => {
    if (story && currentPage === story.pageImages.length - 1 && !starsEarned) {
      recordStoryRead();
      setStarsEarned(true);
    }
  }, [currentPage, story, starsEarned]);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            القصة غير موجودة
          </h1>
          <p className="text-muted-foreground mb-6">
            عذراً، لم نتمكن من العثور على هذه القصة
          </p>
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/stories">
              <BookOpen className="w-5 h-5 ml-2" />
              تصفح القصص
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentPage + 1) / story.pageImages.length) * 100;
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
              aria-label="إغلاق"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-foreground truncate text-base">
                {story.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentPage + 1} / {story.pageImages.length}
              </p>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/30">
            <Star className="w-4 h-4 text-accent-foreground fill-accent-foreground" />
            <span className="text-sm font-bold text-accent-foreground">
              {gamificationState.stars}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Story Content */}
      <main
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Page Image */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-lg rounded-2xl overflow-hidden bg-card shadow-xl">
            <Image
              src={story.pageImages[currentPage] || "/placeholder.svg"}
              alt={`صفحة ${currentPage + 1} من ${story.title}`}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation Areas */}
        <button
          type="button"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className="absolute inset-y-0 right-0 w-1/4 z-10 touch-target disabled:pointer-events-none"
          aria-label="الصفحة السابقة"
        />
        <button
          type="button"
          onClick={goToNextPage}
          disabled={currentPage === story.pageImages.length - 1}
          className="absolute inset-y-0 left-0 w-1/4 z-10 touch-target disabled:pointer-events-none"
          aria-label="الصفحة التالية"
        />

        {/* Visible Nav Buttons */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4 z-20">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="w-14 h-14 rounded-full bg-card shadow-lg flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight className="w-7 h-7 text-foreground" />
          </button>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage === story.pageImages.length - 1}
            className="w-14 h-14 rounded-full bg-card shadow-lg flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-7 h-7 text-foreground" />
          </button>
        </div>

        {/* Completion Celebration */}
        {starsEarned && currentPage === story.pageImages.length - 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50 backdrop-blur-sm z-30 p-4">
            <div className="bg-card rounded-3xl p-6 text-center shadow-2xl w-full max-w-sm animate-pop-in">
              <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center animate-bounce-soft">
                <Star className="w-10 h-10 text-accent-foreground fill-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                أحسنت!
              </h2>
              <p className="text-muted-foreground mb-6">
                لقد أكملت قراءة القصة وحصلت على 10 نجوم
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl w-full text-base"
                >
                  <Link href="/stories">قصة أخرى</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl w-full text-base bg-transparent"
                  onClick={() => {
                    setCurrentPage(0);
                    setStarsEarned(false);
                  }}
                >
                  اقرأ مجدداً
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
