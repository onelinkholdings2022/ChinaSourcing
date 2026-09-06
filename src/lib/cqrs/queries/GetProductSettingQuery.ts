import type { IQuery } from "../bus";
import type { ProductSettingData } from "../../types/products-page";

export const GET_PRODUCT_SETTING = "product-setting/GetSettings";

export class GetProductSettingQuery implements IQuery<ProductSettingData> {
  readonly type = GET_PRODUCT_SETTING;
}
