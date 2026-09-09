import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ResourceType } from "../../types/resource-type";

export class ResourceTypeRepository extends StrapiBaseRepository<ResourceType> {
  protected getBaseEndpoint() {
    return "/api/resource-types";
  }

  /**
   * 4 loại download — Checklists / eBook / Others / Templates.
   *
   * `populate=` RỖNG là bắt buộc: controller bên Strapi gắn deep populate cho
   * mọi `find`, và ở đây nó sẽ kéo theo quan hệ `resources` — tức toàn bộ nội
   * dung 12 bài, cho một truy vấn chỉ cần bốn cái nhãn. `seo` hỏi riêng vì
   * `app/resource-types/[slug]` đọc nó.
   *
   * ⚠️ Trả `[]` khi Strapi 404: collection này chưa có trên bản CMS đang chạy
   * production. `buildFreeResourcesView` lùi về enum `resource.resourceType`
   * khi mảng rỗng, nên rail vẫn đủ 4 tab — chỉ là chưa có URL riêng.
   */
  getAll(): Promise<ResourceType[]> {
    return this.fetchList<ResourceType>(
      "/resource-types?populate[seo]=true&sort=order:asc&pagination[pageSize]=100",
      { revalidate: 3600, tags: ["strapi", "resource-type"] },
    );
  }
}
