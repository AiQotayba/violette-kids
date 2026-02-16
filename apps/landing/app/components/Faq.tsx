"use client";

import { useState } from "react";

const ITEMS = [
  {
    id: "what",
    question: "ما هو عالم همسة؟",
    answer: "عالم همسة تطبيق تعليمي وترفيهي آمن للأطفال يجمع قصصاً مصوّرة، فيديوهات تعليمية، وألعاباً تفاعلية. بدون حسابات وبدون إعلانات أو تتبع.",
  },
  {
    id: "age",
    question: "ما الفئة العمرية المناسبة؟",
    answer: "المحتوى مناسب للأطفال من عمر 3 إلى 12 سنة تقريباً، مع إمكانية تصفية المحتوى حسب العمر داخل التطبيق.",
  },
  {
    id: "download",
    question: "كيف أحمّل التطبيق؟",
    answer: "التحميل مباشر من هذه الصفحة. اضغط زر «تحميل التطبيق» ثم ثبّت ملف الـ APK على جهاز أندرويد. لا حاجة لمتجر تطبيقات.",
  },
  {
    id: "safe",
    question: "هل التطبيق آمن لطفلي؟",
    answer: "نعم. لا نجمّع بيانات شخصية ولا نعرض إعلانات. المحتوى مُنتقى ومناسب للأطفال، والواجهة بسيطة وواضحة.",
  },
] as const;

export function Faq() {
  const [openId, setOpenId] = useState<string | null>("what");

  return (
    <section id="faq" className="py-16 md:py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] text-center mb-2">
          الأسئلة الشائعة
        </h2>
        <p className="text-[var(--muted-foreground)] text-center mb-10 text-sm md:text-base">
          إجابات سريعة على أكثر الأسئلة تداولاً.
        </p>
        <ul className="space-y-2">
          {ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li
                key={item.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-right font-medium text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-inset"
                >
                  {item.question}
                  <span
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[var(--primary)] transition-transform"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
