"use client";

import { useMemo, useState } from "react";
import { Tag } from "@/components/ui/button";
import { TabRail } from "@/components/sections/resources/TabRail";
import { ListingPager } from "@/components/sections/resources/ListingPager";
import { BlogCard } from "@/components/sections/resources/BlogCard";
import type { BlogCard as BlogCardData, ListingTab } from "@/data/resources";

/**
 * `.blog-listing` — the grey band holding the whole archive.
 *
 * The original renders all 129 cards into the HTML and pages through them with
 * `display`, six at a time; the same set is in the bundle here and gets sliced.
 * Cards with an empty `data-types` belong to no category and only ever show
 * under "All", which falls out of `includes()` on an empty list.
 */
export function BlogListing({
  tag,
  heading,
  intro,
  tabs,
  cards,
  perPage,
}: {
  tag: string;
  heading: string;
  intro: string;
  tabs: ListingTab[];
  cards: BlogCardData[];
  perPage: number;
}) {
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  const matches = useMemo(
    () =>
      type === "all"
        ? cards
        : cards.filter((c) => (c.types ?? []).includes(type)),
    [cards, type],
  );

  const totalPages = Math.max(1, Math.ceil(matches.length / perPage));
  const current = Math.min(page, totalPages);
  const visible = matches.slice((current - 1) * perPage, current * perPage);

  return (
    <section className="blog-listing spacing bg-grey-50">
      <div className="container">
        <div className="mx-auto md:w-5/6 max-w-[900px]">
          <Tag className="mx-auto">{tag}</Tag>
          <h2 className="heading-2 font-semibold text-cyan-400 text-center mt-3">
            {heading}
          </h2>
          <p className="text-grey-600 body-2 font-medium mt-3 text-center max-w-[800px] mx-auto">
            {intro}
          </p>
        </div>

        <TabRail
          tabs={tabs}
          active={type}
          buttonClass="blog-tab-btn"
          onSelect={(value) => {
            setType(value);
            setPage(1);
          }}
        />

        <div className="mt-10 flex flex-wrap gap-6 md:gap-10 justify-center">
          {visible.map((card) => (
            <BlogCard key={card.href} card={card} />
          ))}
        </div>

        <ListingPager
          page={current}
          totalPages={totalPages}
          onChange={setPage}
          variant="blog"
        />
      </div>
    </section>
  );
}
