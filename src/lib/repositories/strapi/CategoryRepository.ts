import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { Category } from "../../types/category";

export class CategoryRepository extends StrapiBaseRepository<Category> {
  protected getBaseEndpoint() {
    return "/api/categories";
  }

  getAll(): Promise<Category[]> {
    return this.fetchList<Category>("/categories?sort=name:asc&pagination[pageSize]=100", {
      revalidate: 3600,
      tags: ["strapi", "category"],
    });
  }
}
