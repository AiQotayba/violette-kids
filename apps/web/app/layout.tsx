import React from "react"
import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "مكتبة الأطفال الآمنة",
  description:
    "مكتبة رقمية آمنة للأطفال تحتوي على قصص مصورة وفيديوهات تعليمية وألعاب تفاعلية - بدون إعلانات وبدون تتبع",
  keywords: [
    "أطفال",
    "قصص",
    "تعليم",
    "ألعاب",
    "فيديوهات",
    "مكتبة",
    "آمن",
    "عربي",
  ],
  authors: [{ name: "مكتبة الأطفال الآمنة" }],
  creator: "مكتبة الأطفال الآمنة",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1625" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
