import { BaseController, type Result } from "../core/BaseController";
import type { ServiceSettingService } from "../services/ServiceSettingService";
import type { ServiceSettingData } from "../types/services-page";

export class ServiceSettingController extends BaseController {
  constructor(private readonly service: ServiceSettingService) {
    super();
  }

  getSettings(): Promise<Result<ServiceSettingData>> {
    return this.handle(() => this.service.getSettings());
  }
}
