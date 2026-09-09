import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { StrapiList } from "../../types/strapi";
import type { Category } from "../../types/category";

// Category chỉ cần ba thứ: tên (nhãn tab), slug (URL) và `seo` (trang
// `/<category-slug>`). KHÔNG được để deep populate chạy: controller bên Strapi
// populate `blogPosts`, mỗi bài kéo theo `content`, và một truy vấn 10 category
// ra **2,3MB** — vượt trần 2MB/entry của Data Cache nên Next không cache nổi và
// mỗi lượt render lại tải lại từ đầu.
const FIELDS = "fields[0]=name&fields[1]=slug&sort=name:asc&pagination[pageSize]=100";

export class CategoryRepository extends StrapiBaseRepository<Category> {
  protected getBaseEndpoint() {
    return "/api/categories";
  }

  async getAll(): Promise<Category[]> {
    const opts = { revalidate: 3600, tags: ["strapi", "category"] };

    // `seo` là field mới trên `api::category` (xem
    // `strapi-cns/scripts/fix-category-seo.js`). Bản CMS đang chạy production
    // chưa build lại thì Strapi trả 400 "Invalid key seo" và ta mất SẠCH danh
    // sách category — tức rail lọc trên `/resources` trống trơn. Nên hỏi kèm
    // `seo` trước, hỏng thì hỏi lại không kèm.
    //
    // Bỏ được nhánh lùi này ngay khi strapi-cns đã deploy.
    const withSeo = await this.client.get<StrapiList<Category>>(
      `/categories?${FIELDS}&populate[seo]=true`,
      opts,
    );
    if (withSeo) return withSeo.data ?? [];

    const plain = await this.client.get<StrapiList<Category>>(
      `/categories?${FIELDS}&populate=`,
      opts,
    );
    return plain?.data ?? [];
  }
}
