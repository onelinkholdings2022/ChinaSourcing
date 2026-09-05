import type { StrapiMedia } from "./strapi";

// Chỉ khai phần đang cần dùng (logoMarquee, cho section LogoMarquee dùng
// chung ở trang chủ) — mở rộng đầy đủ khi build trang /about-us.
export interface AboutPageLogoItem {
  id: number;
  name: string | null;
  logo: StrapiMedia | null;
}

export interface AboutPagePartial {
  logoMarquee: { logos: AboutPageLogoItem[] };
}
