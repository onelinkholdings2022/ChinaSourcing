"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const SPEED = 300;
/** `spaceBetween` của Swiper trong theme — khoảng cách giữa hai slide, px. */
const SPACE_BETWEEN = 30;

/**
 * "The Why Behind Us" — a three-tab slider.
 *
 * ## This section is NOT the pinned one
 *
 * The theme bundle ships two flow-track implementations. The other one is a
 * GSAP-pinned, scroll-scrubbed tab reel, and it is the obvious thing to assume
 * this is — but it hunts for `.flow-track-wrapper`, `.flow-container
 * .tab-content` and `.flow-track .tab-label`, and **none of those exist on this
 * page**. Verified against the live DOM: those queries return 0 nodes, and the
 * page carries exactly one `.pin-spacer`, which belongs to the Journey
 * timeline. So this is the Swiper variant — click-driven, `allowTouchMove:
 * false`, no scroll coupling at all.
 *
 * ## The one genuinely fiddly bit
 *
 * The label strip scrolls horizontally on narrow screens, and on every slide
 * change the newly-active label animates itself to the centre of that strip
 * with `gsap.to(bar, { scrollLeft, duration: 0.5, ease: "power2.out" })`.
 * That is kept as GSAP rather than `scrollIntoView` because the easing is
 * visible and `scrollIntoView({ behavior: "smooth" })` uses the UA's curve.
 *
 * ## The missing entrance reveal
 *
 * The tag, heading and the tab bar each carry their own `data-aos="fade-up"`
 * on the live DOM (delays 0 / 100 / 150ms) — they rise into place once when
 * the section first scrolls into view, same as everywhere else on the site.
 * That was dropped entirely here (everything just rendered statically), which
 * is what made this section read as "not animated like the original" even
 * though the tab-click transition itself was already correct.
 *
 * ## The staggered copy, which was also missing
 *
 * Sliding the track is only half of what the original does on a tab change.
 * The theme also stages the active slide's contents: eyebrow, heading, image,
 * paragraphs and the "next" link each start 8px to the right and transparent
 * and walk in on their own delay (.25 / .35 / .35 / .45 / .5s, 0.35s each).
 * Swiper drives it purely in CSS off `.swiper-slide-active`; the equivalent
 * here is `.flow-track-slide.is-active`, and the rules live beside the tab-label
 * colours in `globals.css`. Without them the copy just appeared, which is the
 * difference you see against the live site.
 */
export type FlowTrackSlide = {
  label: string;
  subheading: string;
  title: string;
  paragraphs: string[];
  image: string | null;
  alt: string;
  /** Label of the "go to next tab" link; the last slide has none. */
  nextLabel?: string | null;
};

export function FlowTrackTabs({
  tag,
  heading,
  slides,
}: {
  tag: string;
  heading: string;
  slides: FlowTrackSlide[];
}) {
  const [index, setIndex] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const atStart = index <= 0;
  const atEnd = index >= slides.length - 1;

  useEffect(() => {
    const bar = barRef.current;
    const label = labelRefs.current[index];
    if (!bar || !label) return;

    const barBox = bar.getBoundingClientRect();
    const labelBox = label.getBoundingClientRect();
    const left =
      bar.scrollLeft + (labelBox.left - barBox.left) - barBox.width / 2 + labelBox.width / 2;

    const tween = gsap.to(bar, {
      scrollLeft: left,
      duration: 0.5,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, [index]);

  return (
    <section className="flow-track relative spacing overflow-x-clip">
      <div className="flex flex-col container lg:mb-11 mb-6">
        <Reveal>
          <Tag className="mx-auto lg:ml-0">{tag}</Tag>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="heading-2 font-semibold mt-3 text-cyan-400 text-center lg:text-left">
            {heading}
          </h2>
        </Reveal>
      </div>

      <div className="flow-track-section">
        <Reveal delay={150} className="relative">
          <div
            ref={barRef}
            className="bar-labels relative container overflow-x-auto no-scrollbar flex justify-start lg:gap-[204px] gap-2"
          >
            {slides.map((slide, i) => (
              <div
                key={slide.label}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className={cn(
                  "relative lg:text-center text-left flow-track-tab-label",
                  i === index && "active",
                )}
              >
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="cursor-pointer body-1 pb-4 text-nowrap font-semibold lg:pb-6 lg:pt-2 py-2 lg:pl-0 pl-6 focus:outline-none transition-colors relative tab-btn h-full"
                >
                  {slide.label}
                  {/* The theme's own spelling — `tract`, not `track`. Kept so
                      the CSS selector matches without a second rule. */}
                  <span className="absolute block flow-tract-tab-dot left-1/2 bottom-0 transform -translate-x-1/2 w-[9px] h-[9px] rounded-full transition-colors duration-300 z-10" />
                </button>
              </div>
            ))}
          </div>
          <div className="absolute bottom-[4px] left-0 w-full bg-stone-200 h-[1px]" />
        </Reveal>

        <div className="container lg:mt-10 mt-4">
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                // Khoảng cách giữa hai slide là MARGIN, không phải padding —
                // xem chú thích ở `.flow-track-slide`. Nên mỗi nấc phải trượt
                // thêm đúng 30px đó, không chỉ 100%.
                transform: `translate3d(calc(${-index * 100}% - ${index * SPACE_BETWEEN}px), 0, 0)`,
                transition: `transform ${SPEED}ms ease`,
              }}
            >
              {slides.map((slide, i) => (
                <div
                  key={slide.label}
                  className={cn(
                    // `mr-[30px]` chứ KHÔNG phải `pr-[30px]`: Swiper cài
                    // `spaceBetween: 30` bằng margin-right, bề rộng slide vẫn
                    // đúng bằng bề rộng khung. Dùng padding thì phần nội dung
                    // hụt 30px, và cột ảnh `aspect-[540/420]` co từ 540 xuống
                    // 530 — cả section thấp đi 8px ở mọi trang có `.flow-track`.
                    "flow-track-slide w-full shrink-0 mr-[30px]",
                    i === index && "is-active",
                  )}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex md:flex-row flex-col items-center justify-between gap-10 w-full h-full">
                      <div className="content-left flex-1 h-full max-w-[500px]">
                        <div className="subheading tab-subheading text-dark-blue-700 body-3 font-semibold mb-3">
                          {slide.subheading}
                        </div>
                        <h3 className="tab-heading heading-2 font-semibold mb-4 text-cyan-950 font-lora">
                          {slide.title}
                        </h3>
                        <div className="tab-context text-grey-600 body-2 font-medium mb-6 space-y-4">
                          {slide.paragraphs.map((p, k) => (
                            <p key={k}>{p}</p>
                          ))}
                        </div>
                        {/* Last slide has no "next" link on the original */}
                        {slide.nextLabel && slides[i + 1] && (
                          <button
                            type="button"
                            onClick={() => setIndex(i + 1)}
                            className="flow-track-next-tab-btn group inline-flex items-center gap-2 text-dark-blue-900 hover:text-dark-blue-700 font-semibold cursor-pointer"
                          >
                            {slide.nextLabel}
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="stroke-current transition-colors"
                              aria-hidden
                            >
                              <path
                                d="M4 12H20M20 12L14 6M20 12L14 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="content-right flex-1 aspect-[540/420] max-w-[540px]">
                        {slide.image && (
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          width={1024}
                          height={797}
                          className="w-full h-full object-cover rounded-lg shadow-lg"
                        />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-row gap-4 items-center pt-6">
            <button
              type="button"
              aria-label="Previous tab"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className={cn(
                "cursor-pointer",
                atStart && "opacity-60 pointer-events-none grayscale",
              )}
            >
              <Image
                src="/images/button-next.svg"
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 duration-300 rotate-180"
              />
            </button>
            <button
              type="button"
              aria-label="Next tab"
              onClick={() =>
                setIndex((i) => Math.min(slides.length - 1, i + 1))
              }
              className={cn(
                "cursor-pointer",
                atEnd && "opacity-60 pointer-events-none grayscale",
              )}
            >
              <Image
                src="/images/button-next.svg"
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 duration-300"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
