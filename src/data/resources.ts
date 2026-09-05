import index from "@/data/content/resources-index.json";
import articles from "@/data/content/article-pages.json";

/** A category pill on either listing rail. */
export type ListingTab = { value: string; label: string };

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

/** A post card, used by the blog listing and the related-articles row. */
export type BlogCard = {
  types?: string[];
  category: string | null;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  image: string | null;
  alt: string;
  href: string;
};

export type ResourcesIndex = {
  hero: { heading: string; intro: string; image: string; imageAlt: string };
  resources: {
    tag: string;
    heading: string;
    perPage: number;
    tabs: ListingTab[];
    cards: ResourceCard[];
  };
  blogs: {
    tag: string;
    heading: string;
    intro: string;
    perPage: number;
    tabs: ListingTab[];
    cards: BlogCard[];
  };
  splitScreen: {
    tag: string;
    heading: string;
    body: string;
    ctaLabel: string;
    image: string;
    alt: string;
  };
  faq: {
    tag: string;
    headingParts: string[];
    intro: string;
    email: string;
    items: { question: string; answer: string }[];
  };
};

/** One row of the hero's pale blue fact box. */
export type ArticleFact = { label: string; icon: string | null; value: string };

export type ArticlePageData = {
  /** The original permalink — `/some-post/` or `/resource/some-file/`. */
  path: string;
  title: string;
  subtitle: string;
  facts: ArticleFact[];
  featuredImage: string | null;
  featuredAlt: string;
  toc: { href: string; label: string }[];
  html: string;
  subscribe: { tag: string; heading: string; body: string };
  related: {
    tag: string;
    heading: string;
    cards: BlogCard[];
    ctaLabel: string;
    ctaHref: string;
  };
  cta: {
    tag: string;
    heading: string;
    body: string;
    ctaLabel: string;
    sectionClass: string;
  };
};

export const resourcesIndex = index as ResourcesIndex;

const articlePages = articles as Record<string, ArticlePageData>;

export function getArticle(slug: string): ArticlePageData | undefined {
  return articlePages[slug];
}

/**
 * Slugs split by where they live: the 12 downloads are under `/resource/`,
 * the 129 posts sit at the site root. `path` is the only reliable signal —
 * both post types render the identical template.
 */
export function articleSlugs(kind: "resource" | "post") {
  return Object.entries(articlePages)
    .filter(([, a]) => a.path.startsWith("/resource/") === (kind === "resource"))
    .map(([slug]) => ({ slug }));
}
