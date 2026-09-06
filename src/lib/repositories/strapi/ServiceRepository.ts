import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ServiceData } from "../../types/services-page";

export class ServiceRepository extends StrapiBaseRepository<ServiceData> {
  protected getBaseEndpoint() {
    return "/api/services";
  }

  getAll(): Promise<ServiceData[]> {
    return this.fetchList<ServiceData>("/services?sort=order:asc&pagination[pageSize]=100", {
      revalidate: 3600,
      tags: ["strapi", "service"],
    });
  }

  async getBySlug(slug: string): Promise<ServiceData | null> {
    const list = await this.fetchList<ServiceData>(`/services?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: ["strapi", "service", `service:${slug}`],
    });
    return list[0] ?? null;
  }
}
