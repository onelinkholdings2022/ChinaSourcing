"use client";

import { useRef, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * A category pill on either listing rail.
 *
 * `href` makes the pill an anchor as well as a filter. The blog rail uses it —
 * every category has its own URL (`/<category-slug>`), so the address bar has
 * to follow the selection. The pill is NOT a navigation though: the click is
 * intercepted, the filter applies in place and the URL is swapped with
 * `history.pushState`. The `href` is there so the pill is a real, crawlable
 * link that opens in a new tab on middle-click and survives with JS off.
 *
 * The resource rail has no `href`: its pills are resource *types*
 * (Checklist / eBook / …), not categories, and those have no page of their own.
 */
export type ListingTab = { value: string; label: string; href?: string };

/**
 * The category rail above each listing.
 *
 * It overflows horizontally with the scrollbar hidden, and the theme wires it
 * up as a **drag-to-scroll** surface in Alpine: `mousedown` latches, `mousemove`
 * pans at 2x the pointer delta, `mouseup`/`mouseleave` release, with
 * `cursor-grab` / `active:cursor-grabbing` as the affordance. Same behaviour
 * here on pointer events, so it works with touch and pen as well.
 *
 * The button styling lives in `globals.css` under `.blog-tab-btn` /
 * `.resource-tab-btn` — the two palettes are inverses of each other, which is
 * why the class name rather than the colours is the prop.
 */
export function TabRail({
  tabs,
  active,
  onSelect,
  buttonClass,
  className,
}: {
  tabs: ListingTab[];
  active: string;
  /** `href` is passed for pills that have one, so the caller can push the URL. */
  onSelect?: (value: string, href?: string) => void;
  /** `blog-tab-btn` or `resource-tab-btn`. */
  buttonClass: string;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, startX: 0, scrollLeft: 0 });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      moved: false,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el || !drag.current.down) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const delta = x - drag.current.startX;
    // Ngưỡng 4px: một cú click bình thường vẫn nhúc nhích vài pixel, đặt 0 là
    // mọi click đều bị coi là kéo và pill không bao giờ bấm được.
    //
    // `scrollWidth > clientWidth` là chốt thứ hai: rail chưa tràn thì kéo không
    // có nghĩa gì, nên đừng bao giờ nuốt cú bấm vì "vừa kéo". Thiếu chốt này
    // thì trên màn rộng — nơi cả 10 pill nằm gọn — một cú rê tay nhỏ cũng làm
    // mất cú bấm, và người dùng chỉ thấy "bấm không ăn".
    if (Math.abs(delta) > 4 && el.scrollWidth > el.clientWidth) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - delta * 2;
  };

  const release = () => {
    drag.current.down = false;
    // `moved` phải sống qua hết lượt click (pointerup xảy ra TRƯỚC click), nên
    // chỉ dọn ở nhịp sau.
    setTimeout(() => {
      drag.current.moved = false;
    }, 0);
  };

  return (
    <div
      ref={railRef}
      className={cn("mt-10 overflow-x-auto no-scrollbar", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerLeave={release}
    >
      <div className="flex gap-4 w-max border-grey-300 mx-auto cursor-grab active:cursor-grabbing">
        {tabs.map((tab) => {
          const className = cn(
            buttonClass,
            "tab px-6 py-4 font-medium whitespace-nowrap",
            tab.value === active && "active",
          );
          return tab.href ? (
            // `<a>` thường, KHÔNG phải `next/link`: Link prefetch cả trang đích
            // rồi router.push khi bấm, mà ở đây không có lượt điều hướng nào để
            // đẩy — bộ lọc chạy tại chỗ. `data-no-transition` bảo
            // `PageTransition` đừng kéo rèm (nó nghe ở pha capture nên phần tử
            // không tự rút lui được).
            <a
              key={tab.value}
              href={tab.href}
              data-no-transition
              className={className}
              onClick={(e) => {
                // Cmd/Ctrl/Shift-click hoặc chuột giữa: để trình duyệt mở tab
                // mới bằng đúng `href` — đó là lý do pill vẫn là thẻ <a>.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                // Kéo ngang rail cũng phát ra `click` trên pill dưới con trỏ.
                // Nuốt luôn, đừng đổi bộ lọc.
                e.preventDefault();
                if (drag.current.moved) return;
                onSelect?.(tab.value, tab.href);
              }}
            >
              {tab.label}
            </a>
          ) : (
            <button
              key={tab.value}
              type="button"
              onClick={() => onSelect?.(tab.value)}
              className={className}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
