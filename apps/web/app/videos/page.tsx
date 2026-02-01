"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { videos, ageGroups, type AgeGroup } from "@/lib/content-data";

export default function VideosPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<
    AgeGroup | undefined
  >();

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      if (selectedAgeGroup && video.ageGroup !== selectedAgeGroup) return false;
      return true;
    });
  }, [selectedAgeGroup]);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <MobileHeader title="الفيديوهات" />
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

        {/* Videos List */}
        <div className="px-4 py-2 space-y-4">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="block active:scale-[0.98] transition-transform"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-md">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-videos fill-videos mr-[-3px]" />
                    </div>
                  </div>
                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-foreground/80 backdrop-blur-sm">
                      <span className="text-sm font-medium text-background">
                        {video.duration}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground mt-3 line-clamp-2 leading-snug">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {video.description}
                </p>
              </Link>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">لا توجد فيديوهات</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
