import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { CaseStudiesPageData } from "../../types/case-studies-page";

export class CaseStudiesPageRepository extends StrapiBaseRepository<CaseStudiesPageData> {
  protected getBaseEndpoint() {
    return "/api/case-studies-page";
  }

  getPage(): Promise<CaseStudiesPageData | null> {
    return this.fetchSingle("/case-studies-page", { revalidate: 3600, tags: ["strapi", "case-studies-page"] });
  }
}
