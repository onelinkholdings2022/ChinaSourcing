"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { UspViewData } from "@/lib/views/homeView";
import { Button, Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { CircleArrowIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** Swiper `slidesPerView` breakpoints from the original theme bundle. */
function slidesPerView(width: number) {
  if (width >= 1440) return 1.5;
  if (width >= 1028) return 1.25;
  return 1;
}

const SPACE_BETWEEN = 30;

/**
 * "We Simplify Sourcing".
 *
 * Reproduces the original's behaviour: above 1024px the section pins and the
 * card track advances one card per scroll step, driven by a scrubbed
 * ScrollTrigger. The active card scales 0.85 -> 1, its text goes grey -> white,
 * the gradient layer fades .25 -> 1 and the photo slides in from +20px.
 * Below 1024px there is no pin — it is a plain swipeable carousel.
 */
export function UspSlider({ usps }: { usps: UspViewData[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      setPerView(slidesPerView(window.innerWidth));
      setViewportWidth(viewportRef.current?.clientWidth ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    // Desktop only — the original guards this with `window.innerWidth > 1024`
    if (window.innerWidth <= 1024) return;

    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const n = usps.length;

    // Everything is created inside the context so `ctx.revert()` unwinds the
    // pin spacer too. Killing the trigger by hand instead leaves the spacer in
    // the DOM, and React's double-mount in dev then measures inside the stale
    // one — the section stops pinning altogether.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // end: +=(n-1) * (trackHeight + 100), straight from the theme bundle
        end: () => `+=${(n - 1) * (track.offsetHeight + 100)}`,
        pin: true,
        // `body` is a scroll container here (it carries overflow-x: hidden), so
        // ScrollTrigger would otherwise pin by translating the section, which
        // reads as the section scrolling away instead of holding still.
        pinType: "fixed",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setActive(Math.round(self.progress * (n - 1)));
        },
      });
    }, sectionRef);

    // `end` is derived from the card height, which is wrong until the card
    // photography has laid out. Re-measure once the images are in — the
    // original defers its whole init by 200ms for the same reason.
    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 200);
    const images = Array.from(track.querySelectorAll("img"));
    images.forEach((img) => img.addEventListener("load", refresh));
    window.addEventListener("load", refresh);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
      images.forEach((img) => img.removeEventListener("load", refresh));
      ctx.revert();
    };
  }, []);

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

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-dark-blue-950 lg:min-h-screen"
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
        <div ref={viewportRef} className="overflow-hidden">
          <div
            ref={trackRef}
            /* Swiper's default slide speed is 300ms with the `ease` curve */
            className="flex transition-transform duration-300 ease-[ease]"
            style={{
              gap: `${SPACE_BETWEEN}px`,
              transform: `translateX(-${offset}px)`,
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
            onClick={() => setActive((i) => (i - 1 + usps.length) % usps.length)}
            className="w-12 h-12 cursor-pointer hover:opacity-70 duration-300"
          >
            <CircleArrowIcon className="w-full h-full rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => setActive((i) => (i + 1) % usps.length)}
            className="w-12 h-12 cursor-pointer hover:opacity-70 duration-300"
          >
            <CircleArrowIcon className="w-full h-full" />
          </button>
        </div>
      </div>
    </section>
  );
}
