import { BaseController, type Result } from "../core/BaseController";
import type { ResourceService } from "../services/ResourceService";
import type { Resource } from "../types/resource";

export class ResourceController extends BaseController {
  constructor(private readonly service: ResourceService) {
    super();
  }

  getAll(): Promise<Result<Resource[]>> {
    return this.handle(() => this.service.getAll());
  }

  getBySlug(slug: string): Promise<Result<Resource>> {
    return this.handle(() => this.service.getBySlug(slug));
  }
}
