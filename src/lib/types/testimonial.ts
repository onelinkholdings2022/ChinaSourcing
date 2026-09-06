import type { StrapiMedia } from "./strapi";

export interface Testimonial {
  id: number;
  quote: string | null;
  authorName: string;
  authorRole: string | null;
  image: StrapiMedia | null;
  authorAvatar: StrapiMedia | null;
  product: { id: number } | null;
  order: number | null;
}
