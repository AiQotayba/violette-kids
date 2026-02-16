import { DOWNLOAD_APP_URL } from "@/lib/config";

export function Cta() {
  return (
    <section id="download" className="py-16 md:py-20 bg-[var(--muted)] scroll-mt-20">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3">
          حمّل التطبيق مجاناً
        </h2>
        <p className="text-[var(--muted-foreground)] mb-8 text-sm md:text-base">
          تحميل مباشر لأجهزة أندرويد. نتعلم ونمرح معاً.
        </p>
        <a
          href={DOWNLOAD_APP_URL}
          download
          className="btn-primary inline-flex items-center justify-center gap-3 text-white shadow-xl link-focus rounded-lg text-lg px-10"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          تحميل التطبيق
        </a>
      </div>
    </section>
  );
}
