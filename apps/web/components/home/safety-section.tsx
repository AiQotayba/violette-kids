"use client";

import { Shield, Ban, Eye, Lock, Heart, CheckCircle2 } from "lucide-react";

const safetyFeatures = [
  {
    icon: Ban,
    title: "بدون إعلانات",
    description: "لا إعلانات مزعجة أو غير مناسبة",
  },
  {
    icon: Eye,
    title: "بدون تتبع",
    description: "لا نجمع أي بيانات عن الأطفال",
  },
  {
    icon: Lock,
    title: "بدون حسابات",
    description: "لا حاجة لتسجيل أو بيانات شخصية",
  },
  {
    icon: CheckCircle2,
    title: "محتوى مختار",
    description: "كل المحتوى يتم مراجعته يدوياً",
  },
];

export function SafetySection() {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    بيئة آمنة لطفلك
                  </h2>
                  <p className="text-muted-foreground">
                    راحة بالك أولويتنا
                  </p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                نؤمن بأن الأطفال يستحقون مساحة رقمية آمنة للتعلم والاستكشاف.
                لذلك صممنا مكتبة الأطفال الآمنة لتكون خالية تماماً من أي محتوى
                ضار أو إعلانات أو تتبع.
              </p>

              {/* Safety Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {safetyFeatures.map((feature, index) => (
                  <div
                    key={feature.title}
                    className={`flex items-start gap-3 p-4 rounded-2xl bg-muted/50 animate-slide-up stagger-${index + 1}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Main Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-success/20 to-primary/20 animate-bounce-soft" />

                {/* Inner Circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-success/30 to-primary/30" />

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
                    <Heart className="w-12 h-12 text-white fill-white" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-0 right-1/4 w-8 h-8 rounded-full bg-primary/20 animate-float" />
                <div className="absolute bottom-10 left-0 w-6 h-6 rounded-full bg-accent/30 animate-float stagger-2" />
                <div className="absolute top-1/4 left-0 w-10 h-10 rounded-full bg-secondary/20 animate-float stagger-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
