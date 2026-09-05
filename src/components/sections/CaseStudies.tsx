"use client";

import { useState } from "react";
import Image from "next/image";
import type { CaseStudyCardViewData } from "@/lib/views/homeView";
import { Button, Tag } from "@/components/ui/button";
import { CircleArrowIcon } from "@/components/icons";

/** Carousel: 2 cards per view on desktop, 1 on mobile. */
const PER_VIEW_DESKTOP = 2;

export function CaseStudies({ caseStudies }: { caseStudies: CaseStudyCardViewData[] }) {
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, caseStudies.length - PER_VIEW_DESKTOP);

  return (
    <section className="spacing">
      <div className="container">
        <Tag className="mx-auto lg:ml-0">Real Outcomes</Tag>

        <div className="flex flex-col gap-3 lg:gap-20 lg:flex-row lg:justify-between lg:items-center mt-3">
          {/* The heading needs its own wrapper: as a direct flex child its
              `mx-auto` would eat the free space and drag it to the middle
              instead of leaving it against the left edge. */}
          <div>
            <h2 className="heading-2 text-cyan-400 mx-auto font-semibold max-w-[815px] text-center lg:text-left">
              Explore Real Businesses.
              <br />
              Real Results.
            </h2>
          </div>
          <div className="flex justify-center items-center">
            <Button href="/case-studies" variant="white" withArrow>
              See All Case Studies
            </Button>
          </div>
        </div>

        {/* Track */}
        <div className="overflow-hidden mt-10">
          <div
            className="flex transition-transform duration-500 ease-out -mx-3"
            style={{ transform: `translateX(-${start * (100 / PER_VIEW_DESKTOP)}%)` }}
          >
            {caseStudies.map((item) => (
              <div
                key={item.title}
                className="w-full lg:w-1/2 shrink-0 px-3"
              >
                <div className="p-6 xl:p-10 bg-cyan-50 border border-cyan-50 transition-all duration-300 hover:bg-dark-blue-950 group hover:text-white text-dark-blue-950 rounded-lg overflow-hidden flex md:flex-row flex-col-reverse gap-4 h-full">
                  <div className="w-full md:w-1/2 flex flex-col h-full justify-between lg:gap-0 gap-6">
                    <div className="flex flex-col lg:gap-0 gap-4">
                      <h3 className="body-1 lg:mt-2 lg:mb-4 font-semibold sm:min-h-[60px]">
                        {item.title}
                      </h3>
                      <p className="body-3 font-medium sm:min-h-[100px] line-clamp-4">
                        {item.description}
                      </p>
                    </div>
                    <div className="lg:mt-10">
                      <Button href={item.href} variant="white" withArrow className="w-fit">
                        Read More
                      </Button>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center items-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={1024}
                      height={667}
                      className="w-full aspect-square rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex lg:justify-start justify-center gap-4 mt-10">
          <button
            type="button"
            aria-label="Previous case study"
            disabled={start === 0}
            onClick={() => setStart((s) => Math.max(0, s - 1))}
            className="rounded-full disabled:grayscale disabled:cursor-default disabled:opacity-60 hover:opacity-70 duration-300"
          >
            <CircleArrowIcon className="rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next case study"
            disabled={start >= maxStart}
            onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
            className="rounded-full disabled:grayscale disabled:cursor-default disabled:opacity-60 hover:opacity-70 duration-300"
          >
            <CircleArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
