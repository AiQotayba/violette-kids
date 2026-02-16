import { DOWNLOAD_APP_URL } from "@/lib/config";

const FEATURES = [
  {
    key: "stories",
    title: "قصص مصوّرة",
    description: "قصص ممتعة تنمّي الخيال واللغة وتساعد الأطفال على النمو كل يوم.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
      </svg>
    ),
    color: "var(--stories)",
  },
  {
    key: "videos",
    title: "فيديوهات تعليمية",
    description: "فيديوهات مناسبة للأطفال تجمع بين المتعة والتعلم في بيئة آمنة.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
      </svg>
    ),
    color: "var(--videos)",
  },
  {
    key: "games",
    title: "ألعاب تفاعلية",
    description: "ألعاب ممتعة تنمي المهارات والتركيز بدون إعلانات.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="6" y1="12" x2="4" y2="14" />
        <line x1="6" y1="12" x2="8" y2="14" />
        <line x1="18" y1="12" x2="20" y2="14" />
        <line x1="18" y1="12" x2="16" y2="14" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    color: "var(--games)",
  },
  {
    key: "safe",
    title: "بدون إعلانات",
    description: "محتوى نظيف وآمن. لا تتبع ولا إعلانات—خصوصية كاملة.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: "var(--level-card)",
  },
  {
    key: "arabic",
    title: "واجهة عربية",
    description: "واجهة واضحة وبسيطة بالكامل بالعربية، مناسبة للأطفال والأهل.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8" />
        <path d="M8 11h6" />
      </svg>
    ),
    color: "var(--secondary)",
  },
  {
    key: "progress",
    title: "تتبع التقدم",
    description: "نقاط وشارات ومستويات تشجّع طفلك على إكمال المحتوى.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    color: "var(--accent)",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="py-16 md:py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] text-center mb-2">
          ميزات عالم همسة
        </h2>
        <p className="text-[var(--muted-foreground)] text-center mb-12 max-w-2xl mx-auto text-sm md:text-base">
          اكتشف أدوات بسيطة وآمنة لمساعدة أطفالكم على التعلم والمرح في بيئة مناسبة.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item) => (
            <div
              key={item.key}
              className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30 transition"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 [&>svg]:shrink-0"
                style={{ color: item.color }}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href={DOWNLOAD_APP_URL}
            download
            className="btn-primary inline-flex items-center justify-center gap-2 text-white shadow-lg link-focus rounded-lg px-6"
            style={{ backgroundColor: "var(--primary)" }}
          >
            تحميل التطبيق
          </a>
        </div>
      </div>
    </section>
  );
}
