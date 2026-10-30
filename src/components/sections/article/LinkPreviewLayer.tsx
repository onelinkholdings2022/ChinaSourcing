"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { LinkPreviewData } from "@/lib/views/articleExtras";

const SHOW_DELAY = 300;
const HIDE_DELAY = 150;
const CARD_W = 300;
const GAP = 12;
/** Chiều cao ước lượng của thẻ có ảnh — đủ để quyết định đặt trên hay dưới link. */
const CARD_H_EST = 250;

type Anchor = { key: string; href: string; rect: DOMRect };

/**
 * Popup xem trước của link nội bộ trong thân bài — thiết kế v2.
 *
 * Chỉ trên thiết bị có chuột (`hover: hover` + `pointer: fine`): giữ chuột (hoặc
 * focus bằng bàn phím) trên link 300ms thì hiện thẻ ảnh + nhãn loại trang + tiêu
 * đề + mô tả 2 dòng của trang đích. Không có nút "View page" — bấm cả thẻ là đi.
 * Mobile không có thẻ: chạm là đi link.
 *
 * Dữ liệu dựng sẵn ở server (`buildLinkPreviews`), không fetch lúc hover.
 * Một thẻ duy nhất cho cả bài, gắn bằng uỷ quyền sự kiện trên vùng thân bài, vì
 * link nằm trong HTML của CKEditor chứ không phải component React.
 */
export function LinkPreviewLayer({
  containerRef,
  previews,
}: {
  containerRef: RefObject<HTMLElement | null>;
  previews: Record<string, LinkPreviewData>;
}) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<number | undefined>(undefined);
  const hideTimer = useRef<number | undefined>(undefined);
  const overCard = useRef(false);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || Object.keys(previews).length === 0) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");

    const linkOf = (t: EventTarget | null) =>
      (t as HTMLElement | null)?.closest?.<HTMLAnchorElement>("a.kw-link[data-preview]") ?? null;

    const schedule = (link: HTMLAnchorElement) => {
      const key = link.dataset.preview ?? "";
      if (!previews[key]) return;
      window.clearTimeout(hideTimer.current);
      window.clearTimeout(showTimer.current);
      showTimer.current = window.setTimeout(() => {
        setAnchor({ key, href: link.getAttribute("href") ?? key, rect: link.getBoundingClientRect() });
        requestAnimationFrame(() => setVisible(true));
      }, SHOW_DELAY);
    };
    const leave = () => {
      window.clearTimeout(showTimer.current);
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        if (!overCard.current) setVisible(false);
      }, HIDE_DELAY);
    };

    const onOver = (e: MouseEvent) => {
      if (!mq.matches) return;
      const link = linkOf(e.target);
      if (link && !link.contains(e.relatedTarget as Node | null)) schedule(link);
    };
    const onOut = (e: MouseEvent) => {
      const link = linkOf(e.target);
      if (link && !link.contains(e.relatedTarget as Node | null)) leave();
    };
    const onFocusIn = (e: FocusEvent) => {
      const link = linkOf(e.target);
      if (link && mq.matches && link.matches(":focus-visible")) schedule(link);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (linkOf(e.target)) leave();
    };
    // Thẻ đặt `fixed` theo vị trí link lúc mở — cuộn là lệch, nên ẩn đi.
    const onScroll = () => {
      window.clearTimeout(showTimer.current);
      setVisible(false);
    };

    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseout", onOut);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(showTimer.current);
      window.clearTimeout(hideTimer.current);
      root.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseout", onOut);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [containerRef, previews]);

  if (!anchor || typeof document === "undefined") return null;
  const data = previews[anchor.key];
  if (!data) return null;

  const { rect } = anchor;
  const vw = window.innerWidth;
  const left = Math.min(Math.max(12, rect.left), vw - CARD_W - 12);
  const headerH = document.querySelector("header")?.getBoundingClientRect().height ?? 82;
  const above = rect.top - headerH > CARD_H_EST + GAP;
  const position = above
    ? { left, bottom: window.innerHeight - rect.top + GAP }
    : { left, top: rect.bottom + GAP };

  return createPortal(
    <a
      href={anchor.href}
      role="tooltip"
      tabIndex={-1}
      onMouseEnter={() => {
        overCard.current = true;
        window.clearTimeout(hideTimer.current);
      }}
      onMouseLeave={() => {
        overCard.current = false;
        setVisible(false);
      }}
      onTransitionEnd={() => {
        if (!visible) setAnchor(null);
      }}
      style={position}
      className={cn(
        "fixed z-[70] block w-[300px] overflow-hidden rounded-xl border border-[#E3E8F5] bg-white no-underline",
        "shadow-[0_16px_32px_rgba(39,48,141,.18)]",
        "transition-[opacity,transform] duration-300 ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transform-none",
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-1",
      )}
    >
      {data.image && (
        // eslint-disable-next-line @next/next/no-img-element -- ảnh nhỏ 300x120 của Strapi, không cần tối ưu qua next/image
        <img src={data.image} alt="" className="block h-[120px] w-full bg-[#C9CED8] object-cover" />
      )}
      <span className="block px-4 pt-3.5 pb-4">
        <span className="block text-xs font-semibold text-cyan-400">{data.label}</span>
        <span className="mt-1 block text-[15px] font-semibold leading-[1.4] text-dark-blue-950">{data.title}</span>
        {data.description && (
          <span className="mt-1.5 line-clamp-2 text-[13px] leading-[1.5] text-[#5A6280]">{data.description}</span>
        )}
      </span>
    </a>,
    document.body,
  );
}
