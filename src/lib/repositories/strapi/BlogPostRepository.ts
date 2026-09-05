import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { BlogPost } from "../../types/blog-post";

export class BlogPostRepository extends StrapiBaseRepository<BlogPost> {
  protected getBaseEndpoint() {
    return "/api/blog-posts";
  }

  /** 3 bài mới nhất — dùng cho section "Latest Sourcing Insights" trang chủ. */
  getLatest(limit = 3): Promise<BlogPost[]> {
    return this.fetchList<BlogPost>(
      `/blog-posts?sort=publishedDate:desc&pagination[limit]=${limit}`,
      { revalidate: 3600, tags: ["strapi", "blog-post"] }
    );
  }

  getAll(): Promise<BlogPost[]> {
    return this.fetchList<BlogPost>("/blog-posts?sort=publishedDate:desc&pagination[limit]=200", {
      revalidate: 3600,
      tags: ["strapi", "blog-post"],
    });
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const list = await this.fetchList<BlogPost>(`/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: ["strapi", "blog-post", `blog-post:${slug}`],
    });
    return list[0] ?? null;
  }
}
