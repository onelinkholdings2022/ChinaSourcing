import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ServicesPageData } from "../../types/services-page";

export class ServicesPageRepository extends StrapiBaseRepository<ServicesPageData> {
  protected getBaseEndpoint() {
    return "/api/services-page";
  }

  getPage(): Promise<ServicesPageData | null> {
    return this.fetchSingle("/services-page", { revalidate: 3600, tags: ["strapi", "services-page"] });
  }
}
