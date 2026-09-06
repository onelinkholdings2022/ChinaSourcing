import type { IQueryHandler } from "../../bus";
import type { GetAllProductsQuery } from "../../queries/GetAllProductsQuery";
import type { ProductRepository } from "../../../repositories/strapi/ProductRepository";
import type { ProductData } from "../../../types/products-page";

export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery, ProductData[]> {
  constructor(private readonly repo: ProductRepository) {}

  execute(): Promise<ProductData[]> {
    return this.repo.getAll();
  }
}
