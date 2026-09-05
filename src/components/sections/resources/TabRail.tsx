"use client";

import { useRef, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import type { ListingTab } from "@/data/resources";

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
  onSelect: (value: string) => void;
  /** `blog-tab-btn` or `resource-tab-btn`. */
  buttonClass: string;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el || !drag.current.down) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = drag.current.scrollLeft - (x - drag.current.startX) * 2;
  };

  const release = () => {
    drag.current.down = false;
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
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onSelect(tab.value)}
            className={cn(
              buttonClass,
              "tab px-6 py-4 font-medium whitespace-nowrap",
              tab.value === active && "active",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
