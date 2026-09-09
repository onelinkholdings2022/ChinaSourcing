"use client";

import { useEffect, useRef, useState } from "react";
import {
  SUMMARY_TIMING,
  FALLBACK_CTA_DELAY_MS,
  FALLBACK_SWEEP_MS,
  countVisibleWords,
  overflowsTwoLines,
  ringLapPx,
} from "./summaryTiming";

/**
 * Màn dàn cảnh MỘT LẦN của ô Summary: chờ ô lọt khung nhìn → đo → gõ chữ.
 * Bản port từ OlcoMain, không đổi logic.
 *
 * Chữ được MOUNT dần (`typedChars`) chứ không hiện dần bằng opacity: chỉ khi
 * DOM thật sự ngắn dần thì con trỏ mới tự nằm sau ký tự vừa gõ mà không phải đo
 * toạ độ. Vòng gõ hữu hạn (~1,5s) và React phải nắm DOM này để lo tiếp Show
 * More/Less.
 *
 * CÓ GẬP HAY KHÔNG cũng do pha đo này quyết (`isCollapsible`): đoạn tràn quá 2
 * dòng thì gõ phần lọt 2 dòng rồi mọc ra cặp nút Show More/Show Less; vừa 2
 * dòng thì gõ trọn đoạn, không nút — và lúc đó phải ghim chiều cao TRỌN của
 * đoạn lại, vì chữ mount dần nên để hộp co giãn theo là nó giật một nấc mỗi
 * lần xuống dòng.
 */
export function useSummaryPlay(words: string[]) {
  // idle = chờ lọt khung nhìn; play = đã chạy, giữ nguyên vĩnh viễn.
  const [playState, setPlayState] = useState<"idle" | "play">("idle");
  /** Phần chữ sẽ được gõ ra — null khi chưa đo (đang render cả đoạn để đo). */
  const [visibleText, setVisibleText] = useState<string | null>(null);
  const [typedChars, setTypedChars] = useState(0);
  const [ctaDelayMs, setCtaDelayMs] = useState(FALLBACK_CTA_DELAY_MS);
  const [sweepMs, setSweepMs] = useState(FALLBACK_SWEEP_MS);
  /** Chu vi viền tính bằng px — null khi chưa đo, CSS dùng giá trị fallback. */
  const [lapPx, setLapPx] = useState<number | null>(null);
  /** Chiều cao ghim cho hàng chữ — null khi chưa đo, hoặc khi ô có gập. */
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  /** Đoạn có tràn quá 2 dòng không — chỉ biết sau pha đo. */
  const [isCollapsible, setIsCollapsible] = useState(false);

  const hostRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const textEl = textRef.current;
        // Bản không gập gõ TRỌN đoạn; bản gập chỉ gõ phần lọt 2 dòng.
        let typed = words.join(" ");
        if (textEl) {
          // Lúc này DOM còn đang dựng CẢ đoạn (pha đo), nên scrollHeight là
          // chiều cao THẬT của đoạn — cả câu hỏi "có tràn 2 dòng không" lẫn
          // chiều cao ghim đều phải đọc ở đây, trước khi chữ bị cắt bớt.
          const collapses = overflowsTwoLines(textEl);
          setIsCollapsible(collapses);
          if (collapses) {
            typed = words.slice(0, countVisibleWords(textEl)).join(" ");
          } else {
            setLockedHeight(textEl.scrollHeight);
          }
        }

        const textDoneMs = SUMMARY_TIMING.typeStartMs + typed.length * SUMMARY_TIMING.charStepMs;
        setVisibleText(typed);
        setCtaDelayMs(textDoneMs + SUMMARY_TIMING.ctaGapMs);
        setSweepMs(
          Math.max((textDoneMs - SUMMARY_TIMING.sweepDelayMs) * SUMMARY_TIMING.sweepStretch, 800)
        );

        setLapPx(ringLapPx(host.getBoundingClientRect(), revealRef.current?.scrollHeight ?? 0));
        setPlayState("play");
        observer.disconnect();
      },
      // Nửa ô vào khung mới chạy — hé một mép đã gõ thì hết chữ trước khi người
      // đọc kịp nhìn tới.
      { threshold: 0.5 }
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [words]);

  // Vòng gõ chữ. Tính số ký tự theo THỜI GIAN TRÔI QUA chứ không cộng dồn mỗi
  // frame: máy chậm bỏ frame thì nó gõ dồn cho kịp, tổng thời lượng vẫn đúng
  // bằng con số đã hẹn giờ cho nút và vệt viền.
  useEffect(() => {
    if (playState !== "play" || visibleText === null) return;
    // Giảm chuyển động: bước gõ = 0 ⇒ ngay frame đầu đã đủ chữ. Đi chung một
    // đường với bản có animation thay vì setState thẳng trong effect.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = prefersReduced ? 0 : SUMMARY_TIMING.charStepMs;
    let frame = 0;
    const startAt = performance.now() + (prefersReduced ? 0 : SUMMARY_TIMING.typeStartMs);
    const tick = (now: number) => {
      const next =
        step === 0
          ? visibleText.length
          : Math.min(Math.max(Math.floor((now - startAt) / step), 0), visibleText.length);
      setTypedChars(next);
      if (next < visibleText.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playState, visibleText]);

  return {
    hostRef,
    textRef,
    revealRef,
    playState,
    visibleText,
    typedChars,
    ctaDelayMs,
    sweepMs,
    lapPx,
    lockedHeight,
    isCollapsible,
  };
}
