import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { HomepageData } from "../../types/homepage";

// Trang `/` — một endpoint duy nhất. KHÔNG ghép populate ở đây: controller
// Strapi (`buildDeepPopulate`, strapi-cns/src/utils/deep-populate.ts) đã khai
// sâu toàn bộ populate ở phía server.
export class HomepageRepository extends StrapiBaseRepository<HomepageData> {
  protected getBaseEndpoint() {
    return "/api/homepage";
  }

  getPage(): Promise<HomepageData | null> {
    return this.fetchSingle("/homepage", { revalidate: 3600, tags: ["strapi", "homepage"] });
  }
}
