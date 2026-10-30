"use client";

import { Fragment, useMemo, useRef } from "react";
import { TableOfContents, type TocItem } from "@/components/sections/article/TableOfContents";
import { MobileTocBar } from "@/components/sections/article/MobileTocBar";
import { ArticleCtaBox } from "@/components/sections/article/ArticleCtaBox";
import { LinkPreviewLayer } from "@/components/sections/article/LinkPreviewLayer";
import { useSubscribed } from "@/hooks/useSubscribed";
import { cn } from "@/lib/utils";
import { useArticleProgress } from "@/components/sections/article/useArticleProgress";
import { useAdaptiveStickyTop } from "@/components/sections/article/useAdaptiveStickyTop";
import type { ArticleBlock } from "@/lib/views/articleContent";
import type { ArticleCtaData, LinkPreviewData } from "@/lib/views/articleExtras";

/**
 * Thân bài — thiết kế v2.
 *
 * Desktop: hai cột trong 1248px — mục lục dính 216px | bài giãn hết phần còn
 * lại, nên mép phải chữ thẳng mép phải ảnh đầu bài (cùng khung 1200px với
 * `ArticleHero`). Dưới 900px mục lục
 * cột trái biến thành `MobileTocBar` dính dưới header.
 *
 * Thân bài là chuỗi khối: khúc HTML của CKEditor xen kẽ khung CTA tại đúng vị trí
 * biên tập viên chèn. Khung có slug không còn bản ghi (đã bị xoá bên CMS) thì bỏ
 * qua lặng lẽ — bài không vỡ.
 *
 * ## Khoá bài — logic cũ giữ nguyên
 *
 * `gated` (bên CMS) và chưa đăng ký → thân bài bị kẹp `max-h-[600px]
 * lg:max-h-[1000px]` với lớp gradient trắng "Please subscribe to see the
 * detail"; form ở `SubscribeForm` ngay dưới. Đăng ký xong (`useSubscribed`,
 * `localStorage.onelink_subscribed`) là bỏ kẹp.
 */
export function ArticleBody({
  toc,
  blocks,
  ctas,
  previews,
  shareUrl,
  title,
  gated,
}: {
  toc: TocItem[];
  blocks: ArticleBlock[];
  ctas: Record<string, ArticleCtaData>;
  previews: Record<string, LinkPreviewData>;
  shareUrl: string;
  title: string;
  gated: boolean;
}) {
  const subscribed = useSubscribed();
  const locked = gated && !subscribed;
  const asideRef = useAdaptiveStickyTop<HTMLElement>();
  const proseRef = useRef<HTMLDivElement>(null);
  const ids = useMemo(() => toc.map((t) => t.href.replace(/^#/, "")), [toc]);
  const { active, progress, scrollToId } = useArticleProgress(ids, proseRef);

  return (
    <div className="mt-8 md:mt-[72px]">
      <MobileTocBar
        items={toc}
        active={active}
        progress={progress}
        onPick={scrollToId}
        shareUrl={shareUrl}
        title={title}
      />

      {/* Cột chữ tối đa 740px: Poppins 17px ra ~70 ký tự/dòng (956px cũ là ~89,
          mắt phải quay về quá xa để tìm dòng sau). Ảnh, khung CTA, form đăng ký
          nằm trong cột nên theo cùng bề rộng. Cụm mục lục + bài căn giữa khung. */}
      {/* Khoảng hở mục lục → thân bài = khoảng trống giữa CHỮ "About Us" và
          chữ "Products" trên header (padding hai bên link + gap giữa chúng),
          đổi đúng các mốc menu đổi cỡ: 24px (tới xl), 28px (xl), 56px (2xl). */}
      <div className="mx-auto flex max-w-[1248px] items-start justify-center gap-6 xl:gap-7 2xl:gap-14 px-4 pt-2 pb-12 md:px-6 md:pb-24 min-[900px]:pt-0">
        <aside
          ref={asideRef}
          className="hidden min-[900px]:block sticky top-[var(--sidebar-top,106px)] w-[216px] shrink-0"
        >
          <TableOfContents
            items={toc}
            active={active}
            progress={progress}
            onPick={scrollToId}
            shareUrl={shareUrl}
            title={title}
          />
        </aside>

        <div
          ref={proseRef}
          className={cn(
            "article-prose min-w-0 w-full flex-1 max-w-[740px]",
            locked && "relative overflow-clip max-h-[600px] lg:max-h-[1000px]",
          )}
        >
          {blocks.map((block, i) => {
            if (block.type === "cta") {
              const cta = ctas[block.slug];
              return cta ? <ArticleCtaBox key={`cta-${i}`} cta={cta} /> : <Fragment key={`cta-${i}`} />;
            }
            return (
              <div
                key={`html-${i}`}
                className="ap-chunk"
                // HTML của biên tập viên (CKEditor) — đã qua `decorateLinks`
                // (class link) và `withTocAnchors` (id cho mục lục).
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            );
          })}

          {locked && (
            <span className="absolute inset-0 bg-gradient-to-b from-white/0 to-white">
              <span className="absolute inset-x-0 bottom-0 text-center font-medium text-dark-blue-900 text-xl md:text-2xl">
                Please subscribe to see the detail
              </span>
            </span>
          )}
        </div>
      </div>

      <LinkPreviewLayer containerRef={proseRef} previews={previews} />
    </div>
  );
}
