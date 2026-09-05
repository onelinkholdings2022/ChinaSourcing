import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ContactPageData } from "../../types/contact-page";

export class ContactPageRepository extends StrapiBaseRepository<ContactPageData> {
  protected getBaseEndpoint() {
    return "/api/contact-page";
  }

  getPage(): Promise<ContactPageData | null> {
    return this.fetchSingle("/contact-page", { revalidate: 3600, tags: ["strapi", "contact-page"] });
  }
}
