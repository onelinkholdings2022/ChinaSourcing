"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { getLenis } from "@/components/lenisRef";

/**
 * Scroll-spy + tiến độ đọc cho mục lục.
 *
 * `active` = heading CUỐI CÙNG đã đi qua vạch đọc (đáy header + thanh mục lục
 * mobile + 24px); trước heading đầu tiên là -1. `progress` 0→1 theo phần thân bài
 * đã cuộn qua vạch đó.
 *
 * Đọc lại vị trí trong `requestAnimationFrame` ở mỗi sự kiện scroll — Lenis cuộn
 * `window` thật nên sự kiện scroll vẫn bắn đều.
 */
export function useArticleProgress(ids: string[], bodyRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  const offsetRef = useRef(106);

  /** Vạch đọc: đáy của mọi thứ đang dính trên đầu trang + 24px. */
  const readLine = useCallback(() => {
    const header = document.querySelector("header");
    const bar = document.querySelector<HTMLElement>("[data-article-tocbar]");
    const headerH = header?.getBoundingClientRect().height ?? 82;
    const barH = bar && bar.offsetParent !== null ? bar.getBoundingClientRect().height : 0;
    return headerH + barH + 24;
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = readLine();
      offsetRef.current = line;
      let next = -1;
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top - line <= 1) next = i;
      }
      setActive(next);

      const body = bodyRef.current;
      if (body) {
        const rect = body.getBoundingClientRect();
        const total = rect.height - (window.innerHeight - line);
        const done = line - rect.top;
        setProgress(total > 0 ? Math.min(1, Math.max(0, done / total)) : 0);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, bodyRef, readLine]);

  /** Cuộn tới heading, dừng ngay dưới vạch đọc (không nhảy hash thô). */
  const scrollToId = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const offset = readLine() - 8;
      // Tự tính toạ độ rồi đưa SỐ cho Lenis: đưa phần tử thì Lenis cộng thêm
      // `scroll-margin-top` của heading vào offset, thành trừ hai lần.
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(top, { duration: 1, force: true });
      } else {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }
      history.replaceState(null, "", `#${id}`);
    },
    [readLine],
  );

  return { active, progress, scrollToId };
}
