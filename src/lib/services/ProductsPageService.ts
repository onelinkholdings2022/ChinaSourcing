import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetProductsPageQuery } from "../cqrs/queries/GetProductsPageQuery";
import type { ProductsPageData } from "../types/products-page";

export class ProductsPageService extends BaseService<QueryBus> {
  getPage(): Promise<ProductsPageData | null> {
    return this.bus.dispatch(new GetProductsPageQuery());
  }
}
