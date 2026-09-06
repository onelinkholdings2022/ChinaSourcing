import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ResourcesPageData } from "../../types/resources-page";

export class ResourcesPageRepository extends StrapiBaseRepository<ResourcesPageData> {
  protected getBaseEndpoint() {
    return "/api/resources-page";
  }

  getPage(): Promise<ResourcesPageData | null> {
    return this.fetchSingle("/resources-page", { revalidate: 3600, tags: ["strapi", "resources-page"] });
  }
}
