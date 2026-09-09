import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { Resource } from "../../types/resource";

export class ResourceRepository extends StrapiBaseRepository<Resource> {
  protected getBaseEndpoint() {
    return "/api/resources";
  }

  /**
   * 12 download hiện có — trong ngưỡng 100/trang của Strapi, không cần phân trang.
   * Sắp xếp theo `publishedDate` giảm dần, đúng thứ tự listing của site gốc
   * (mặc định của Strapi là theo id nên bài mới nhất không nằm đầu).
   */
  getAll(): Promise<Resource[]> {
    return this.fetchList<Resource>("/resources?sort=publishedDate:desc&pagination[pageSize]=100", {
      revalidate: 3600,
      tags: ["strapi", "resource"],
    });
  }

  async getBySlug(slug: string): Promise<Resource | null> {
    const list = await this.fetchList<Resource>(`/resources?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: ["strapi", "resource", `resource:${slug}`],
    });
    return list[0] ?? null;
  }
}
