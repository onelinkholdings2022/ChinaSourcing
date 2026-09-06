import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ServiceSettingData } from "../../types/services-page";

export class ServiceSettingRepository extends StrapiBaseRepository<ServiceSettingData> {
  protected getBaseEndpoint() {
    return "/api/service-setting";
  }

  getSettings(): Promise<ServiceSettingData | null> {
    return this.fetchSingle("/service-setting", { revalidate: 3600, tags: ["strapi", "service-setting"] });
  }
}
