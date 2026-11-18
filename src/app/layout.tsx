import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";

/**
 * Font tự host trong `src/app/fonts/` (bản subset latin lấy từ Google Fonts),
 * KHÔNG dùng `next/font/google`.
 *
 * `next/font/google` tải CSS của Google LÚC BUILD. Trên server production
 * Google trả Lora dạng `fonts.gstatic.com/l/font?kit=…&skey=…&v=…` — URL
 * nhiều tham số — và bộ thay URL font của Turbopack chỉ nhận đúng một, nên
 * `next build` vỡ với "next/font/google queries have exactly one entry".
 * Máy dev nhận dạng `/s/…woff2` nên không thấy lỗi. Tự host thì build không
 * còn phụ thuộc Google, ra cùng một kết quả ở mọi máy.
 *
 * Italic nằm chung một family để `font-style: italic` chọn đúng file thật
 * (không có thì trình duyệt tự xiên chữ đứng — "faux italic").
 */
const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "./fonts/poppins-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/poppins-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/poppins-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/poppins-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/poppins-600-italic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/poppins-700-italic.woff2", weight: "700", style: "italic" },
  ],
});

/** Lora là variable font — một file phủ cả 400–600. */
const lora = localFont({
  variable: "--font-lora",
  display: "swap",
  // Fallback mặc định của next/font/local là Arial — Lora là serif.
  adjustFontFallback: "Times New Roman",
  src: [{ path: "./fonts/lora-400-600-normal.woff2", weight: "400 600", style: "normal" }],
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

/** Google Tag Manager — snippet chính thức, giữ nguyên văn để GTM tự nhận diện. */
const GTM_ID = "GTM-MW7F6KJZ";
const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

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
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
        {/* End Google Tag Manager */}
      </head>
      {/*
       * `overflow-x-clip` rather than `-hidden`: `hidden` turns <body> into a
       * scroll container, and GSAP ScrollTrigger then resolves the scroller to
       * <body> — whose scrollTop is always 0 — so the pinned UspSlider section
       * never activates. `clip` hides the same overflow without scrolling.
       *
       * `min-h-screen`, not `min-h-full`: Lenis's CSS sets <html> to
       * `height: auto`, so a percentage min-height would resolve to nothing.
       */}
      <body className="min-h-screen flex flex-col overflow-x-clip">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Sits above everything at z-9999 and covers the first paint —
            must render before {children} so it is in the DOM immediately. */}
        {/* Helper của badge DMCA (src/components/DmcaBadge.tsx): gắn `?refurl=`
            vào a.dmca-badge trong listener DOMContentLoaded. Thẻ `defer` thường
            chứ không phải next/script — next/script nạp muộn hơn sự kiện đó nên
            refurl không bao giờ được gắn (cùng lý do bên OlcoMain). */}
        <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js" defer />
        <PageTransition />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
