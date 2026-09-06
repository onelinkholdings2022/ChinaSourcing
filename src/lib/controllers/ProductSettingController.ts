import { BaseController, type Result } from "../core/BaseController";
import type { ProductSettingService } from "../services/ProductSettingService";
import type { ProductSettingData } from "../types/products-page";

export class ProductSettingController extends BaseController {
  constructor(private readonly service: ProductSettingService) {
    super();
  }

  getSettings(): Promise<Result<ProductSettingData>> {
    return this.handle(() => this.service.getSettings());
  }
}
