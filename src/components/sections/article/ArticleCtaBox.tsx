import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleCtaData } from "@/lib/views/articleExtras";

/**
 * Khung CTA chèn giữa thân bài — bản ghi `Article CTA Box` bên strapi-cns,
 * biên tập viên đặt vào bài bằng nút "CTA Box" của CKEditor.
 *
 * Hai variant, chọn bằng dropdown trên CMS (theo thiết kế, đã bỏ icon tròn):
 *  • `light` — nền #F4F7FD, viền #DCE4F7, chữ navy, nút xanh #256BE8.
 *  • `heavy` — nền navy #27308D, chữ trắng, nút trắng chữ navy.
 *
 * Mobile: nút xuống dòng và rộng hết khung, cao 48px.
 */
export function ArticleCtaBox({ cta }: { cta: ArticleCtaData }) {
  const heavy = cta.variant === "heavy";
  const external = /^https?:\/\//i.test(cta.buttonHref);

  return (
    <aside
      aria-label={cta.heading}
      className={cn(
        "ap-cta flex flex-wrap items-center",
        heavy
          ? "gap-x-6 gap-y-4 md:gap-y-5 rounded-[14px] md:rounded-2xl bg-dark-blue-950 p-5 md:px-8 md:py-7 text-white"
          : "gap-x-5 gap-y-4 rounded-xl border border-[#DCE4F7] bg-[#F4F7FD] p-5 md:px-6",
      )}
    >
      <div className="min-w-0 flex-[1_1_300px]">
        <p
          className={cn(
            "font-semibold leading-[1.4]",
            heavy ? "text-lg md:text-xl md:leading-[1.35]" : "text-base text-dark-blue-950",
          )}
        >
          {cta.heading}
        </p>
        {cta.description && (
          <p
            className={cn(
              "mt-1.5 md:mt-1",
              heavy ? "text-sm md:text-[15px] leading-[1.6] text-[#D5DAF5]" : "text-sm leading-[1.6] text-[#3A4060]",
            )}
          >
            {cta.description}
          </p>
        )}
      </div>

      {cta.buttonLabel && cta.buttonHref && (
        <Link
          href={cta.buttonHref}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={cn(
            "w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold no-underline",
            "transition-colors duration-300 ease-[cubic-bezier(.4,0,.2,1)]",
            heavy
              ? "h-12 md:h-auto bg-white text-dark-blue-950 text-[15px] md:px-[22px] md:py-[13px] hover:bg-[#EEF3FD]"
              : "h-12 md:h-auto bg-cyan-400 text-white text-sm md:px-[18px] md:py-[11px] hover:bg-dark-blue-950",
          )}
        >
          {cta.buttonLabel}
          <span aria-hidden>→</span>
        </Link>
      )}
    </aside>
  );
}
