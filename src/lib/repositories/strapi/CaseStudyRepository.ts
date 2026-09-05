import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { CaseStudy } from "../../types/case-study";

export class CaseStudyRepository extends StrapiBaseRepository<CaseStudy> {
  protected getBaseEndpoint() {
    return "/api/case-studies";
  }

  /** Danh sách case study nổi bật (`featured: true`) cho section trang chủ. */
  getFeatured(): Promise<CaseStudy[]> {
    return this.fetchList<CaseStudy>(
      "/case-studies?filters[featured][$eq]=true",
      { revalidate: 3600, tags: ["strapi", "case-study"] }
    );
  }

  getAll(): Promise<CaseStudy[]> {
    return this.fetchList<CaseStudy>("/case-studies", { revalidate: 3600, tags: ["strapi", "case-study"] });
  }

  async getBySlug(slug: string): Promise<CaseStudy | null> {
    const list = await this.fetchList<CaseStudy>(`/case-studies?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: ["strapi", "case-study", `case-study:${slug}`],
    });
    return list[0] ?? null;
  }
}
