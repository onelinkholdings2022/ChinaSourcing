import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { Partner } from "../../types/partner";

export class PartnerRepository extends StrapiBaseRepository<Partner> {
  protected getBaseEndpoint() {
    return "/api/partners";
  }

  /** Toàn bộ 42 partner (7 category x 6 logo) — nhóm theo category ở tầng view. */
  getAll(): Promise<Partner[]> {
    return this.fetchList<Partner>("/partners?pagination[limit]=200", {
      revalidate: 3600,
      tags: ["strapi", "partner"],
    });
  }
}
