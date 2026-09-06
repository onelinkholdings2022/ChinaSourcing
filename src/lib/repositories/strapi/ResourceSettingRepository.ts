import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ResourceSettingData } from "../../types/resources-page";

export class ResourceSettingRepository extends StrapiBaseRepository<ResourceSettingData> {
  protected getBaseEndpoint() {
    return "/api/resource-setting";
  }

  getSettings(): Promise<ResourceSettingData | null> {
    return this.fetchSingle("/resource-setting", { revalidate: 3600, tags: ["strapi", "resource-setting"] });
  }
}
