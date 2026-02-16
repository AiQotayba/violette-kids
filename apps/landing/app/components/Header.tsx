"use client";

import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { label: "الميزات", href: "#features" },
  { label: "كيف يعمل", href: "#how-it-works" },
  { label: "الأسئلة الشائعة", href: "#faq" },
] as const;

function NavLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={className} aria-label="التنقل الرئيسي">
      {NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded block py-2 md:py-0"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
      <div className="container mx-auto px-4 flex items-center justify-between h-14 sm:h-16 max-w-6xl">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 relative">
            <Image src="/logo.png" alt="عالم همسة" width={36} height={36} className="object-contain w-full h-full" />
          </div>
          <span className="font-bold text-[var(--foreground)] text-base sm:text-lg hidden sm:inline">
            عالم همسة
          </span>
        </a>

        {/* روابط — مخفية على الموبايل */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks className="flex items-center gap-6" />
        </div>

        {/* زر تحميل — ظاهر على كل الشاشات بما فيها الموبايل */}
        <div className="shrink-0">
          <a
            href="#download"
            className="inline-flex items-center justify-center h-9 sm:h-10 px-4 sm:px-5 rounded-lg font-bold text-sm text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            style={{ backgroundColor: "var(--primary)" }}
          >
            تحميل
          </a>
        </div>

        {/* زر القائمة — مخفي على الموبايل (نعرض زر التحميل بدلاً منه) */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="hidden shrink-0 w-10 h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] transition"
          aria-expanded={menuOpen}
          aria-label="فتح القائمة"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* قائمة الموبايل — منسدلة */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-4 py-4">
          <NavLinks className="flex flex-col gap-1" />
          <a
            href="#download"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center justify-center h-11 w-full rounded-lg font-bold text-sm text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            تحميل التطبيق
          </a>
        </div>
      )}
    </header>
  );
}
