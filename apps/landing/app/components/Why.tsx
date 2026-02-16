const REASONS = [
  { title: "بدون حسابات", text: "لا تسجيل دخول للأطفال — استخدام فوري وآمن.", color: "var(--stories)" },
  { title: "بدون تتبع أو إعلانات", text: "خصوصية وأمان. محتوى فقط بدون تتبع.", color: "var(--videos)" },
  { title: "محتوى مُنتقى", text: "قصص، فيديو وألعاب مناسبة للفئة العمرية.", color: "var(--games)" },
  { title: "تجربة بسيطة", text: "واجهة واضحة وعربية بالكامل.", color: "var(--level-card)" },
] as const;

export function Why() {
  return (
    <section id="why" className="py-16 md:py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] text-center mb-2">
          لماذا عالم همسة؟
        </h2>
        <p className="text-[var(--muted-foreground)] text-center mb-12 text-sm md:text-base">
          نقدّم لأطفالكم تجربة آمنة وممتعة دون تعقيد.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div
                className="w-2 rounded-full shrink-0 self-center min-h-[2.5rem]"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <h3 className="font-bold text-[var(--foreground)] mb-1">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
