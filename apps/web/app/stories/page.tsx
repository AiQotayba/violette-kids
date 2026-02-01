"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { stories, ageGroups, type AgeGroup } from "@/lib/content-data";

export default function StoriesPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<
    AgeGroup | undefined
  >();

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      if (selectedAgeGroup && story.ageGroup !== selectedAgeGroup) return false;
      return true;
    });
  }, [selectedAgeGroup]);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <MobileHeader title="القصص" />
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

        {/* Stories Grid */}
        <div className="px-4 py-2">
          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="block active:scale-95 transition-transform"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-md">
                    <Image
                      src={story.thumbnail || "/placeholder.svg"}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/80 to-transparent" />
                    {/* Pages Badge */}
                    {story.pages && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm flex items-center gap-1">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">
                          {story.pages}
                        </span>
                      </div>
                    )}
                    {/* Title */}
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                        {story.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">لا توجد قصص</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
