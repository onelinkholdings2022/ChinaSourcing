import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { StrapiList } from "../../types/strapi";
import type { BlogPost } from "../../types/blog-post";

const PAGE_SIZE = 100; // trần cứng của Strapi — pagination[limit] > 100 vẫn bị cắt về 100.

/**
 * Projection cho query DANH SÁCH — chỉ những field thẻ bài thật sự in ra.
 *
 * Không có nó, `/api/blog-posts` trả 18 MB: mỗi bài kèm nguyên văn `content`,
 * và `categories` được populate ngược thành `category.blogPosts` nên còn kéo
 * theo content của mọi bài cùng category. Next có trần 2 MB cho một entry cache
 * ("items over 2MB can not be cached"), nên response đó KHÔNG BAO GIỜ vào cache
 * — mỗi lần F5 lại tải lại 18 MB và thường timeout.
 *
 * `readingTime` được tính sẵn khi seed (`strapi-cns/scripts/fix-blogpost-reading-time.js`)
 * chính là để danh sách không cần `content`.
 *
 * Khai `populate` tường minh cũng là cách TẮT deep populate mặc định của server
 * — controller chỉ tự gắn khi query chưa có `populate` (xem
 * `strapi-cns/src/utils/deep-populate.ts`).
 */
const LIST_QUERY = [
  "fields[0]=title",
  "fields[1]=slug",
  "fields[2]=excerpt",
  "fields[3]=publishedDate",
  "fields[4]=readingTime",
  "fields[5]=gated",
  "populate[featureImage][fields][0]=url",
  "populate[featureImage][fields][1]=alternativeText",
  "populate[featureImage][fields][2]=width",
  "populate[featureImage][fields][3]=height",
  "populate[featureImage][fields][4]=formats",
  "populate[categories][fields][0]=name",
  "populate[categories][fields][1]=slug",
].join("&");

export class BlogPostRepository extends StrapiBaseRepository<BlogPost> {
  protected getBaseEndpoint() {
    return "/api/blog-posts";
  }

  /** 3 bài mới nhất — dùng cho section "Latest Sourcing Insights" trang chủ. */
  getLatest(limit = 3): Promise<BlogPost[]> {
    return this.fetchList<BlogPost>(
      `/blog-posts?${LIST_QUERY}&sort=publishedDate:desc&pagination[limit]=${limit}`,
      { revalidate: 3600, tags: ["strapi", "blog-post"] }
    );
  }

  /**
   * Toàn bộ 131 bài — 1 trang không đủ (Strapi trả tối đa 100/request bất kể
   * `pagination[limit]` xin bao nhiêu), nên gọi thêm các trang còn lại theo
   * `meta.pagination.pageCount` của trang đầu.
   */
  async getAll(): Promise<BlogPost[]> {
    const opts = { revalidate: 3600, tags: ["strapi", "blog-post"] };
    const page = (n: number) =>
      `/blog-posts?${LIST_QUERY}&sort=publishedDate:desc&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=${n}`;

    const first = await this.client.get<StrapiList<BlogPost>>(page(1), opts);
    const posts = first?.data ?? [];
    const pageCount = (first?.meta as { pagination?: { pageCount?: number } } | undefined)?.pagination
      ?.pageCount ?? 1;
    if (pageCount <= 1) return posts;

    const rest = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, i) =>
        this.client.get<StrapiList<BlogPost>>(page(i + 2), opts)
      )
    );
    return posts.concat(...rest.map((r) => r?.data ?? []));
  }

  /** Trang bài viết — ở đây MỚI cần `content`, nên để deep populate mặc định. */
  async getBySlug(slug: string): Promise<BlogPost | null> {
    const list = await this.fetchList<BlogPost>(`/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: ["strapi", "blog-post", `blog-post:${slug}`],
    });
    return list[0] ?? null;
  }
}
