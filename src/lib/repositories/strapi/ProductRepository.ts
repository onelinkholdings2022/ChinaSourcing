import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ProductData } from "../../types/products-page";

export class ProductRepository extends StrapiBaseRepository<ProductData> {
  protected getBaseEndpoint() {
    return "/api/products";
  }

  getAll(): Promise<ProductData[]> {
    return this.fetchList<ProductData>("/products?sort=order:asc&pagination[pageSize]=100", {
      revalidate: 3600,
      tags: ["strapi", "product"],
    });
  }

  async getBySlug(slug: string): Promise<ProductData | null> {
    const list = await this.fetchList<ProductData>(`/products?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: ["strapi", "product", `product:${slug}`],
    });
    return list[0] ?? null;
  }
}
