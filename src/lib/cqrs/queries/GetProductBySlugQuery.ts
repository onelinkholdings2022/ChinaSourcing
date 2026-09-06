import type { IQuery } from "../bus";
import type { ProductData } from "../../types/products-page";

export const GET_PRODUCT_BY_SLUG = "product/GetBySlug";

export class GetProductBySlugQuery implements IQuery<ProductData> {
  readonly type = GET_PRODUCT_BY_SLUG;
  constructor(readonly slug: string) {}
}
