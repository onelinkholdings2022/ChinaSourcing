import type { StrapiMedia, StrapiSeo } from "./strapi";
import type { Category } from "./category";
import type { ResourceType } from "./resource-type";

export interface Resource {
  id: number;
  title: string;
  slug: string;
  /** Timestamp Strapi tự đặt khi publish bản ghi — KHÔNG phải ngày đăng bài. */
  publishedAt: string;
  /** Ngày đăng thật của site gốc, hiển thị trên thẻ và trong meta bài viết. */
  publishedDate: string | null;
  featureImage: StrapiMedia | null;
  cover: StrapiMedia | null;
  categories: Category[];
  readingTime: string | null;
  content: string | null;
  /**
   * Enum cũ. Vẫn giữ vì nó là lưới đỡ khi quan hệ `type` bỏ trống, và vì bản
   * CMS đang chạy production chưa có collection `resource-type` — tới lúc đó
   * đây là nguồn duy nhất suy ra tab của bài.
   */
  resourceType: "Checklist" | "eBook" | "Template" | "Other";
  /** Bản ghi loại thật, thứ mang slug/URL. `null` nếu chưa gán. */
  type?: ResourceType | null;
  gated: boolean;
  gateAfterBlocks: number;
  file: StrapiMedia | null;
  seo: StrapiSeo | null;
}
