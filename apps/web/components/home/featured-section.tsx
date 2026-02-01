"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content/content-card";
import { getFeaturedContent } from "@/lib/content-data";

export function FeaturedSection() {
  const featuredContent = getFeaturedContent().slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                المحتوى المميز
              </h2>
              <p className="text-muted-foreground">
                أفضل المحتوى المختار لطفلك
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="btn-press touch-target rounded-xl bg-transparent"
          >
            <Link href="/explore">
              عرض الكل
              <ArrowLeft className="w-4 h-4 mr-2 flip-rtl" />
            </Link>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContent.map((content, index) => (
            <ContentCard key={content.id} content={content} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
