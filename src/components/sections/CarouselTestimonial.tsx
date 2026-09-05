"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Tag } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type QuoteTestimonial = {
  quote: string;
  avatar: string | null;
  name: string;
  role: string;
};

/** Swiper `breakpoints` for `.testimonial-swiper` in the theme bundle. */
function slidesPerView(width: number) {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
}

const SPACE_BETWEEN = 24;
const SPEED = 1000;
const AUTOPLAY_DELAY = 2500;

/**
 * `.carousel-testimonial` — quote cards on a loop.
 *
 * The theme's Swiper is `loop: true`, `speed: 1000`, `spaceBetween: 24`,
 * autoplay every 2500ms with `disableOnInteraction: false`, and
 * `slidesPerView` 1 / 2 / 3. Reproduced natively.
 *
 * ## The loop
 *
 * Swiper's `loop` works by cloning slides at both ends and silently jumping
 * back to the real ones when a clone comes into view. The same trick here: the
 * track holds `[…items, …items]` and the index wraps to 0 with the transition
 * switched off, so the wrap is invisible. Without the duplicate the last slide
 * would slide back to the first across the whole track, which the original
 * never does.
 *
 * ## Locking
 *
 * There are three quotes and `slidesPerView` reaches 3, so from 1280px up
 * Swiper has nothing to scroll: it marks itself locked, stops autoplay and
 * puts `swiper-button-lock` (`display: none`) on both arrows. The section is
 * a static three-up row there, 48px shorter than it looks with arrows. Below
 * 1280 the arrows come back and the loop runs. Reproduced — without it the
 * page is 48px too tall at desktop and quietly animates when the source does
 * not.
 *
 * ## The arrows
 *
 * Neither button carries a size class on the original; they take their size
 * from the 48x48 `button-next.svg` inside. They read as 1x1 until that SVG
 * loads, because the lazy-loader ships a 1x1 placeholder first — a transient
 * state, not the design, so the size is stated here rather than inherited.
 *
 * They are `disabled:opacity-20`, but the theme's `reachEnd` /
 * `reachBeginning` handlers can never fire under `loop: true`, so they are
 * never disabled and always wrap. Kept that way.
 */
export function CarouselTestimonial({
  tag,
  heading,
  items,
}: {
  tag: string;
  heading: string;
  items: QuoteTestimonial[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const [viewportW, setViewportW] = useState(0);
  // Suppresses the transition for the one frame in which the track snaps back
  // from the cloned half to the real one.
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const update = () => {
      setPerView(slidesPerView(window.innerWidth));
      setViewportW(viewportRef.current?.clientWidth ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Swiper's `isLocked`: with the whole set on screen there is nowhere to go.
  const locked = items.length <= perView;

  useEffect(() => {
    if (locked) return;
    const timer = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [locked]);

  // Locked means parked at the first slide, whatever `index` happens to hold
  // from a wider viewport — derived rather than reset, so resizing back out
  // does not need a second render to settle.
  const active = locked ? 0 : index;

  // Once the track has advanced a full set, drop back to the equivalent
  // position in the first set with the transition off.
  useEffect(() => {
    if (index < items.length) return;
    const timer = setTimeout(() => {
      setAnimate(false);
      setIndex((i) => i - items.length);
    }, SPEED);
    return () => clearTimeout(timer);
  }, [index, items.length]);

  useEffect(() => {
    if (animate) return;
    // Re-enable on the next frame, after the jump has been painted.
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const slideW = (viewportW - SPACE_BETWEEN * (perView - 1)) / perView;
  const offset = -active * (slideW + SPACE_BETWEEN);
  const track = [...items, ...items];

  return (
    <section className="carousel-testimonial pb-20 lg:pb-[120px] container">
      <Tag className="mx-auto">{tag}</Tag>
      <h2 className="heading-2 font-semibold text-center mt-3 text-cyan-400">
        {heading}
      </h2>

      <div
        ref={viewportRef}
        className="overflow-hidden py-10 mt-2"
        // The theme leaves autoplay running on hover
        // (`disableOnInteraction: false`), so there is no pause handler here.
      >
        <ul
          className="flex items-stretch"
          style={{
            gap: `${SPACE_BETWEEN}px`,
            transform: `translate3d(${offset}px, 0, 0)`,
            transition: animate
              ? `transform ${SPEED}ms cubic-bezier(0.25,0.1,0.25,1)`
              : "none",
          }}
        >
          {track.map((item, i) => (
            <li
              key={`${item.name}-${i}`}
              className="shrink-0"
              style={{ width: slideW || undefined }}
            >
              <div className="h-full flex flex-col justify-between p-4">
                <div className="relative inline-flex gap-4">
                  <blockquote className="body-2 font-medium text-grey-600">
                    <span className="font-normal">{item.quote}</span>
                  </blockquote>
                  <Image
                    src="/images/quote-2.svg"
                    alt=""
                    aria-hidden
                    width={60}
                    height={60}
                    // The theme's classes verbatim, `shrink-0` included nowhere:
                    // once the SVG has loaded its own intrinsic size floors the
                    // flex item at 60px anyway, so the quote gets 359px and the
                    // longest one wraps to seven lines. Before it loads the
                    // item can collapse to 49px and the quote reflows — which
                    // is what the live page shows on a cold view.
                    className="w-8 h-8 lg:w-[60px] lg:h-[60px]"
                  />
                </div>
                <div className="flex flex-row items-center mt-6 gap-2">
                  {item.avatar && (
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold body-2 text-grey-800 font-lora">
                      {item.name}
                    </div>
                    <div className="body-3 text-grey-600">{item.role}</div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center gap-2 mt-6 pb-2">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => setIndex((i) => i - 1 + (i - 1 < 0 ? items.length : 0))}
          className={cn(
            "w-12 h-12 rounded-full disabled:opacity-20 hover:scale-110 cursor-pointer",
            // Swiper's `swiper-button-lock`
            locked && "hidden",
          )}
        >
          <Image
            src="/images/button-next.svg"
            alt=""
            width={48}
            height={48}
            className="w-full h-full object-cover rotate-180"
          />
        </button>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => setIndex((i) => i + 1)}
          className={cn(
            "w-12 h-12 rounded-full disabled:opacity-20 hover:scale-110 cursor-pointer",
            // Swiper's `swiper-button-lock`
            locked && "hidden",
          )}
        >
          <Image
            src="/images/button-next.svg"
            alt=""
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </section>
  );
}
