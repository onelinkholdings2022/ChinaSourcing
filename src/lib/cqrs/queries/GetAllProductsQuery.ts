import type { IQuery } from "../bus";
import type { ProductData } from "../../types/products-page";

export const GET_ALL_PRODUCTS = "product/GetAll";

export class GetAllProductsQuery implements IQuery<ProductData[]> {
  readonly type = GET_ALL_PRODUCTS;
}
