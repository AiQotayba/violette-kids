"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, BookOpen } from "lucide-react";
import { stories } from "@/lib/content-data";

export function StoriesRow() {
  const featuredStories = stories.slice(0, 6);

  return (
    <section className="py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stories/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-stories" />
          </div>
          <h2 className="text-lg font-bold text-foreground">القصص</h2>
        </div>
        <Link
          href="/stories"
          className="flex items-center gap-1 text-sm font-medium text-primary active:text-primary/70 transition-colors"
        >
          عرض الكل
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {featuredStories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="flex-shrink-0 w-36 group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-md active:scale-95 transition-transform">
                <Image
                  src={story.thumbnail || "/placeholder.svg"}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/80 to-transparent" />
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
      </div>
    </section>
  );
}
