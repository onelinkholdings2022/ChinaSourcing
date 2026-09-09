import { BaseController, type Result } from "../core/BaseController";
import type { ResourceTypeService } from "../services/ResourceTypeService";
import type { ResourceType } from "../types/resource-type";

export class ResourceTypeController extends BaseController {
  constructor(private readonly service: ResourceTypeService) {
    super();
  }

  getAll(): Promise<Result<ResourceType[]>> {
    return this.handle(() => this.service.getAll());
  }
}
