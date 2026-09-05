import type { StrapiMedia } from "./strapi";

export interface TeamMember {
  id: number;
  name: string;
  jobTitle: string | null;
  bio: string | null;
  photo: StrapiMedia | null;
  location: "China" | "Hong Kong" | "Vietnam" | "Australia" | null;
  order: number | null;
  featuredOnAboutUs: boolean;
}
