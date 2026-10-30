"use client";

import { cn } from "@/lib/utils";
import { ShareButtons } from "@/components/sections/article/ShareButtons";
import { PreferredSourceBadge } from "@/components/PreferredSourceBadge";

export type TocItem = { href: string; label: string };

/**
 * Mục lục desktop — thiết kế v2.
 *
 * Cột trái 216px, dính ở `top: 106px` (header 82 + 24). Mục đang đọc nền
 * #EEF3FD chữ navy đậm, mục khác xám #5A6280. Dưới danh sách là thanh tiến độ
 * đọc 4px rồi dải "Share".
 */
export function TableOfContents({
  items,
  active,
  progress,
  onPick,
  shareUrl,
  title,
}: {
  items: TocItem[];
  active: number;
  progress: number;
  onPick: (id: string) => void;
  shareUrl: string;
  title: string;
}) {
  return (
    <div>
      {items.length > 0 && (
        <>
          <p className="pl-3 text-[13px] font-semibold text-dark-blue-950">On this page</p>
          <nav aria-label="Table of contents" className="mt-3 flex flex-col gap-0.5">
            {items.map((item, i) => {
              const on = i === Math.max(active, 0);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={on ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onPick(item.href.slice(1));
                  }}
                  className={cn(
                    "block rounded-lg px-3 py-[7px] text-sm leading-[1.45] no-underline",
                    "transition-colors duration-150 ease-[cubic-bezier(.4,0,.2,1)]",
                    on
                      ? "bg-[#EEF3FD] font-semibold text-dark-blue-950"
                      : "text-[#5A6280] hover:bg-[#F4F7FD] hover:text-dark-blue-950",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div
            className="mt-4 ml-3 h-1 rounded-sm bg-[#EEF3FD] overflow-hidden"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div className="h-1 bg-cyan-400" style={{ width: `${progress * 100}%` }} />
          </div>
        </>
      )}

      <div className={cn("ml-3", items.length > 0 && "mt-7 pt-5 border-t border-[#E6EAF4]")}>
        <p className="text-[13px] font-semibold text-dark-blue-950">Share</p>
        <div className="mt-2.5">
          <ShareButtons url={shareUrl} title={title} />
        </div>
      </div>

      {/* Badge Google Preferred Source dưới dải Share — như cột trái bài viết
          của OlcoMain, nhưng bản sáng cho hợp nền trắng của cột này. */}
      <div className="ml-3 mt-7 pt-5 border-t border-[#E6EAF4]">
        <PreferredSourceBadge />
      </div>
    </div>
  );
}
