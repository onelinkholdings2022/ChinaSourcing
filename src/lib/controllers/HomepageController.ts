import { BaseController, type Result } from "../core/BaseController";
import type { HomepageService } from "../services/HomepageService";
import type { HomepageData } from "../types/homepage";

export class HomepageController extends BaseController {
  constructor(private readonly service: HomepageService) {
    super();
  }

  getPage(): Promise<Result<HomepageData>> {
    return this.handle(() => this.service.getPage());
  }
}
