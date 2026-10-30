import Image from "next/image";
import { ArticleSummary } from "@/components/sections/article/ArticleSummary";

/**
 * Mở bài — thiết kế v2.
 *
 * Desktop (≥768px): mọi thứ canh giữa. Pill category → H1 40px navy (tối đa
 * 800px, `text-wrap: balance`) → ô 3 cột Category / Published / Reading Time
 * (720px) → ô Summary → ảnh 480px bo 20px.
 *
 * Mobile: canh trái, H1 28px, ô 3 cột rút còn MỘT dòng "26 Oct 2026 · 11 min
 * read", Summary (viền chạy vòng + gõ chữ, Show More khi tràn 2 dòng), ảnh 16:9.
 *
 * Các khối hero hiện lên một lần (fade-up 24px / 500ms, trễ 100ms mỗi khối) —
 * `.ah-rv` trong globals.css, tắt khi `prefers-reduced-motion`.
 */
export function ArticleHero({
  title,
  category,
  publishedShort,
  publishedLong,
  readingTime,
  summary,
  image,
  imageAlt,
}: {
  title: string;
  category: string;
  publishedShort: string;
  publishedLong: string;
  readingTime: string;
  summary: string;
  image: string | null;
  imageAlt: string;
}) {
  const facts = [
    { label: "Category", value: category },
    { label: "Published", value: publishedShort },
    { label: "Reading Time", value: readingTime },
  ].filter((f) => f.value);

  return (
    <section className="mx-auto max-w-[1248px] px-4 pt-6 md:px-6 md:pt-24 flex flex-col items-start md:items-center md:text-center">
      {category && (
        <div className="ah-rv rounded-full border border-cyan-400 text-cyan-400 px-3 py-1 text-xs md:px-4 md:py-1.5 md:text-sm">
          {category}
        </div>
      )}

      <h1 className="ah-rv ah-d1 mt-3.5 md:mt-5 max-w-[800px] text-[28px] md:text-[40px] leading-[1.3] font-medium text-dark-blue-950 [text-wrap:balance]">
        {title}
      </h1>

      {/* Mobile: một dòng meta thay cho ô 3 cột. */}
      <p className="md:hidden mt-3 text-[13px] text-[#5A6280]">
        {[publishedLong, readingTime].filter(Boolean).join(" · ")}
      </p>

      <dl className="ah-rv ah-d2 hidden md:grid mt-10 w-full max-w-[720px] grid-cols-3 gap-4 rounded-lg bg-[#EEF3FD] px-8 py-[22px] text-left text-sm">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-semibold text-dark-blue-950">{fact.label}</dt>
            <dd className="mt-2 text-base text-grey-600">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {summary && <ArticleSummary text={summary} />}

      {image && (
        <div className="mt-[18px] md:mt-14 w-full overflow-hidden rounded-xl md:rounded-[20px] bg-[#D9DDE4]">
          <Image
            src={image}
            alt={imageAlt}
            width={1200}
            height={480}
            priority
            sizes="(min-width: 1248px) 1200px, 100vw"
            className="w-full aspect-video md:aspect-auto md:h-[480px] object-cover"
          />
        </div>
      )}
    </section>
  );
}
