import index from "@/data/content/case-studies-index.json";
import pages from "@/data/content/case-study-pages.json";
import type { SimpleCard } from "@/components/sections/SimpleCardGrid";
import type { UspListItem } from "@/components/sections/UspList";
import type { QuoteTestimonial } from "@/components/sections/CarouselTestimonial";
import type { CaseCard } from "@/components/sections/CaseStudySlider";

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

export type CaseStudiesIndex = {
  hero: { heading: string; intro: string; image: string; imageAlt: string };
  list: {
    tag: string;
    heading: string;
    /** The theme's `posts_per_page`; the pagination is derived from it. */
    perPage: number;
    filters: {
      industry: FilterOption[];
      region: FilterOption[];
      service: FilterOption[];
    };
  };
  usp: {
    tag: string;
    heading: string;
    intro: string;
    icon: string;
    image: string;
    items: UspListItem[];
  };
  testimonials: { tag: string; heading: string; items: QuoteTestimonial[] };
  cta: {
    tag: string;
    heading: string;
    body: string;
    ctaLabel: string;
    sectionClass: string;
  };
  cards: CaseStudyCard[];
};

/** A `Region` / `Industry` / `Service` column of the detail-page hero box. */
export type CaseStudyFact = {
  label: string;
  value: string;
  /** Only `Region` carries one. */
  flag: string | null;
  flagAlt: string | null;
};

/** One tag + heading + rich-text block of the article body. */
export type CaseStudyBlock = { tag: string; heading: string; html: string };

export type CaseStudyPage = {
  slug: string;
  title: string;
  description: string;
  hero: { heading: string; intro: string; meta: CaseStudyFact[] };
  simple: {
    tag: string;
    heading: string;
    intro: string;
    cards: SimpleCard[];
  };
  blocks: CaseStudyBlock[];
  slider: {
    tag: string;
    heading: string;
    ctaLabel: string;
    ctaHref: string;
    cards: CaseCard[];
  };
  cta: {
    tag: string;
    heading: string;
    body: string;
    ctaLabel: string;
    /** Per-page ACF — every case study currently ships `dark-cta px-5`. */
    sectionClass: string;
  };
};

export const caseStudiesIndex = index as CaseStudiesIndex;

const caseStudyPages = pages as Record<string, CaseStudyPage>;

export function getCaseStudyPage(slug: string): CaseStudyPage | undefined {
  return caseStudyPages[slug];
}

export function caseStudySlugs() {
  return Object.keys(caseStudyPages).map((slug) => ({ slug }));
}
