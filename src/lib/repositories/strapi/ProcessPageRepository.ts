import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ProcessPageData } from "../../types/process-page";

export class ProcessPageRepository extends StrapiBaseRepository<ProcessPageData> {
  protected getBaseEndpoint() {
    return "/api/process-page";
  }

  getPage(): Promise<ProcessPageData | null> {
    return this.fetchSingle("/process-page", { revalidate: 3600, tags: ["strapi", "process-page"] });
  }
}
