export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-20 bg-[var(--muted)] scroll-mt-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] text-center mb-2">
          ما يقوله الأهالي
        </h2>
        <p className="text-[var(--muted-foreground)] text-center mb-10 text-sm md:text-base">
          تجارب حقيقية من عائلات استخدمت عالم همسة.
        </p>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-8 md:p-10 shadow-sm">
          <p className="text-[var(--foreground)] text-lg md:text-xl leading-relaxed mb-6">
            «التطبيق بسيط وآمن. أولادي يحبون القصص والألعاب، وأنا مرتاحة إنه بدون إعلانات وبدون تسجيل.»
          </p>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: "var(--primary)" }}
            >
              م
            </div>
            <div>
              <p className="font-bold text-[var(--foreground)]">أم محمد</p>
              <p className="text-sm text-[var(--muted-foreground)]">والدة طفلين</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
