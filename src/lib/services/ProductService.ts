import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetAllProductsQuery } from "../cqrs/queries/GetAllProductsQuery";
import { GetProductBySlugQuery } from "../cqrs/queries/GetProductBySlugQuery";
import type { ProductData } from "../types/products-page";

export class ProductService extends BaseService<QueryBus> {
  getAll(): Promise<ProductData[] | null> {
    return this.bus.dispatch(new GetAllProductsQuery());
  }

  getBySlug(slug: string): Promise<ProductData | null> {
    return this.bus.dispatch(new GetProductBySlugQuery(slug));
  }
}
