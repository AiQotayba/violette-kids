"use client";

import Link from "next/link";
import { Baby, Users, GraduationCap, ArrowLeft } from "lucide-react";

const ageGroups = [
  {
    id: "3-4",
    title: "٣-٤ سنوات",
    subtitle: "الصغار",
    description: "محتوى بسيط ومرح مناسب للأطفال الصغار",
    icon: Baby,
    color: "bg-pink-500",
    bgLight: "bg-pink-50",
    borderColor: "border-pink-200",
    href: "/explore?age=3-4",
  },
  {
    id: "5-6",
    title: "٥-٦ سنوات",
    subtitle: "المستكشفون",
    description: "محتوى تعليمي متنوع لتنمية المهارات",
    icon: Users,
    color: "bg-blue-500",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    href: "/explore?age=5-6",
  },
  {
    id: "7-8",
    title: "٧-٨ سنوات",
    subtitle: "القراء",
    description: "قصص أطول ومحتوى أكثر تفصيلاً",
    icon: GraduationCap,
    color: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    href: "/explore?age=7-8",
  },
];

export function AgeGroupsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            اختر الفئة العمرية
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            محتوى مخصص لكل مرحلة عمرية لضمان تجربة تعليمية مناسبة
          </p>
        </div>

        {/* Age Group Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ageGroups.map((group, index) => (
            <Link
              key={group.id}
              href={group.href}
              className={`group animate-slide-up stagger-${index + 1}`}
            >
              <div
                className={`relative h-full bg-card rounded-3xl p-6 border-2 ${group.borderColor} shadow-sm card-hover overflow-hidden`}
              >
                {/* Icon Badge */}
                <div
                  className={`w-16 h-16 rounded-full ${group.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <group.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-2 mb-6">
                  <span className="text-sm font-medium text-muted-foreground">
                    {group.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground">
                    {group.title}
                  </h3>
                  <p className="text-muted-foreground">{group.description}</p>
                </div>

                {/* Action */}
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span>استكشف المحتوى</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform flip-rtl" />
                </div>

                {/* Background Pattern */}
                <div
                  className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full ${group.bgLight} opacity-50 group-hover:opacity-100 transition-opacity`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
