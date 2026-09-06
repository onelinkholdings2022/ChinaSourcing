import { BaseController, type Result } from "../core/BaseController";
import type { ServiceService } from "../services/ServiceService";
import type { ServiceData } from "../types/services-page";

export class ServiceController extends BaseController {
  constructor(private readonly service: ServiceService) {
    super();
  }

  getAll(): Promise<Result<ServiceData[]>> {
    return this.handle(() => this.service.getAll());
  }

  getBySlug(slug: string): Promise<Result<ServiceData>> {
    return this.handle(() => this.service.getBySlug(slug));
  }
}
