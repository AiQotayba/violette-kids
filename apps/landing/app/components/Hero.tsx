import Image from "next/image";
import { DOWNLOAD_APP_URL, HERO_PHONES_IMAGE } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container mx-auto max-w-6xl px-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
        {/* النص — هيرو أبيض نظيف */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-right max-w-xl order-2 lg:order-1 mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-3 leading-tight">
            عالم همسة
          </h1>
          <p className="text-[var(--muted-foreground)] text-base md:text-lg mb-2">
            — نتعلم ونمرح معاً —
          </p>
          <p className="text-[var(--muted-foreground)] text-sm md:text-base mb-8 max-w-md leading-relaxed">
            قصص، فيديوهات وألعاب آمنة لأطفالكم. بدون حسابات وبدون تتبع—كل شيء شفاف وآمن.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={DOWNLOAD_APP_URL}
              download
              className="btn-primary inline-flex items-center justify-center gap-2 text-white shadow-lg link-focus rounded-xl"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              تحميل التطبيق
            </a>
            <a
              href="#features"
              className="btn-primary inline-flex items-center justify-center border-2 link-focus rounded-xl font-bold"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            >
              اعرف المزيد
            </a>
          </div>
        </div>

        {/* صورة الهيرو — هاتفان مائلان ومتداخلان (التصميم الجاهز) */}
        <div className="relative flex justify-center items-center order-1 lg:order-2 w-full lg:w-auto lg:min-w-[360px] shrink-0">
          <div className="relative w-full max-w-[160px] min-[480px]:max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[420px] aspect-[9/16]">
            <Image
              src={HERO_PHONES_IMAGE}
              alt="معاينة تطبيق عالم همسة — شاشتان متداخلتان"
              fill
              className="object-contain object-center"
              sizes="(max-width: 480px) 160px, (max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 340px, 420px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
