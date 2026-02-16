const STEPS = [
  {
    step: 1,
    title: "حمّل التطبيق",
    description: "حمّل عالم همسة مجاناً (تحميل مباشر) على جهاز أندرويد.",
  },
  {
    step: 2,
    title: "افتح واستمتع",
    description: "افتح التطبيق واختر قصصاً أو فيديوهات أو ألعاباً مناسبة لطفلك.",
  },
  {
    step: 3,
    title: "تتبع التقدم",
    description: "شجّع طفلك على إكمال المحتوى وكسب النقاط والشارات.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-[var(--muted)] scroll-mt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] text-center mb-2">
          كيف يعمل؟
        </h2>
        <p className="text-[var(--muted-foreground)] text-center mb-12 text-sm md:text-base">
          ثلاث خطوات بسيطة لبدء رحلة التعلم والمرح.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step} className="text-center">
              <span
                className="inline-flex w-10 h-10 rounded-full text-white text-sm font-bold items-center justify-center mb-4"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {item.step}
              </span>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
