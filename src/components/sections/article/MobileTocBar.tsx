"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/components/sections/article/TableOfContents";
import { getLenis } from "@/components/lenisRef";

/**
 * Thanh mục lục mobile (<900px) — thiết kế v2, màn "B · Đang đọc".
 *
 * Dính ngay dưới header: "2/8" + tên mục đang đọc + mũi tên, nút Share bên
 * phải, thanh tiến độ 3px. Chạm vào thì mở bottom sheet "On this page"; chọn
 * một mục là cuộn tới và đóng sheet.
 *
 * Nằm ở đầu thân bài (không phải trong hero) nên lúc mở bài chưa thấy nó — chỉ
 * hiện khi bắt đầu cuộn vào bài, đúng như thiết kế màn "A · Mở bài".
 */
export function MobileTocBar({
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
  const [open, setOpen] = useState(false);
  const [headerH, setHeaderH] = useState(88);
  // Sheet chỉ dựng sau lần chạm đầu tiên — khi đó chắc chắn đang ở trình duyệt.
  const [mounted, setMounted] = useState(false);
  const current = Math.max(active, 0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const ro = new ResizeObserver(() => setHeaderH(header.getBoundingClientRect().height));
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Khoá cuộn nền khi sheet mở; Esc để đóng.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url: shareUrl });
      else await navigator.clipboard?.writeText(shareUrl);
    } catch {
      // Người dùng huỷ hộp chia sẻ — không có gì để làm.
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      <div
        data-article-tocbar
        className="min-[900px]:hidden sticky z-30 bg-white"
        style={{ top: headerH }}
      >
        <div className="flex h-12 items-center border-y border-[#E6EAF4]">
          <button
            type="button"
            onClick={() => {
              setMounted(true);
              // Một frame để sheet vừa dựng kịp vẽ ở trạng thái đóng, rồi mới trượt lên.
              requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
            }}
            aria-expanded={open}
            aria-haspopup="dialog"
            className="flex h-12 min-w-0 flex-1 items-center gap-2.5 pl-4 pr-2 text-left"
          >
            <span className="whitespace-nowrap text-xs font-semibold text-cyan-400">
              {current + 1}/{items.length}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-dark-blue-950">
              {items[current]?.label}
            </span>
            <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-dark-blue-950">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Share"
            onClick={share}
            className="flex h-12 w-12 shrink-0 items-center justify-center border-l border-[#E6EAF4] text-dark-blue-950"
          >
            <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </button>
        </div>
        <div className="h-[3px] bg-[#EEF3FD]">
          <div className="h-[3px] bg-cyan-400" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {mounted &&
        createPortal(
          <div
            className={cn(
              "min-[900px]:hidden fixed inset-0 z-[60] transition-[visibility] duration-300",
              open ? "visible" : "invisible delay-0",
            )}
            aria-hidden={!open}
          >
            <div
              onClick={() => setOpen(false)}
              className={cn(
                "absolute inset-0 bg-[rgba(4,12,25,.45)] transition-opacity duration-300 ease-[cubic-bezier(.4,0,.2,1)]",
                open ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="On this page"
              className={cn(
                "absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-[20px] bg-white px-4 pt-2.5 pb-6",
                "transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none",
                open ? "translate-y-0" : "translate-y-full",
              )}
              data-lenis-prevent
            >
              <div className="mx-auto h-1 w-10 rounded-sm bg-[#D5DAE6]" />
              <p className="mt-3.5 text-[13px] font-semibold text-[#5A6280]">On this page</p>
              <nav aria-label="Table of contents" className="mt-1.5 flex flex-col">
                {items.map((item, i) => {
                  const on = i === current;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      tabIndex={open ? 0 : -1}
                      aria-current={on ? "location" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        // Đợi sheet nhả khoá cuộn (Lenis `stop()`, body
                        // overflow) rồi mới cuộn — cuộn lúc còn khoá là dừng hụt.
                        window.setTimeout(() => onPick(item.href.slice(1)), 60);
                      }}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-[10px] px-3 py-2 text-[15px] no-underline",
                        on ? "bg-[#EEF3FD] font-semibold text-dark-blue-950" : "text-[#3A4060]",
                      )}
                    >
                      <span className="w-4 shrink-0 text-xs text-[#8A90A8]">{i + 1}</span>
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
