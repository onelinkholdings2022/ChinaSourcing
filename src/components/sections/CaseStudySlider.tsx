"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { aboutCaseStudies } from "@/data/about";
import { Button, Tag } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Swiper `breakpoints` from the theme bundle. */
function slidesPerView(width: number) {
  if (width >= 1280) return 2;
  if (width >= 768) return 1.5;
  return 1;
}

const SPACE_BETWEEN = 24;
const SPEED = 1000;

export type CaseCard = {
  /** Only the detail pages print one, above the title. */
  category?: string | null;
  title: string;
  body: string;
  href: string;
  image: string;
  alt: string;
};

/**
 * The `.case-study-swiper` band — cards of other case studies with a
 * "See All Case Studies" button beside the heading.
 *
 * Two dressings of one block. `/about-us`, `/products` and `/services` render
 * it on white as "Explore Real Businesses. Real Results." with the tag above
 * the heading row; every `/case-study/<slug>` page renders it on indigo as
 * "Explore more Case Studies" with the tag inside the heading column and a
 * cyan button. The slider itself is identical, so the difference is a prop.
 *
 * A Swiper on the original with `slidesPerView` 1 / 1.5 / 2 and `speed: 1000`.
 * The fractional 1.5 is the point of the design — half of the next card peeks
 * in at tablet width — so the track is sized from the viewport rather than
 * using a grid.
 *
 * The arrows carry a real `disabled` attribute at each end, which is what
 * `disabled:grayscale disabled:opacity-60` hangs off.
 */
export function CaseStudySlider({
  tag = aboutCaseStudies.tag,
  headingLines = aboutCaseStudies.headingLines,
  cards = aboutCaseStudies.cards,
  ctaLabel = "See All Case Studies",
  ctaHref = "/case-studies",
  variant = "light",
}: {
  tag?: string;
  /** Rendered `<br/>`-separated, which is how the theme breaks the light one. */
  headingLines?: string[];
  cards?: CaseCard[];
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "light" | "dark";
} = {}) {
  const dark = variant === "dark";
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const [viewportW, setViewportW] = useState(0);

  useEffect(() => {
    const update = () => {
      setPerView(slidesPerView(window.innerWidth));
      setViewportW(viewportRef.current?.clientWidth ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, Math.ceil(cards.length - perView));
  const slideW = (viewportW - SPACE_BETWEEN * (perView - 1)) / perView;
  const offset = -index * (slideW + SPACE_BETWEEN);

  const atStart = index <= 0;
  const atEnd = index >= maxIndex;

  return (
    <section
      className={cn(
        "casestudy-slider spacing",
        dark && "mb-20 lg:mb-[120px] bg-dark-blue-950",
      )}
    >
      <div className="container">
        {!dark && <Tag className="mx-auto lg:ml-0">{tag}</Tag>}

        <div
          className={cn(
            "flex flex-col gap-3 lg:gap-20 lg:flex-row lg:justify-between lg:items-center",
            !dark && "mt-3",
          )}
        >
          <div>
            {dark && <Tag className="mx-auto lg:ml-0">{tag}</Tag>}
            <h2
              className={cn(
                "heading-2 font-semibold max-w-[815px] mx-auto text-center lg:text-left",
                dark ? "text-white mt-3" : "text-cyan-400",
              )}
            >
              {headingLines.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <div className="flex justify-center items-center">
            <Button
              href={ctaHref}
              variant={dark ? "primary" : "white"}
              withArrow
            >
              {ctaLabel}
            </Button>
          </div>
        </div>

        <div ref={viewportRef} className="overflow-hidden">
          <ul
            className="flex mt-10 items-stretch"
            style={{
              gap: `${SPACE_BETWEEN}px`,
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: `transform ${SPEED}ms cubic-bezier(0.25,0.1,0.25,1)`,
            }}
          >
            {/* Keyed by position: several pages list the same study twice, so
                the title is not unique. */}
            {cards.map((card, i) => (
              <li
                key={`${card.href}-${i}`}
                className="shrink-0"
                style={{ width: slideW || undefined }}
              >
                <div className="p-6 bg-cyan-50 border border-cyan-50 transition-all duration-300 hover:bg-dark-blue-950 group hover:text-white text-dark-blue-950 rounded-lg overflow-hidden flex md:flex-row flex-col-reverse gap-4 xl:p-10 h-full">
                  <div className="w-full md:w-1/2 flex flex-col h-full justify-between lg:gap-0 gap-6">
                    <div className="flex flex-col lg:gap-0 gap-4">
                      {card.category && (
                        <div className="body-3 text-dark-blue-400 font-lora min-h-5 font-semibold">
                          {card.category}
                        </div>
                      )}
                      <h3 className="body-1 lg:mt-2 lg:mb-4 font-semibold sm:min-h-[60px]">
                        {card.title}
                      </h3>
                      <p className="body-3 font-medium sm:min-h-[100px] line-clamp-4">
                        {card.body}
                      </p>
                    </div>
                    <div className="lg:mt-10">
                      <Button
                        href={card.href}
                        variant="white"
                        withArrow
                        className="w-fit"
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center items-center">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={1024}
                      height={667}
                      className="w-full aspect-square rounded-xl object-cover"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex lg:justify-start justify-center gap-4 mt-10">
          <button
            type="button"
            aria-label="Previous case study"
            disabled={atStart}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="w-12 h-12 rounded-full disabled:grayscale disabled:cursor-default disabled:opacity-60 hover:opacity-70 cursor-pointer"
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
            aria-label="Next case study"
            disabled={atEnd}
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            className="w-12 h-12 rounded-full disabled:grayscale disabled:cursor-default disabled:opacity-60 hover:opacity-70 cursor-pointer"
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
      </div>
    </section>
  );
}
