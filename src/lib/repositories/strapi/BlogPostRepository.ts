import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { StrapiList } from "../../types/strapi";
import type { BlogPost } from "../../types/blog-post";

const PAGE_SIZE = 100; // trần cứng của Strapi — pagination[limit] > 100 vẫn bị cắt về 100.

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

  /**
   * Toàn bộ 129 bài — 1 trang không đủ (Strapi trả tối đa 100/request bất kể
   * `pagination[limit]` xin bao nhiêu), nên gọi thêm các trang còn lại theo
   * `meta.pagination.pageCount` của trang đầu.
   */
  async getAll(): Promise<BlogPost[]> {
    const opts = { revalidate: 3600, tags: ["strapi", "blog-post"] };
    const first = await this.client.get<StrapiList<BlogPost>>(
      `/blog-posts?sort=publishedDate:desc&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=1`,
      opts
    );
    const posts = first?.data ?? [];
    const pageCount = (first?.meta as { pagination?: { pageCount?: number } } | undefined)?.pagination
      ?.pageCount ?? 1;
    if (pageCount <= 1) return posts;

    const rest = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, i) =>
        this.client.get<StrapiList<BlogPost>>(
          `/blog-posts?sort=publishedDate:desc&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=${i + 2}`,
          opts
        )
      )
    );
    return posts.concat(...rest.map((r) => r?.data ?? []));
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const list = await this.fetchList<BlogPost>(`/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: ["strapi", "blog-post", `blog-post:${slug}`],
    });
    return list[0] ?? null;
  }
}
