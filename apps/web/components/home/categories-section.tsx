"use client";

import Link from "next/link";
import { BookOpen, Video, Gamepad2, ArrowLeft } from "lucide-react";

const contentCategories = [
  {
    id: "stories",
    title: "القصص المصورة",
    description: "قصص ممتعة ومفيدة مع رسومات جميلة تنمي خيال طفلك",
    icon: BookOpen,
    href: "/stories",
    gradient: "from-orange-400 to-amber-500",
    bgLight: "bg-orange-50",
    count: "+50 قصة",
  },
  {
    id: "videos",
    title: "الفيديوهات التعليمية",
    description: "فيديوهات تعليمية مختارة بعناية لتعلم ممتع وآمن",
    icon: Video,
    href: "/videos",
    gradient: "from-indigo-400 to-purple-500",
    bgLight: "bg-indigo-50",
    count: "+30 فيديو",
  },
  {
    id: "games",
    title: "الألعاب التفاعلية",
    description: "ألعاب تعليمية ممتعة تنمي مهارات طفلك",
    icon: Gamepad2,
    href: "/games",
    gradient: "from-emerald-400 to-teal-500",
    bgLight: "bg-emerald-50",
    count: "+20 لعبة",
  },
];

export function CategoriesSection() {
  return (
    <section id="categories" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            استكشف عالم المحتوى
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اختر نوع المحتوى المفضل لطفلك وابدأ رحلة التعلم والمرح
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {contentCategories.map((category, index) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group animate-slide-up stagger-${index + 1}`}
            >
              <div className="relative h-full bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm card-hover overflow-hidden">
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${category.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon
                    className={`w-8 h-8 bg-gradient-to-br ${category.gradient} bg-clip-text`}
                    style={{
                      color:
                        category.id === "stories"
                          ? "#f97316"
                          : category.id === "videos"
                            ? "#6366f1"
                            : "#10b981",
                    }}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-sm font-medium text-primary">
                    {category.count}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="text-sm">استكشف</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform flip-rtl" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
