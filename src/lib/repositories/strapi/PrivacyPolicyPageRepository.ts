import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { PrivacyPolicyPageData } from "../../types/privacy-policy-page";

export class PrivacyPolicyPageRepository extends StrapiBaseRepository<PrivacyPolicyPageData> {
  protected getBaseEndpoint() {
    return "/api/privacy-policy-page";
  }

  getPage(): Promise<PrivacyPolicyPageData | null> {
    return this.fetchSingle("/privacy-policy-page", {
      revalidate: 3600,
      tags: ["strapi", "privacy-policy-page"],
    });
  }
}
