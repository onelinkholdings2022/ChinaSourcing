import { BaseController, type Result } from "../core/BaseController";
import type { ProductService } from "../services/ProductService";
import type { ProductData } from "../types/products-page";

export class ProductController extends BaseController {
  constructor(private readonly service: ProductService) {
    super();
  }

  getAll(): Promise<Result<ProductData[]>> {
    return this.handle(() => this.service.getAll());
  }

  getBySlug(slug: string): Promise<Result<ProductData>> {
    return this.handle(() => this.service.getBySlug(slug));
  }
}
