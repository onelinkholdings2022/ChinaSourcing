import type { StrapiMedia, StrapiSeo } from "./strapi";
import type { Category } from "./category";

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  /**
   * Chỉ có ở query CHI TIẾT (`getBySlug`). Query danh sách bỏ hẳn field này —
   * 131 bài × nguyên văn bài viết là 18 MB, vượt trần cache 2 MB của Next nên
   * mỗi lần F5 lại tải lại từ đầu. Thẻ bài dùng `excerpt` + `readingTime`.
   */
  content: string | null;
  /** "N min read", tính sẵn khi seed để danh sách không cần `content`. */
  readingTime: string | null;
  publishedDate: string | null;
  featureImage: StrapiMedia | null;
  categories: Category[];
  gated: boolean;
  seo: StrapiSeo | null;
}
