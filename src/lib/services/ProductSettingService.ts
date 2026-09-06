import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetProductSettingQuery } from "../cqrs/queries/GetProductSettingQuery";
import type { ProductSettingData } from "../types/products-page";

export class ProductSettingService extends BaseService<QueryBus> {
  getSettings(): Promise<ProductSettingData | null> {
    return this.bus.dispatch(new GetProductSettingQuery());
  }
}
