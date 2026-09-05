"use client";

import { useState } from "react";
import Image from "next/image";
import type { ServiceCardViewData, ServiceTabViewData } from "@/lib/views/homeView";
import { Button, Tag } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * On desktop the card shows only its title; hovering slides a panel up from
 * the bottom revealing the description and CTA. On mobile (<1024px) that
 * panel is always visible, so the card is just a stacked block.
 */
function Card({ card }: { card: ServiceCardViewData }) {
  return (
    <div className="relative w-full sm:h-full h-auto rounded-lg overflow-hidden group bg-grey-50 max-lg:flex max-lg:flex-col">
      <div className="w-full aspect-[342/232] z-[1] overflow-hidden">
        <div className="w-full h-full group-hover:scale-105 duration-300">
          <Image
            src={card.image}
            alt={card.title}
            width={342}
            height={232}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Resting state — desktop only */}
      <div className="bg-grey-50 overflow-visible z-[1]">
        <div className="relative lg:flex hidden group-hover:-translate-y-10 transition-all duration-300 p-4 flex-row justify-between items-center gap-4 bg-grey-50">
          <div className="text-2xl text-dark-blue-900 font-medium duration-300 group-hover:opacity-0">
            {card.title}
          </div>
          <span className="w-12 h-12 shrink-0 group-hover:opacity-0 duration-300 inline-flex items-center justify-center rounded-full border border-dark-blue-900 text-dark-blue-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Hover / mobile panel */}
      <div className="lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:group-hover:h-[90%] lg:h-0 lg:delay-75 lg:duration-300 bg-grey-50 lg:z-[2] flex flex-col max-lg:h-full">
        <div className="p-4 relative flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-2xl !leading-snug text-dark-blue-900 font-medium duration-300 lg:translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 lg:opacity-0 opacity-100 translate-y-0 delay-200 ease-in-out">
              {card.title}
            </div>
            <div className="font-medium text-base !leading-snug text-grey-700 duration-300 lg:translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 lg:opacity-0 opacity-100 translate-y-0 delay-[250ms] ease-in-out">
              {card.description}
            </div>
          </div>
          <div className="group-hover:opacity-100 lg:opacity-0 opacity-100 delay-[250ms] duration-300 lg:translate-y-4 group-hover:translate-y-0 ease-in-out">
            <Button
              href="/contact-us"
              variant="outline"
              withArrow
              className="mt-6 w-full"
            >
              Get A Free Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Services({ serviceTabs }: { serviceTabs: ServiceTabViewData[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="container spacing">
      <Tag className="mx-auto">Our Services</Tag>

      <h2 className="heading-2 font-medium mb-3 lg:mb-8 mt-3 flex flex-wrap gap-x-1 justify-center text-dark-blue-950">
        Our Trusted Services
      </h2>

      <div className="mx-auto">
        {/* Tab switcher */}
        <div className="flex flex-wrap justify-center bg-dark-blue-900 rounded-lg p-[6px] my-6 w-fit mx-auto">
          {serviceTabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "px-8 py-3 rounded-lg transition-colors duration-300 body-2 font-semibold cursor-pointer",
                active === i ? "bg-white text-dark-blue-900" : "text-white",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative lg:mt-16 mt-10">
          {serviceTabs.map((tab, i) => (
            <div
              key={tab.label}
              hidden={active !== i}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6",
                active === i && "animate-in fade-in slide-in-from-right-4 duration-350",
              )}
            >
              {tab.cards.map((card) => (
                <Card key={card.title} card={card} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
