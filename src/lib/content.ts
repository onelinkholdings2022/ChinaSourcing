import pages from "@/data/content/pages.json";
import posts from "@/data/content/posts.json";
import resources from "@/data/content/resources.json";
import caseStudies from "@/data/content/case-studies.json";
import products from "@/data/content/products.json";
import services from "@/data/content/services.json";
import rendered from "@/data/content/rendered.json";

export type Entry = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  link: string;
  featuredImage: string | null;
  featuredAlt: string;
  content: string;
};

export const collections = {
  pages: pages as Entry[],
  posts: posts as Entry[],
  resources: resources as Entry[],
  "case-studies": caseStudies as Entry[],
  products: products as Entry[],
  services: services as Entry[],
};

export type CollectionName = keyof typeof collections;

/** Bodies scraped from the rendered site for the ACF-driven templates. */
export const renderedBodies = rendered as {
  landing: Record<string, string>;
  services: Record<string, string>;
  products: Record<string, string>;
  "case-studies": Record<string, string>;
};

/**
 * WordPress stores titles HTML-encoded (`Freight &#038; Logistics`), and those
 * strings are used as plain text — in `<title>`, in headings — where nothing
 * decodes them, so the raw entity ends up on screen. Numeric and the handful of
 * named entities WP actually emits are enough here.
 */
const ENTITIES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
  "&nbsp;": " ", "&hellip;": "…", "&ndash;": "–", "&mdash;": "—",
};
export function decodeEntities(input: string): string {
  return input.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (whole, dec, hex, named) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return ENTITIES[`&${named};`] ?? whole;
  });
}

export function getEntry(collection: CollectionName, slug: string) {
  return collections[collection].find((e) => e.slug === slug);
}
