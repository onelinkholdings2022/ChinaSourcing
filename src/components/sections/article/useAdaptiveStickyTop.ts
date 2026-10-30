"use client";

import { useEffect, useRef } from "react";

/** Header trang trong cao 82px + một nhịp thở — đúng `top-[106px]` cũ. */
const STICKY_TOP = 106;
/** Chừa dưới đáy màn hình khi cột cao hơn viewport. */
const STICKY_BOTTOM_GAP = 24;

/**
 * Port từ OlcoMain. Cột mục lục thấp hơn màn hình: dính ở `top: 106px` như cũ.
 * Cao hơn (bài có mục lục dài): `top` âm vừa đủ để ĐÁY cột dính sát đáy màn
 * hình — cột cuộn theo trang tới khi lộ hết phần dưới (Share + badge Google)
 * rồi mới dính. Không làm thì phần đó nằm ngoài màn hình vĩnh viễn.
 * ResizeObserver bắt cả lúc cột đổi cao (ảnh badge tải xong, đổi cỡ cửa sổ).
 */
export function useAdaptiveStickyTop<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const overflow = window.innerHeight - el.offsetHeight - STICKY_BOTTOM_GAP;
      el.style.setProperty("--sidebar-top", `${Math.min(STICKY_TOP, overflow)}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return ref;
}
