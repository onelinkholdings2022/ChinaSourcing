import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { GlobalData } from "../../types/global";

// Navbar + Footer + SEO mặc định — dùng chung cho layout gốc của mọi trang.
export class GlobalRepository extends StrapiBaseRepository<GlobalData> {
  protected getBaseEndpoint() {
    return "/api/global";
  }

  getGlobal(): Promise<GlobalData | null> {
    return this.fetchSingle("/global", { revalidate: 3600, tags: ["strapi", "global"] });
  }
}
