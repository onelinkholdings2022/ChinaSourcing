import { BaseController, type Result } from "../core/BaseController";
import type { ResourceSettingService } from "../services/ResourceSettingService";
import type { ResourceSettingData } from "../types/resources-page";

export class ResourceSettingController extends BaseController {
  constructor(private readonly service: ResourceSettingService) {
    super();
  }

  getSettings(): Promise<Result<ResourceSettingData>> {
    return this.handle(() => this.service.getSettings());
  }
}
