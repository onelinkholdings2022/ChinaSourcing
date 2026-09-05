"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type ServiceCardData = {
  href: string;
  tag: string;
  title: string;
  body: string;
  ctaLabel: string;
  image: string | null;
  alt: string;
};

/**
 * One service card. `.service-list` (the /services index) and
 * `.service-carousel` (bottom of every service page) render exactly the same
 * card; only the container around them differs, so it lives here once.
 *
 * The whole card is the link and the hover is driven off `group`: the panel
 * goes `bg-cyan-50 → bg-dark-blue-950` and every piece of text inverts with it.
 */
function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    <Link
      href={card.href}
      className="service-item w-full h-full group bg-cyan-50 p-6 rounded-lg transition-all duration-300 hover:bg-dark-blue-950 flex flex-col justify-between"
    >
      <Tag className="ml-0">{card.tag}</Tag>
      <h3 className="heading-2 text-cyan-950 group-hover:text-white font-semibold my-3 transition-all duration-300 grow">
        {card.title}
      </h3>
      <p className="mb-6 text-grey-600 body-2 font-medium group-hover:text-dark-blue-400 transition-all duration-300 line-clamp-2">
        {card.body}
      </p>
      <p className="text-sm leading-6 mb-8 text-cyan-400 font-semibold inline-flex gap-2 items-center h-fit group-hover:text-white transition-all duration-300">
        {card.ctaLabel}
        <ArrowRightIcon className="w-4 h-4" />
      </p>
      {card.image && (
        <Image
          src={card.image}
          alt={card.alt}
          width={1024}
          height={576}
          className="w-full h-auto aspect-[16/9] object-cover rounded-[15px]"
        />
      )}
    </Link>
  );
}

/** `.service-list` — the four core services, two per row. */
export function ServiceList({ cards }: { cards: ServiceCardData[] }) {
  return (
    <section className="service-list spacing" id="services">
      <div className="container flex flex-row flex-wrap justify-center gap-10 2xl:gap-20">
        {cards.map((card) => (
          <Reveal
            key={card.href}
            className="w-full max-w-[700px] mx-auto md:w-[calc(50%-20px)] 2xl:w-[calc(50%-40px)]"
          >
            <ServiceCard card={card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Swiper `breakpoints` for `.service-swiper`, from the theme bundle. */
function slidesPerView(width: number) {
  if (width >= 1280) return 2.5;
  if (width >= 768) return 1.5;
  return 1;
}

const SPACE_BETWEEN = 24;
const SPEED = 1000;

/**
 * `.service-carousel` — "Other Services You Might Need".
 *
 * Swiper on the original: `slidesPerView` 1 / 1.5 / 2.5 at 768 / 1280,
 * `speed: 1000`, `spaceBetween: 24`, arrows `.swiper-button-{prev,next}-custom-se`
 * which take `disabled:opacity-20`. The fractional 2.5 is the design — the third
 * card is meant to be half-visible, inviting the swipe.
 */
export function ServiceCarousel({
  tag,
  heading,
  intro,
  cards,
  ctaLabel,
  ctaHref,
}: {
  tag: string;
  heading: string;
  intro?: string | null;
  cards: ServiceCardData[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
}) {
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
    <section className="service-carousel spacing">
      <div className="container">
        <div className="flex flex-col gap-3 lg:gap-20 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <Tag className="mx-auto lg:ml-0">{tag}</Tag>
            <h2 className="heading-2 font-semibold max-w-[815px] text-center lg:text-left mt-3 text-cyan-400">
              {heading}
            </h2>
            {intro && (
              <p className="body-2 text-center lg:text-left font-medium mt-4">
                {intro}
              </p>
            )}
          </div>

          <div className="flex justify-center lg:justify-end gap-2 mt-6">
            <button
              type="button"
              aria-label="Previous service"
              disabled={atStart}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className={cn(
                "w-12 h-12 rounded-full hover:scale-110 transition-transform cursor-pointer",
                atStart && "opacity-20 cursor-default",
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
              aria-label="Next service"
              disabled={atEnd}
              onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
              className={cn(
                "w-12 h-12 rounded-full hover:scale-110 transition-transform cursor-pointer",
                atEnd && "opacity-20 cursor-default",
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
        </div>

        <div ref={viewportRef} className="overflow-hidden mt-10">
          <ul
            className="flex items-stretch"
            style={{
              gap: `${SPACE_BETWEEN}px`,
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: `transform ${SPEED}ms cubic-bezier(0.25,0.1,0.25,1)`,
            }}
          >
            {cards.map((card) => (
              <li
                key={card.href}
                className="shrink-0"
                style={{ width: slideW || undefined }}
              >
                <ServiceCard card={card} />
              </li>
            ))}
          </ul>
        </div>

        {ctaLabel && ctaHref && (
          <div className="flex justify-center items-center mt-10">
            <Button href={ctaHref} variant="primary" withArrow>
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
