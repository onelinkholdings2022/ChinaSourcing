import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { ProductSettingData } from "../../types/products-page";

export class ProductSettingRepository extends StrapiBaseRepository<ProductSettingData> {
  protected getBaseEndpoint() {
    return "/api/product-setting";
  }

  getSettings(): Promise<ProductSettingData | null> {
    return this.fetchSingle("/product-setting", { revalidate: 3600, tags: ["strapi", "product-setting"] });
  }
}
