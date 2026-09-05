import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { AboutPagePartial } from "../../types/about-page";

// Repo đầy đủ cho `/about-us` sẽ mở rộng khi build trang đó. Hiện chỉ cần
// `logoMarquee` — dùng chung cho section LogoMarquee ở trang chủ (site gốc
// dùng lại đúng 7 logo này ở cả 2 trang, homepage không có field riêng).
export class AboutPageRepository extends StrapiBaseRepository<AboutPagePartial> {
  protected getBaseEndpoint() {
    return "/api/about-us-page";
  }

  getClientLogos(): Promise<AboutPagePartial | null> {
    return this.fetchSingle("/about-us-page", { revalidate: 3600, tags: ["strapi", "about-us-page"] });
  }
}
