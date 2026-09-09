"use client";

import { Fragment, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import type { CSSProperties, TransitionEvent } from "react";
import { cn } from "@/lib/utils";
import { SUMMARY_TIMING, COLLAPSED_MAX_HEIGHT } from "./summaryTiming";
import { useSummaryPlay } from "./useSummaryPlay";

/** Sao bốn cánh — glyph vẽ lệch trong hộp 24 (tâm ở x≈9), xem CSS `.sum-sparkle`. */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.996 12.018C16.4011 12.1767 13.9538 13.2791 12.1154 15.1174C10.2771 16.9557 9.17471 19.403 9.016 21.998H8.976C8.656 16.634 4.363 12.342 -1 12.018V11.978C4.363 11.658 8.656 7.36495 8.98 2.00195H9.02C9.344 7.36495 13.637 11.658 19 11.982V12.018H18.996Z" />
    </svg>
  );
}

function CaretDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

/**
 * Ô "Summary" đầu bài — bản port từ OlcoMain (`insights/article/ArticleSummary`),
 * giữ nguyên màn dàn cảnh, đổi bảng màu sang bảng của ô Tag/Date/Reading Time
 * ngay phía trên nó: nền `cyan-50`, nhãn `cyan-900`, thân chữ `grey-600`, mọi
 * nét sáng dùng `cyan-400`.
 *
 * Màn dàn cảnh chạy một lần khi ô lọt khung nhìn: viền sáng chạy một vòng → chữ
 * GÕ RA từng ký tự sau một con trỏ → vệt viền khép vòng khoá lại cả màn. Nhịp và
 * phép đo nằm ở `summaryTiming.ts` / `useSummaryPlay.ts`.
 *
 * Cặp nút Show More/Show Less CHỈ mọc ra khi tóm tắt TRÀN quá 2 dòng — đo thật ở
 * pha đo chứ không đếm ký tự (xem `overflowsTwoLines`); vừa 2 dòng thì ô hiện
 * trọn đoạn, không nút.
 *
 * Khi có gập, Show More/Less animate chiều cao bằng max-height đo từ
 * scrollHeight, và đuôi văn chỉ được gỡ SAU khi transition co xong — gỡ ngay thì
 * nội dung tụt về 2 dòng tức thì, hộp không còn gì để co.
 *
 * `text` là chuỗi đã tóm tắt sẵn từ server (`summarizeArticle` — trích câu từ
 * THÂN BÀI, không phải `metaDescription` bên SEO, và không có model nào chạy sau
 * lưng). Component này chỉ trình bày.
 */
export function ArticleSummary({ text }: { text: string }) {
  const words = useMemo(() => text.split(/\s+/), [text]);
  // Bung phẳng: quy tắc hooks coi mọi truy cập thuộc tính trên một object có
  // chứa ref là "đọc ref trong lúc render".
  const {
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
  } = useSummaryPlay(words);

  const [isExpanded, setIsExpanded] = useState(false);
  // Tách khỏi isExpanded: khi gập, đuôi văn phải sống tới hết transition.
  const [isTailRendered, setIsTailRendered] = useState(false);
  const [maxHeight, setMaxHeight] = useState(COLLAPSED_MAX_HEIGHT);

  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setMaxHeight(COLLAPSED_MAX_HEIGHT);
      // Giảm chuyển động → transition-none → không có transitionend nào tới;
      // gỡ đuôi ngay tại đây.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIsTailRendered(false);
      }
      return;
    }
    // Chiều cao đích chỉ đo được SAU khi đuôi văn vào DOM — trước đó scrollHeight
    // vẫn là chiều cao 2 dòng. `flushSync` mount đuôi ngay trong handler này để
    // đo được tại chỗ, thay vì đo trong một effect chạy sau (cascading render).
    // `overflow-hidden` không ảnh hưởng: scrollHeight luôn báo chiều cao NỘI DUNG.
    flushSync(() => setIsTailRendered(true));
    setMaxHeight(textRef.current?.scrollHeight ?? COLLAPSED_MAX_HEIGHT);
    setIsExpanded(true);
  };

  const handleTextTransitionEnd = (event: TransitionEvent<HTMLParagraphElement>) => {
    if (event.propertyName === "max-height" && !isExpanded) setIsTailRendered(false);
  };

  const isTyped = visibleText !== null && typedChars >= visibleText.length;
  const isTruncated = isCollapsible && visibleText !== null && !isTailRendered;
  /*
   * Đuôi văn CHỈ tồn tại ở bản gập — bản không gập thì `visibleText` đã là trọn
   * đoạn, nên nó vẫn đi qua vòng gõ như thường. Nhầm chỗ này là ô ngắn hiện
   * nguyên đoạn ngay lập tức, mất luôn màn gõ chữ.
   */
  const showTail = isCollapsible && isTailRendered;

  return (
    <section
      ref={hostRef}
      data-summary-state={playState}
      aria-labelledby="article-summary-label"
      /* `mt-6 lg:mt-10`: cùng nhịp mà chính ô Tag/Date/Reading Time dùng để
         cách title, nên ba khối của hero cách nhau đều nhau. */
      className="sum-box relative mt-6 lg:mt-10 max-w-[772px] w-full lg:w-4/5 mx-auto rounded-lg bg-cyan-50 p-6 lg:px-10 lg:py-6"
      style={
        {
          "--sum-reveal-delay": `${SUMMARY_TIMING.textRevealMs}ms`,
          "--sum-cta-delay": `${ctaDelayMs}ms`,
          "--sum-sweep-delay": `${SUMMARY_TIMING.sweepDelayMs}ms`,
          "--sum-sweep-ms": `${sweepMs}ms`,
          ...(lapPx !== null && { "--sum-lap": `${lapPx}px` }),
        } as CSSProperties
      }
    >
      {/* Viền: vành mờ ở lại + vệt sáng chạy một vòng. Ba nét cùng hình học
          (100% × 100%, rx khớp rounded-lg) nên chúng bám đúng mép hộp kể cả khi
          hộp đang mở cao; chuyển động là stroke-dashoffset. */}
      <svg aria-hidden className="sum-ring-svg">
        <rect className="sum-ring-rest" width="100%" height="100%" rx="8" />
        <g className="sum-ring-run">
          <rect className="sum-ring-seg sum-ring-glow" width="100%" height="100%" rx="8" />
          <rect className="sum-ring-seg sum-ring-mid" width="100%" height="100%" rx="8" />
          <rect className="sum-ring-seg sum-ring-head" width="100%" height="100%" rx="8" />
        </g>
      </svg>

      {/* Không dùng gap ở cột ngoài: hàng chữ gập về 0 thì gap vẫn chiếm chỗ —
          khoảng cách nằm trong pt của hàng để gập là hết sạch. */}
      <div className="flex flex-col">
        <p
          id="article-summary-label"
          className="inline-flex items-center gap-2 body-3 font-semibold text-cyan-900"
        >
          <Sparkle className="sum-sparkle w-6 h-6 shrink-0 text-cyan-400" />
          Summary
        </p>

        <div className="sum-reveal">
          <div ref={revealRef} className="sum-reveal-inner">
            {/* pb-1 -mb-1: chừa 4px cho outline focus của nút khỏi bị
                overflow-hidden xén, không đội chiều cao hàng. */}
            <div id="article-summary" className="pt-3 pb-1 -mb-1">
              <p
                ref={textRef}
                onTransitionEnd={handleTextTransitionEnd}
                // Hàng chữ luôn được GHIM sẵn ở chiều cao đích: chữ mount dần nên
                // nếu để hộp co theo, nó nhảy một nấc 24px mỗi lần chữ tràn dòng.
                // Bản gập ghim 2 dòng, bản không gập ghim trọn chiều cao đã đo.
                style={{
                  minHeight: lockedHeight ?? COLLAPSED_MAX_HEIGHT,
                  ...(isCollapsible && { maxHeight }),
                }}
                className={cn(
                  "sum-type-body overflow-hidden body-3 font-medium text-grey-600",
                  "[transition:max-height_450ms_cubic-bezier(0.33,0,0.2,1)] motion-reduce:transition-none"
                )}
              >
                {visibleText === null ? (
                  /* Pha đo: cả đoạn dựng thành từng từ để biết chỗ cắt (và để đo
                     chiều cao trọn), được `[data-summary-state="idle"]` giấu đi
                     nên không ai thấy. */
                  words.map((word, index) => (
                    <Fragment key={index}>
                      <span className="sum-measure">{word}</span>{" "}
                    </Fragment>
                  ))
                ) : (
                  <>
                    {showTail ? text : visibleText.slice(0, typedChars)}
                    {isTruncated && isTyped && <span aria-hidden>…</span>}
                    {!showTail && (
                      <span aria-hidden className={cn("sum-caret", isTyped && "sum-caret-done")} />
                    )}
                  </>
                )}
              </p>

              {/* Show More/Less nằm HẲN MỘT DÒNG DƯỚI phần chữ, không đậu inline
                  sau ký tự cuối: nằm cạnh chữ thì nó dính sát vào câu đang bị cắt
                  dở và đọc ra như một chữ trong câu. */}
              {isCollapsible && (
                <div className="sum-cta mt-1">
                  <button
                    type="button"
                    onClick={handleToggle}
                    aria-expanded={isExpanded}
                    aria-controls="article-summary"
                    className="inline-flex cursor-pointer items-center gap-1 body-3 font-semibold whitespace-nowrap text-cyan-400 transition-colors duration-200 hover:text-cyan-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                    <CaretDown
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
