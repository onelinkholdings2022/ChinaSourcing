import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * Metadata gốc — chỉ những thứ KHÔNG thể đến từ CMS.
 *
 * `<title>`/`description`/OG/canonical của từng trang do `generateMetadata()`
 * của chính trang đó dựng, đọc `seo` trong CMS rồi lùi về `global.defaultSeo`
 * (xem `src/lib/seo/metadata.ts`). Trước đây ở đây có một cặp title/description
 * ghi cứng, và mọi trang chưa khai `generateMetadata` — trang chủ chẳng hạn —
 * đều dùng nó, nên sửa nội dung bên CMS không đổi được gì.
 *
 * `metadataBase` phải ở đây: nó là thứ biến mọi URL tương đối trong OG/canonical
 * thành URL tuyệt đối, và Next chỉ đọc nó từ layout gốc.
 */
export const metadata: Metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL || "https://chinasourcing.co").replace(/\/$/, ""),
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${lora.variable} h-full antialiased`}
    >
      {/*
       * `overflow-x-clip` rather than `-hidden`: `hidden` turns <body> into a
       * scroll container, and GSAP ScrollTrigger then resolves the scroller to
       * <body> — whose scrollTop is always 0 — so the pinned UspSlider section
       * never activates. `clip` hides the same overflow without scrolling.
       */}
      <body className="min-h-full flex flex-col overflow-x-clip">
        {/* Sits above everything at z-9999 and covers the first paint —
            must render before {children} so it is in the DOM immediately. */}
        <PageTransition />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
