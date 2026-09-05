import indexJson from "@/data/content/products-index.json";
import type { ProductListCard } from "@/components/sections/product/ProductListGrid";

/**
 * The `/products` index page.
 *
 * Seven sections: hero, the 15-card category grid, the case-study slider, the
 * certification marquee, the partner logo tabs, FAQ, and the closing CTA. Only
 * the first two and the FAQ copy are unique to this page — the rest reuse the
 * shared components with different headings.
 */
export type ProductsIndex = {
  hero: {
    /** The literal word before the animated span — "Source". */
    typedPrefix: string;
    /** 15 category names cycled by TypeIt; empty on the category pages. */
    typedWords: string[];
    heading: string;
    intro: string;
    ctaLabel: string | null;
    ctaHref: string | null;
    image: string | null;
    imageAlt: string;
  };
  list: {
    tag: string;
    heading: string;
    intro: string;
    cards: ProductListCard[];
  };
  faq: {
    tag: string;
    headingLines: string[];
    email: string | null;
    items: { question: string; answer: string }[];
  };
  cta: {
    tag: string;
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  logos: {
    tag: string;
    heading: string;
    intro: string;
    items: string[];
  };
};

export const productsIndex = indexJson as ProductsIndex;
