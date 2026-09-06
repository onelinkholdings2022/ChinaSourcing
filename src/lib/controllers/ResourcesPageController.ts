import { BaseController, type Result } from "../core/BaseController";
import type { ResourcesPageService } from "../services/ResourcesPageService";
import type { ResourcesPageData } from "../types/resources-page";

export class ResourcesPageController extends BaseController {
  constructor(private readonly service: ResourcesPageService) {
    super();
  }

  getPage(): Promise<Result<ResourcesPageData>> {
    return this.handle(() => this.service.getPage());
  }
}
