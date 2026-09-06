import type { IQueryHandler } from "../../bus";
import type { GetProductBySlugQuery } from "../../queries/GetProductBySlugQuery";
import type { ProductRepository } from "../../../repositories/strapi/ProductRepository";
import type { ProductData } from "../../../types/products-page";

export class GetProductBySlugHandler implements IQueryHandler<GetProductBySlugQuery, ProductData> {
  constructor(private readonly repo: ProductRepository) {}

  execute(query: GetProductBySlugQuery): Promise<ProductData | null> {
    return this.repo.getBySlug(query.slug);
  }
}
