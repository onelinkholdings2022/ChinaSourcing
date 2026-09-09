import type { StrapiMedia, StrapiSeo } from "./strapi";

export interface PartnerCategory {
  id: number;
  name: string;
  slug: string;
  order: number | null;
  /**
   * Mỗi partner category có URL riêng `/<slug>` — 3 slug tự do rơi vào
   * `app/partner-categories/[slug]`, 4 slug còn lại trùng tên với một product
   * và trang product nhận. `seo` đọc ở route đó; deep populate của Strapi trả
   * kèm nó ngay trong `/api/partners`, nên không cần truy vấn riêng.
   */
  seo?: StrapiSeo | null;
}

export interface Partner {
  id: number;
  name: string;
  logo: StrapiMedia | null;
  url: string | null;
  order: number | null;
  category: PartnerCategory | null;
}
