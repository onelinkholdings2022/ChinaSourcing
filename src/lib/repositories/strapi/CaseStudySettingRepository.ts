import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { CaseStudySettingData } from "../../types/case-studies-page";

export class CaseStudySettingRepository extends StrapiBaseRepository<CaseStudySettingData> {
  protected getBaseEndpoint() {
    return "/api/case-study-setting";
  }

  getSettings(): Promise<CaseStudySettingData | null> {
    return this.fetchSingle("/case-study-setting", { revalidate: 3600, tags: ["strapi", "case-study-setting"] });
  }
}
