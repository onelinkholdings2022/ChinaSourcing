"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, Tag } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Industry tabs over a grid of factory logos. The tab rail scrolls
 * horizontally when it overflows, with arrow buttons that fade out at
 * either end.
 */
export function Partners({
  tag = "Manufacturing Network",
  headingLines = ["Our Trusted", "Manufacturing Partners"],
  tabs,
}: {
  tag?: string;
  headingLines?: string[];
  tabs: { label: string; logos: string[] }[];
}) {
  const partnerTabs = tabs;
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

  return (
    <section className="container spacing">
      <Tag className="mx-auto">{tag}</Tag>

      <h2 className="heading-2 font-medium mb-3 lg:mb-8 mt-3 flex flex-wrap gap-x-1 justify-center">
        <span className="text-dark-blue-950 whitespace-pre-wrap">
          {headingLines[0]}
        </span>
        <span className="text-cyan-400">{headingLines[1]}</span>
      </h2>

      <div className="mx-auto mt-16">
        {/* Tab rail */}
        <div className="relative">
          <button
            type="button"
            aria-label="Scroll tabs left"
            onClick={() => scrollBy(-200)}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg z-10 transition-opacity duration-300 p-3 rounded-full text-dark-blue-900",
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
              {partnerTabs.map((tab, i) => (
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
              "absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg z-10 transition-opacity duration-300 p-3 rounded-full text-dark-blue-900",
              atEnd && "opacity-10 cursor-not-allowed pointer-events-none",
            )}
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* Logo grid */}
        <div className="relative py-10 lg:py-[90px]">
          {partnerTabs.map((tab, i) => (
            <div
              key={tab.label}
              hidden={active !== i}
              className={cn(
                "overflow-hidden",
                active === i && "animate-in fade-in slide-in-from-right-4 duration-350",
              )}
            >
              <div className="flex justify-center items-center flex-wrap gap-y-10 gap-x-5 lg:gap-x-10 lg:gap-y-[62px]">
                {tab.logos.map((logo, n) => (
                  <div key={logo} className="w-[45%] md:w-[30%] lg:w-[20%]">
                    <div className="flex items-center justify-center h-[68px]">
                      <Image
                        src={logo}
                        alt={`${tab.label} factory logo ${n + 1}`}
                        width={300}
                        height={82}
                        className="h-[64px] w-auto object-contain grayscale hover:grayscale-0 hover:h-[68px] transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="/products" withArrow>
            Explore Our Products
          </Button>
        </div>
      </div>
    </section>
  );
}
