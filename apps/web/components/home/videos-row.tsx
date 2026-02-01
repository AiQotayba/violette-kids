"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Video, Play } from "lucide-react";
import { videos } from "@/lib/content-data";

export function VideosRow() {
  const featuredVideos = videos.slice(0, 6);

  return (
    <section className="py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-videos/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-videos" />
          </div>
          <h2 className="text-lg font-bold text-foreground">الفيديوهات</h2>
        </div>
        <Link
          href="/videos"
          className="flex items-center gap-1 text-sm font-medium text-primary active:text-primary/70 transition-colors"
        >
          عرض الكل
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {featuredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="flex-shrink-0 w-48 group"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-md active:scale-95 transition-transform">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-videos fill-videos mr-[-2px]" />
                  </div>
                </div>
                {/* Duration */}
                {video.duration && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-foreground/80 backdrop-blur-sm">
                    <span className="text-xs font-medium text-background">
                      {video.duration}
                    </span>
                  </div>
                )}
              </div>
              {/* Title */}
              <h3 className="text-sm font-bold text-foreground mt-2 line-clamp-2 leading-tight px-1">
                {video.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
