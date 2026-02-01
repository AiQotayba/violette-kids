"use client";

import Link from "next/link";
import { BookOpen, Sparkles, Shield, Video, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-primary/10 animate-float" />
        <div className="absolute top-40 left-20 w-16 h-16 rounded-full bg-secondary/20 animate-float stagger-2" />
        <div className="absolute bottom-20 right-1/4 w-12 h-12 rounded-full bg-accent/20 animate-float stagger-3" />
        <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full bg-success/15 animate-float stagger-4" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6 animate-slide-up">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">
              بيئة آمنة 100% للأطفال
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight animate-slide-up stagger-1">
            <span className="text-balance">مكتبة الأطفال</span>
            <br />
            <span className="bg-gradient-to-l from-primary via-primary to-secondary bg-clip-text text-transparent">
              الآمنة
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed animate-slide-up stagger-2 text-pretty">
            عالم من المرح والتعلم ينتظر طفلك! قصص مصورة ممتعة، فيديوهات تعليمية
            شيقة، وألعاب تفاعلية - كل ذلك في بيئة آمنة بدون إعلانات.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up stagger-3">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 rounded-2xl btn-press touch-target shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              <Link href="/stories">
                <BookOpen className="w-5 h-5 ml-2" />
                ابدأ القراءة
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-2xl btn-press touch-target bg-transparent"
            >
              <Link href="#categories">
                <Sparkles className="w-5 h-5 ml-2" />
                استكشف المحتوى
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 animate-slide-up stagger-4">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-stories/10 flex items-center justify-center mb-2">
                <BookOpen className="w-7 h-7 text-stories" />
              </div>
              <span className="text-2xl font-bold text-foreground">+50</span>
              <span className="text-sm text-muted-foreground">قصة مصورة</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-videos/10 flex items-center justify-center mb-2">
                <Video className="w-7 h-7 text-videos" />
              </div>
              <span className="text-2xl font-bold text-foreground">+30</span>
              <span className="text-sm text-muted-foreground">فيديو تعليمي</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-games/10 flex items-center justify-center mb-2">
                <Gamepad2 className="w-7 h-7 text-games" />
              </div>
              <span className="text-2xl font-bold text-foreground">+20</span>
              <span className="text-sm text-muted-foreground">لعبة تفاعلية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
