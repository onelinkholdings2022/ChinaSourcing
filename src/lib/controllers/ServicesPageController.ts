import { BaseController, type Result } from "../core/BaseController";
import type { ServicesPageService } from "../services/ServicesPageService";
import type { ServicesPageData } from "../types/services-page";

export class ServicesPageController extends BaseController {
  constructor(private readonly service: ServicesPageService) {
    super();
  }

  getPage(): Promise<Result<ServicesPageData>> {
    return this.handle(() => this.service.getPage());
  }
}
