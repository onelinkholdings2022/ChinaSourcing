"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/button";
import { TabRail, type ListingTab } from "@/components/sections/resources/TabRail";
import { ListingPager } from "@/components/sections/resources/ListingPager";

/** A download card in the dark `.resource-listing` band. */
export type ResourceCard = {
  /** `data-types` on the original, comma-separated; the rail filters on it. */
  types: string[];
  category: string | null;
  title: string;
  excerpt: string;
  /** Already formatted `dd/mm/yyyy` by the theme. */
  date: string;
  href: string;
};

/**
 * `.resource-listing` — the indigo band of download cards.
 *
 * The original ships all 12 cards server-side and its script only toggles
 * `display`: filtering by the tab's `data-type` against each card's
 * comma-separated `data-types`, three per page. Same rules here, done by
 * slicing the array instead of hiding nodes.
 *
 * Changing tab resets to page 1 (`selectType` sets `paged = 1`), and — unlike
 * the case-study filter — nothing scrolls.
 */
export function ResourceListing({
  tag,
  heading,
  tabs,
  cards,
  perPage,
}: {
  tag: string;
  heading: string;
  tabs: ListingTab[];
  cards: ResourceCard[];
  perPage: number;
}) {
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  const matches = useMemo(
    () => (type === "all" ? cards : cards.filter((c) => c.types.includes(type))),
    [cards, type],
  );

  const totalPages = Math.max(1, Math.ceil(matches.length / perPage));
  const current = Math.min(page, totalPages);
  const visible = matches.slice((current - 1) * perPage, current * perPage);

  return (
    <section className="resource-listing spacing bg-dark-blue-950 text-white">
      <div className="container">
        <div className="mx-auto md:w-5/6 max-w-[850px]">
          <Tag className="mx-auto">{tag}</Tag>
          <h2 className="heading-2 font-semibold text-white text-center mt-3">
            {heading}
          </h2>
        </div>

        <TabRail
          tabs={tabs}
          active={type}
          buttonClass="resource-tab-btn"
          onSelect={(value) => {
            setType(value);
            setPage(1);
          }}
        />

        <div className="mt-16 flex md:flex-row flex-col flex-wrap w-full justify-center gap-10">
          {visible.map((card) => (
            <div
              key={card.href}
              className="resource-card flex-row w-auto md:w-[calc(50%-27px)] lg:w-[calc(33.33%-27px)] gap-0"
            >
              <Link
                href={card.href}
                className="flex flex-col w-full hover:bg-cyan-50 cursor-pointer bg-white p-5 text-black rounded-lg"
              >
                {card.category && (
                  <div className="body-3 text-dark-blue-950 font-lora font-semibold mb-2">
                    {card.category}
                  </div>
                )}
                <h3 className="font-semibold body-1 mb-4">{card.title}</h3>
                <div className="body-3 text-grey-600 font-medium">
                  {card.excerpt}
                </div>
                {/* The 75px gap is a hard-coded `mt-[75px]`, not a flex spacer —
                    so short cards keep the same footer offset as tall ones. */}
                <div className="flex gap-2 mt-[75px] items-center">
                  <Image
                    src="/images/calendar-grey.svg"
                    alt=""
                    aria-hidden
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <div className="body-3 text-grey-600 font-medium">
                    {card.date}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <ListingPager
          page={current}
          totalPages={totalPages}
          onChange={setPage}
          variant="resource"
        />
      </div>
    </section>
  );
}
