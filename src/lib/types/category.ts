import type { StrapiSeo } from "./strapi";

export interface Category {
  id: number;
  name: string;
  slug: string;
  /**
   * Có trên mọi content type tự đứng thành trang; category vốn thiếu và đã
   * được bổ sung (`strapi-cns/scripts/fix-category-seo.js`). Hiện chưa nơi nào
   * đọc: clone không có route `/category/<slug>` — tab lọc trên `/resources`
   * là client-side thuần, không đổi URL — nên field ở đây là để sẵn cho lúc
   * có route thật. `populate[seo]` chỉ trả dữ liệu sau khi CMS được build lại.
   */
  seo?: StrapiSeo | null;
}
