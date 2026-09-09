"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { Button, Tag } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  useListingStore,
  useListingPage,
  useCaseStudyDraft,
  useCaseStudyApplied,
} from "@/lib/stores/listingStore";

/** One row of the `/case-studies` grid. */
export type CaseStudyCard = {
  id: number;
  slug: string;
  title: string;
  /** The service the study is filed under — printed above the title. */
  category: string;
  industry: string;
  region: string;
  description: string;
  image: string | null;
  alt: string;
};

/** A `<select>` option pair, in the order the theme prints them. */
export type FilterOption = { value: string; label: string };

/** Khoá của listing này trong `useListingStore` — trang chỉ có một lưới. */
const LISTING_ID = "case-studies";

/**
 * `.casestudy-list` — the filter row, the card grid and the pager.
 *
 * ## Why this is client-side
 *
 * The original renders six cards server-side and then, on `DOMContentLoaded`,
 * immediately throws them away: its inline script calls
 * `fetchCaseStudies({}, 1, false)`, which POSTs `filter_case_studies` to
 * `admin-ajax.php` and re-renders the grid from the JSON. So what a visitor
 * actually sees is never the server markup — it is the script's own card
 * template, which uses different classes from the PHP one (`md:p-8`,
 * `flex-col lg:flex-row`, `hover:shadow-lg`, no `flex-col-reverse`). This
 * component reproduces the JS template, because that is what renders.
 *
 * The three filters and the pager are the same trip in the original. Here the
 * whole collection is in the bundle already — 14 records — so the filtering is
 * a local `Array.filter` with no request, and the pager slices the result.
 *
 * Matching is by label, not by slug: `filter_case_studies` returns the term
 * *names* (`"Hospitality Items"`), the `<option>` values are the term *slugs*,
 * and WordPress resolves one to the other server-side. Mapping the option's
 * label instead keeps that resolution in one place.
 */
export function CaseStudyList({
  tag,
  heading,
  cards,
  perPage,
  filters: options,
}: {
  tag: string;
  heading: string;
  cards: CaseStudyCard[];
  perPage: number;
  filters: {
    industry: FilterOption[];
    region: FilterOption[];
    service: FilterOption[];
  };
}) {
  // `draft` is what the selects hold; `applied` is what the grid is filtered
  // by. The original only reads the selects when Search is pressed, so
  // changing a select must not move the grid.
  //
  // Cả hai (và số trang) sống trong `useListingStore` chứ không phải `useState`:
  // lọc xong, mở một case study rồi bấm Back thì lưới phải còn nguyên bộ lọc —
  // với `useState` thì component dựng lại và bộ lọc mất sạch.
  const draft = useCaseStudyDraft(LISTING_ID);
  const applied = useCaseStudyApplied(LISTING_ID);
  const page = useListingPage(LISTING_ID);
  const setDraft = useListingStore((s) => s.setDraft);
  const applyDraft = useListingStore((s) => s.applyDraft);
  const resetFilters = useListingStore((s) => s.resetFilters);
  const setPage = useListingStore((s) => s.setPage);
  const filterRowRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const label = (list: FilterOption[], value: string) =>
      list.find((o) => o.value === value)?.label ?? "";
    const industry = label(options.industry, applied.industry);
    const region = label(options.region, applied.region);
    const service = label(options.service, applied.service);
    return cards.filter(
      (c) =>
        (!industry || c.industry === industry) &&
        (!region || c.region === region) &&
        (!service || c.category === service),
    );
  }, [cards, applied, options]);

  const totalPages = Math.max(1, Math.ceil(matches.length / perPage));
  const current = Math.min(page, totalPages);
  const visible = matches.slice((current - 1) * perPage, current * perPage);

  /** The original scrolls the filter row to the top on Search and on a page change. */
  const scrollToFilters = () =>
    filterRowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const search = () => {
    applyDraft(LISTING_ID);
    scrollToFilters();
  };

  const reset = () => {
    resetFilters(LISTING_ID);
    scrollToFilters();
  };

  return (
    <section className="casestudy-list py-16 lg:py-24">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <div className="w-fit mx-auto mb-3">
            <Tag className="mx-auto">{tag}</Tag>
          </div>
          <h2 className="heading-2 font-semibold text-cyan-400 mb-6 lg:mb-10">
            {heading}
          </h2>
        </div>

        <div
          ref={filterRowRef}
          className="mb-10 flex flex-col lg:flex-row gap-6 items-end"
        >
          <div className="grid grid-cols-1 w-full lg:w-auto md:grid-cols-3 gap-6 flex-grow lg:max-w-[70%]">
            <Select
              id="industry-filter"
              label="Industry"
              options={options.industry}
              value={draft.industry}
              onChange={(industry) => setDraft(LISTING_ID, { ...draft, industry })}
            />
            <Select
              id="region-filter"
              label="Region"
              options={options.region}
              value={draft.region}
              onChange={(region) => setDraft(LISTING_ID, { ...draft, region })}
            />
            <Select
              id="service-filter"
              label="Service"
              options={options.service}
              value={draft.service}
              onChange={(service) => setDraft(LISTING_ID, { ...draft, service })}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={search}
              className="px-6 py-3 h-[48px] bg-dark-blue-900 hover:bg-dark-blue-800 text-white font-medium rounded-md transition-colors duration-300 w-fit 2xl:w-[200px] cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-4 py-3 h-[48px] text-dark-blue-900 font-semibold hover:text-dark-blue-800 transition-colors duration-300 underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visible.length === 0 ? (
            <div className="col-span-2 py-12 text-center">
              <p className="text-gray-600">
                No case studies found matching your criteria.
              </p>
            </div>
          ) : (
            // No fade-up here. The PHP cards carry `data-aos`, but the script
            // discards them before AOS ever runs and its own template has no
            // `data-aos` at all — so on the original these simply appear.
            visible.map((card) => <Card key={card.id} card={card} />)
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 lg:mt-10 flex gap-3 justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  if (n === current) return;
                  setPage(LISTING_ID, n);
                  scrollToFilters();
                }}
                className={cn(
                  "px-5 py-3 border rounded-lg text-base",
                  n === current
                    ? "bg-dark-blue-900 text-white cursor-default"
                    : "text-grey-300 cursor-pointer",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Select({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="body-2 font-semibold text-dark-blue-900">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "body-3 leading-tight w-full px-4 py-3 bg-white border border-grey-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary h-[48px] cursor-pointer",
            // The placeholder option is grey; picking a real one goes dark.
            value ? "text-dark-blue-900" : "text-grey-300",
          )}
        >
          <option value="">Please select</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

/**
 * The card the theme's script builds — not the one its PHP template prints.
 * The two differ; this is the one that ends up on screen.
 */
function Card({ card }: { card: CaseStudyCard }) {
  return (
    <div className="case-study-card cursor-default p-6 md:p-8 xl:p-10 bg-cyan-50 rounded-lg overflow-hidden flex flex-col lg:flex-row gap-4 lg:gap-6 hover:shadow-lg hover:bg-dark-blue-950 hover:text-white group transition-all duration-300 h-full">
      <div className="lg:flex-1">
        <div>
          <div className="text-dark-blue-950 font-lora body-3 font-semibold mb-2 group-hover:text-white transition duration-300">
            {card.category || "Case Study"}
          </div>
          <h3 className="body-1 font-semibold text-dark-blue-950 mb-4 group-hover:text-white transition-colors duration-300">
            {card.title}
          </h3>
          <p className="text-dark-blue-950 body-3 mb-6 group-hover:text-white transition-colors duration-300">
            {card.description}
          </p>
        </div>
        <Button
          href={`/${card.slug}`}
          variant="white"
          withArrow
          className="w-fit"
        >
          Read More
        </Button>
      </div>
      {card.image && (
        <div className="w-full lg:flex-1 h-auto rounded-xl overflow-hidden">
          <Image
            src={card.image}
            alt={card.alt}
            width={1024}
            height={667}
            className="rounded-xl w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
