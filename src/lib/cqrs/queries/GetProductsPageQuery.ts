import type { IQuery } from "../bus";
import type { ProductsPageData } from "../../types/products-page";

export const GET_PRODUCTS_PAGE = "products-page/GetPage";

export class GetProductsPageQuery implements IQuery<ProductsPageData> {
  readonly type = GET_PRODUCTS_PAGE;
}
