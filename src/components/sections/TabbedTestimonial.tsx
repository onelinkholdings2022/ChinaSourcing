"use client";

import { useEffect, useRef, useState } from "react";
import { Tag } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/icons";
import { TestimonialCard, type Testimonial } from "@/components/sections/TestimonialCard";
import { cn } from "@/lib/utils";

export type TestimonialTab = { label: string; items: Testimonial[] };

/**
 * `.tabbed-testimonial` — the same scrolling tab rail as the partner logos,
 * with three testimonials per panel instead of a logo grid.
 *
 * The rail overflows on narrow screens; the arrows fade to 10% at either end
 * rather than disappearing, which is what the theme does. Panels re-mount on
 * change (`key`) so the slide-in from the right replays — the theme gets that
 * from Alpine's `x-transition:enter`.
 */
export function TabbedTestimonial({
  tag,
  heading,
  tabs,
}: {
  tag: string;
  heading: string;
  tabs: TestimonialTab[];
}) {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const checkScroll = () => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scrollBy = (delta: number) => {
    railRef.current?.scrollBy({ left: delta, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  const panel = tabs[active];

  return (
    <section className="tabbed-testimonial container spacing">
      <Tag className="mx-auto">{tag}</Tag>
      <h2 className="heading-2 font-semibold mb-10 text-center mt-3">
        {heading}
      </h2>

      <div className="mx-auto">
        <div className="relative max-w-full sm:max-w-fit mx-auto">
          <button
            type="button"
            aria-label="Scroll tabs left"
            onClick={() => scrollBy(-200)}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg z-10 transition-opacity duration-300 p-3 rounded-full text-dark-blue-900 cursor-pointer",
              atStart && "opacity-10 cursor-not-allowed pointer-events-none",
            )}
          >
            <ChevronRightIcon className="rotate-180" />
          </button>

          <div
            ref={railRef}
            onScroll={checkScroll}
            className="overflow-x-auto no-scrollbar border-b border-grey-200"
          >
            <div className="flex w-max mx-auto">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex-shrink-0 text-base leading-7 px-6 py-4 transition-colors duration-300 whitespace-nowrap cursor-pointer",
                    active === i
                      ? "bg-dark-blue-900 text-white"
                      : "text-grey-400 hover:text-dark-blue-900",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Scroll tabs right"
            onClick={() => scrollBy(200)}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg z-10 transition-opacity duration-300 p-3 rounded-full text-dark-blue-900 cursor-pointer",
              atEnd && "opacity-10 cursor-not-allowed pointer-events-none",
            )}
          >
            <ChevronRightIcon />
          </button>
        </div>

        <div className="relative py-10">
          {panel && (
            <div key={panel.label} className="overflow-hidden animate-tab-in">
              <div className="flex flex-row flex-wrap justify-center gap-10 2xl:gap-x-20">
                {panel.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-row md:w-[calc(50%-20px)] lg:w-[calc(33.33%-27px)] 2xl:w-[calc(33.33%-54px)]"
                  >
                    <TestimonialCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
