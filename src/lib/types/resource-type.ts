import type { StrapiSeo } from "./strapi";

/**
 * Một tab lọc của khối "Free Resources" trên `/resources`.
 *
 * Trước đây bốn tab này lấy từ enum `resource.resourceType`. Enum không có
 * slug, không có bản ghi, không có chỗ nhập SEO — nên không thể cho mỗi loại
 * một URL riêng `/<slug>` như category blog. Giờ mỗi loại là một bản ghi thật;
 * enum vẫn còn và vẫn là lưới đỡ khi quan hệ `resource.type` bị bỏ trống
 * (xem `buildFreeResourcesView`).
 */
export interface ResourceType {
  id: number;
  name: string;
  slug: string;
  order: number | null;
  seo?: StrapiSeo | null;
}
