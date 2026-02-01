"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Video, Gamepad2, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ContentItem } from "@/lib/content-data";
import { ageGroups, categories } from "@/lib/content-data";

interface ContentCardProps {
  content: ContentItem;
  index?: number;
}

const typeConfig = {
  story: {
    icon: BookOpen,
    label: "قصة",
    gradient: "bg-gradient-stories",
    href: "/stories",
  },
  video: {
    icon: Video,
    label: "فيديو",
    gradient: "bg-gradient-videos",
    href: "/videos",
  },
  game: {
    icon: Gamepad2,
    label: "لعبة",
    gradient: "bg-gradient-games",
    href: "/games",
  },
};

export function ContentCard({ content, index = 0 }: ContentCardProps) {
  const config = typeConfig[content.type];
  const TypeIcon = config.icon;
  const category = categories.find((c) => c.id === content.category);
  const ageGroup = ageGroups.find((a) => a.id === content.ageGroup);

  return (
    <Link
      href={`${config.href}/${content.id}`}
      className={`group block animate-slide-up stagger-${(index % 5) + 1}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <article className="relative bg-card rounded-2xl overflow-hidden shadow-md card-hover border border-border">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={content.thumbnail || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Type Badge */}
          <div
            className={`absolute top-3 right-3 ${config.gradient} px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg`}
          >
            <TypeIcon className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">
              {config.label}
            </span>
          </div>

          {/* Duration or Pages */}
          {(content.duration || content.pages) && (
            <div className="absolute bottom-3 left-3 bg-foreground/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5">
              {content.duration ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-background" />
                  <span className="text-xs font-medium text-background">
                    {content.duration}
                  </span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-background" />
                  <span className="text-xs font-medium text-background">
                    {content.pages} صفحات
                  </span>
                </>
              )}
            </div>
          )}

          {/* Featured Badge */}
          {content.isFeatured && (
            <div className="absolute top-3 left-3 bg-accent px-2 py-1 rounded-full">
              <span className="text-xs font-bold text-accent-foreground">
                مميز
              </span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4">
          <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {content.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3 leading-relaxed">
            {content.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category.icon} {category.label}
              </Badge>
            )}
            {ageGroup && (
              <Badge variant="outline" className="text-xs">
                {ageGroup.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </article>
    </Link>
  );
}
