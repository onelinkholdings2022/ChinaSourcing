import { BaseController, type Result } from "../core/BaseController";
import type { PartnerService } from "../services/PartnerService";
import type { Partner } from "../types/partner";

export class PartnerController extends BaseController {
  constructor(private readonly service: PartnerService) {
    super();
  }

  getAll(): Promise<Result<Partner[]>> {
    return this.handle(() => this.service.getAll());
  }
}
