import productPagesJson from "@/data/content/product-pages.json";

/**
 * The six ACF sections behind every `/product/<slug>/` page.
 *
 * All 15 pages render the identical section sequence — verified by comparing
 * the class signature of each page's top-level `<section>` list, which came back
 * as one group of 15:
 *
 *   relative | image-card | two-column-testimonial | usp-list | faq | dark-cta
 *
 * So there is one template component and 15 data entries, rather than 15 page
 * components. Content was pulled out of the rendered HTML: the WordPress REST
 * API exposes `product` but returns `acf: []` and a 76-character
 * `content.rendered`, so the layout is not reachable that way.
 */

export type ProductImageCard = {
  image: string | null;
  alt: string;
  title: string;
};

export type ProductTestimonial = {
  image: string | null;
  alt: string;
  quote: string;
  avatar: string | null;
  name: string;
  role: string;
};

export type ProductUsp = {
  title: string;
  body: string;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductPage = {
  hero: {
    heading: string;
    intro: string;
    ctaLabel: string | null;
    ctaHref: string | null;
    image: string | null;
    imageAlt: string;
  };
  imageCard: {
    tag: string;
    heading: string;
    intro: string;
    cards: ProductImageCard[];
  };
  testimonial: {
    tag: string;
    heading: string;
    ctaLabel: string | null;
    ctaHref: string | null;
    items: ProductTestimonial[];
  };
  usp: {
    tag: string;
    heading: string;
    icon: string | null;
    image: string | null;
    items: ProductUsp[];
  };
  faq: {
    tag: string;
    headingLines: string[];
    email: string | null;
    items: ProductFaq[];
  };
  cta: {
    sectionClass: string;
    tag: string;
    heading: string;
    body: string;
    ctaLabel: string;
  };
};

export const productPages = productPagesJson as Record<string, ProductPage>;

export function getProductPage(slug: string): ProductPage | undefined {
  return productPages[slug];
}

export const productSlugs = Object.keys(productPages);
