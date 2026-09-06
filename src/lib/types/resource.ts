import type { StrapiMedia, StrapiSeo } from "./strapi";
import type { Category } from "./category";

export interface Resource {
  id: number;
  title: string;
  slug: string;
  featureImage: StrapiMedia | null;
  cover: StrapiMedia | null;
  categories: Category[];
  readingTime: string | null;
  content: string | null;
  resourceType: "Checklist" | "eBook" | "Template" | "Other";
  gated: boolean;
  gateAfterBlocks: number;
  file: StrapiMedia | null;
  seo: StrapiSeo | null;
}
