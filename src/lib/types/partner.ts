import type { StrapiMedia } from "./strapi";

export interface PartnerCategory {
  id: number;
  name: string;
  slug: string;
  order: number | null;
}

export interface Partner {
  id: number;
  name: string;
  logo: StrapiMedia | null;
  url: string | null;
  order: number | null;
  category: PartnerCategory | null;
}
