"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { UspViewData } from "@/lib/views/homeView";
import { Button, Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { CircleArrowIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Swiper `slidesPerView` breakpoints from the original theme bundle. */
function slidesPerView(width: number) {
  if (width >= 1440) return 1.5;
  if (width >= 1028) return 1.25;
  return 1;
}

const SPACE_BETWEEN = 30;
const AUTOPLAY_MS = 1500;
/* Sau một cú bấm/kéo tay thì chờ lâu hơn một nhịp autoplay rồi mới chạy tiếp:
   ở nhịp ngắn thế này, dùng thẳng AUTOPLAY_MS nghĩa là vừa buông tay ra track
   đã tự nhảy tiếp. */
const RESUME_MS = 3000;
/** Fraction of a slide's width a drag must clear before it counts as a swipe. */
const DRAG_THRESHOLD_RATIO = 0.15;

/**
 * "We Simplify Sourcing".
 *
 * Customization (see TARGET.md): the original pins this section with a
 * scrubbed GSAP ScrollTrigger and steps the active card off scroll position.
 * At the owner's request the pin is gone — the track now auto-advances on a
 * timer at every breakpoint, using the same 300ms CSS transform transition
 * it always had. The active card still scales 0.85 -> 1, its text still goes
 * grey -> white, the gradient layer still fades .25 -> 1 and the photo still
 * slides in from +20px; only what drives `active` changed. Also added: the
 * track is now pointer-draggable (mouse and touch) at every breakpoint, not
 * just the mobile prev/next buttons.
 */
export function UspSlider({ usps }: { usps: UspViewData[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const dragStartX = useRef(0);

  useEffect(() => {
    const update = () => {
      setPerView(slidesPerView(window.innerWidth));
      setViewportWidth(viewportRef.current?.clientWidth ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Autoplay — loops on its own; hovering (desktop) or touching (mobile
  // drag/buttons) pauses it rather than fighting the visitor's input.
  useEffect(() => {
    if (usps.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % usps.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [usps.length, paused]);

  // Slide width as a percentage of the viewport track, mirroring Swiper's maths
  const slideBasis = `calc(${100 / perView}% - ${
    (SPACE_BETWEEN * (perView - 1)) / perView
  }px)`;

  /*
   * Swiper drops any snap point past `virtualSize - containerWidth` and pins a
   * final one there, so the track never scrolls beyond its own end. Stepping a
   * flat `active * slideWidth` instead would carry the last card to the left
   * edge and leave a gap on the right; the original parks it flush right with
   * the previous card still half visible. At 1920px that is -4434px, not -4927.
   */
  const slideWidth =
    viewportWidth / perView - (SPACE_BETWEEN * (perView - 1)) / perView;
  const virtualWidth =
    usps.length * slideWidth + SPACE_BETWEEN * (usps.length - 1);
  const maxOffset = Math.max(0, virtualWidth - viewportWidth);
  const offset = Math.min(active * (slideWidth + SPACE_BETWEEN), maxOffset);

  // A manual prev/next tap pauses autoplay briefly rather than fighting it —
  // otherwise the timer could step the track again a moment after the click.
  const resumeTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);
  const goTo = (next: number) => {
    setActive(next);
    setPaused(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), RESUME_MS);
  };

  // Pointer drag — unifies mouse and touch. The track follows the pointer
  // 1:1 while held (transition switched off below), then snaps to whichever
  // neighbour the drag cleared the threshold for, or back to the current
  // card if it didn't.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    setIsDragging(true);
    setPaused(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragDelta(e.clientX - dragStartX.current);
  };
  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = Math.max(24, slideWidth * DRAG_THRESHOLD_RATIO);
    let next = active;
    if (dragDelta > threshold) next = active - 1;
    else if (dragDelta < -threshold) next = active + 1;
    setDragDelta(0);
    goTo(((next % usps.length) + usps.length) % usps.length);
  };

  return (
    <section
      /* Theme gốc có `lg:min-h-screen` ở đây (từ 1024px khối này luôn chiếm
         trọn một màn hình). Đã bỏ theo yêu cầu: nền tối làm lộ rõ phần bị kéo
         giãn, khoảng trắng dưới card luôn dày hơn khoảng trên tag đúng bằng
         phần dư của màn hình. Không có nó, section cao đúng bằng nội dung nên
         padding trên/dưới của `.container` cân nhau. */
      className="usp-slider relative overflow-hidden bg-dark-blue-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container py-24 2xl:py-[120px]">
        <div className="flex flex-col w-full gap-3 lg:gap-20 lg:flex-row lg:justify-between lg:items-center mb-8">
          <div>
            <Reveal>
              <Tag className="mx-auto lg:ml-0">What We Do Best</Tag>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="heading-2 font-medium max-w-[815px] text-center lg:text-left mt-3 mx-auto text-white">
                We Simplify Sourcing
              </h2>
            </Reveal>
          </div>
          <Reveal
            delay={100}
            className="flex justify-center items-center lg:justify-end w-full lg:w-fit min-w-fit"
          >
            <Button href="/contact-us" variant="white" withArrow className="w-fit min-w-fit">
              Talk To Our Expert
            </Button>
          </Reveal>
        </div>

        {/* Card track */}
        <div
          ref={viewportRef}
          className={cn("overflow-hidden", isDragging ? "cursor-grabbing" : "cursor-grab")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          style={{ touchAction: "pan-y" }}
        >
          <div
            /* Swiper's default slide speed is 300ms with the `ease` curve */
            className={cn(
              "flex select-none",
              !isDragging && "transition-transform duration-300 ease-[ease]",
            )}
            style={{
              gap: `${SPACE_BETWEEN}px`,
              transform: `translateX(-${offset - dragDelta}px)`,
            }}
          >
            {usps.map((usp, i) => {
              const isActive = i === active;
              return (
                <div
                  key={usp.title}
                  className="shrink-0"
                  style={{ width: slideBasis }}
                >
                  <div
                    className={cn(
                      "flex md:flex-row md:justify-between flex-col-reverse gap-6 md:items-center overflow-hidden relative min-w-full rounded-lg p-6 xl:px-6 xl:py-8 2xl:py-6 2xl:px-8",
                      "transition-[transform,background,color] duration-300 ease-out",
                      isActive
                        ? "scale-100 text-white"
                        : "scale-[0.85] text-[#a3a3a3]",
                    )}
                  >
                    {/* Gradient layer — .25 opacity until the card is active */}
                    <div
                      className={cn(
                        "absolute inset-0 z-0 transition-all duration-[350ms] bg-gradient-to-r from-[#0CB9D5] to-[#1A5591]",
                        isActive ? "opacity-100" : "opacity-25",
                      )}
                    />

                    <div className="md:w-[50%] flex flex-col justify-center md:items-start items-center gap-4 pr-4 2xl:pr-10 relative z-[1]">
                      {/* White star — these cards sit on the cyan gradient, so this icon
                          keeps the original white asset rather than the blue `star-05.png`
                          the other pages use. */}
                      <Image
                        src="/images/star-05-white.png"
                        alt=""
                        width={40}
                        height={40}
                        draggable={false}
                        className={cn(
                          "w-10 h-10 object-contain transition-[filter] duration-300",
                          isActive ? "filter-none" : "grayscale brightness-90",
                        )}
                      />
                      <h3 className="heading-3 font-semibold md:text-left text-center">
                        {usp.title}
                      </h3>
                      <p className="body-3 font-medium md:text-left text-center">
                        {usp.description}
                      </p>
                    </div>

                    <div className="md:w-[40%] relative z-[1]">
                      <div
                        className={cn(
                          "transition-all duration-[450ms] delay-150",
                          isActive
                            ? "translate-x-0 opacity-100"
                            : "translate-x-[20px] opacity-25",
                        )}
                      >
                        <Image
                          src={usp.image}
                          alt={usp.title}
                          width={300}
                          height={300}
                          draggable={false}
                          className="rounded-lg object-cover w-full h-auto aspect-square"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile controls — the original hides these above 1024px */}
        <div className="lg:hidden flex flex-row justify-center items-center gap-4 pt-7">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => goTo((active - 1 + usps.length) % usps.length)}
            className="w-12 h-12 cursor-pointer hover:opacity-70 duration-300"
          >
            <CircleArrowIcon className="w-full h-full rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => goTo((active + 1) % usps.length)}
            className="w-12 h-12 cursor-pointer hover:opacity-70 duration-300"
          >
            <CircleArrowIcon className="w-full h-full" />
          </button>
        </div>
      </div>
    </section>
  );
}
