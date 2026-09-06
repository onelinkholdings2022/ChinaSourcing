import type { IQueryHandler } from "../../bus";
import type { GetProductsPageQuery } from "../../queries/GetProductsPageQuery";
import type { ProductsPageRepository } from "../../../repositories/strapi/ProductsPageRepository";
import type { ProductsPageData } from "../../../types/products-page";

export class GetProductsPageHandler implements IQueryHandler<GetProductsPageQuery, ProductsPageData> {
  constructor(private readonly repo: ProductsPageRepository) {}

  execute(): Promise<ProductsPageData | null> {
    return this.repo.getPage();
  }
}
