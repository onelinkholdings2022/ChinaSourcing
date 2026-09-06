import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ProductsPageData } from "../../types/products-page";

export class ProductsPageRepository extends StrapiBaseRepository<ProductsPageData> {
  protected getBaseEndpoint() {
    return "/api/products-page";
  }

  getPage(): Promise<ProductsPageData | null> {
    return this.fetchSingle("/products-page", { revalidate: 3600, tags: ["strapi", "products-page"] });
  }
}
