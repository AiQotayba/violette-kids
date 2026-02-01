"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Video, Gamepad2, Clock, FileText, Play } from "lucide-react";
import type { ContentItem } from "@/lib/content-data";

interface MobileContentCardProps {
  content: ContentItem;
}

const typeConfig = {
  story: {
    icon: BookOpen,
    href: "/stories",
    color: "text-stories",
    bg: "bg-stories/20",
  },
  video: {
    icon: Video,
    href: "/videos",
    color: "text-videos",
    bg: "bg-videos/20",
  },
  game: {
    icon: Gamepad2,
    href: "/games",
    color: "text-games",
    bg: "bg-games/20",
  },
};

export function MobileContentCard({ content }: MobileContentCardProps) {
  const config = typeConfig[content.type];

  if (content.type === "story") {
    return (
      <Link
        href={`${config.href}/${content.id}`}
        className="block active:scale-95 transition-transform"
      >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-md">
          <Image
            src={content.thumbnail || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/80 to-transparent" />
          {/* Pages Badge */}
          {content.pages && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm flex items-center gap-1">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {content.pages}
              </span>
            </div>
          )}
          {/* Title */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">
              {content.title}
            </h3>
          </div>
        </div>
      </Link>
    );
  }

  if (content.type === "video") {
    return (
      <Link
        href={`${config.href}/${content.id}`}
        className="block active:scale-95 transition-transform"
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-md">
          <Image
            src={content.thumbnail || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover"
          />
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-7 h-7 text-videos fill-videos mr-[-2px]" />
            </div>
          </div>
          {/* Duration */}
          {content.duration && (
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-foreground/80 backdrop-blur-sm">
              <span className="text-xs font-medium text-background">
                {content.duration}
              </span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-bold text-foreground mt-2 line-clamp-2 leading-tight">
          {content.title}
        </h3>
      </Link>
    );
  }

  // Game card
  return (
    <Link
      href={`${config.href}/${content.id}`}
      className="block active:scale-95 transition-transform"
    >
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-md">
        <Image
          src={content.thumbnail || "/placeholder.svg"}
          alt={content.title}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-sm font-bold text-foreground mt-2 line-clamp-2 leading-tight text-center">
        {content.title}
      </h3>
    </Link>
  );
}
