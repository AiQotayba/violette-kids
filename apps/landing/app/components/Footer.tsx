import Image from "next/image";
import { DOWNLOAD_APP_URL } from "@/lib/config";

const QUICK_LINKS = [
  { label: "الميزات", href: "#features" },
  { label: "كيف يعمل", href: "#how-it-works" },
  { label: "الأسئلة الشائعة", href: "#faq" },
] as const;

const SUPPORT_LINKS = [
  { label: "من نحن", href: "#" },
  { label: "اتصل بنا", href: "#" },
  { label: "سياسة الخصوصية", href: "#" },
  { label: "شروط الاستخدام", href: "#" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--footer-bg)] text-[var(--footer-text)]">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        <div className="grid gap-10 md:grid-cols-3">
          {/* العلامة والوصف */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 relative">
                <Image src="/logo.png" alt="عالم همسة" width={36} height={36} className="object-contain" />
              </div>
              <span className="font-bold text-[var(--footer-text)]">عالم همسة</span>
            </div>
            <p className="text-sm text-[var(--footer-muted)] leading-relaxed mb-4">
              تطبيق تعليمي وترفيهي آمن للأطفال—قصص، فيديوهات وألعاب. نتعلم ونمرح معاً.
            </p>
            <a
              href={DOWNLOAD_APP_URL}
              download
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg font-bold text-sm text-white transition hover:opacity-95"
              style={{ backgroundColor: "var(--primary)" }}
            >
              تحميل
            </a>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="font-bold text-[var(--footer-text)] mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--footer-muted)] hover:text-[var(--footer-text)] transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* الدعم */}
          <div>
            <h3 className="font-bold text-[var(--footer-text)] mb-4">الدعم</h3>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--footer-muted)] hover:text-[var(--footer-text)] transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--footer-muted)]">
              جميع الحقوق محفوظة © {new Date().getFullYear()} جمعية اقرأ وارتق
            </p>
            <p className="flex items-center gap-1.5 text-xs text-[var(--footer-muted)]">
              تصميم وتطوير
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 text-[var(--secondary)] fill-[var(--secondary)]"
                aria-hidden
              >
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
              </svg>
              <a
                href="https://www.linkedin.com/in/aiqotayba"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:opacity-80 transition"
                style={{ color: "var(--secondary)" }}
              >
                قتيبة محمد
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
