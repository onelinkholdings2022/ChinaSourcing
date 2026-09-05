import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { AboutPageData } from "../../types/about-page";

// Trang `/about-us` — một endpoint duy nhất, populate sâu ở phía server
// (`buildDeepPopulate`, strapi-cns/src/utils/deep-populate.ts). `getClientLogos`
// và `getPage` đọc cùng một response — Next fetch cache dedupe theo URL nên
// không tốn thêm request.
export class AboutPageRepository extends StrapiBaseRepository<AboutPageData> {
  protected getBaseEndpoint() {
    return "/api/about-us-page";
  }

  getPage(): Promise<AboutPageData | null> {
    return this.fetchSingle("/about-us-page", { revalidate: 3600, tags: ["strapi", "about-us-page"] });
  }

  getClientLogos(): Promise<AboutPageData | null> {
    return this.getPage();
  }
}
