import { BaseController, type Result } from "../core/BaseController";
import type { ProductsPageService } from "../services/ProductsPageService";
import type { ProductsPageData } from "../types/products-page";

export class ProductsPageController extends BaseController {
  constructor(private readonly service: ProductsPageService) {
    super();
  }

  getPage(): Promise<Result<ProductsPageData>> {
    return this.handle(() => this.service.getPage());
  }
}
