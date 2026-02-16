import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "عالم همسة — حمّل التطبيق",
  description:
    "نتعلم ونمرح معاً. قصص، فيديوهات وألعاب آمنة لأطفالكم. حمّل تطبيق عالم همسة على أندرويد.",
  keywords: [
    "عالم همسة",
    "أطفال",
    "قصص",
    "فيديوهات",
    "ألعاب",
    "تطبيق أندرويد",
    "تعليم",
  ],
  openGraph: {
    title: "عالم همسة — نتعلم ونمرح معاً",
    description: "قصص، فيديوهات وألعاب آمنة لأطفالكم. حمّل التطبيق مجاناً.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF8E1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
