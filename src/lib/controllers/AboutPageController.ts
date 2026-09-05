import { BaseController, type Result } from "../core/BaseController";
import type { AboutPageService } from "../services/AboutPageService";
import type { AboutPageData } from "../types/about-page";

export class AboutPageController extends BaseController {
  constructor(private readonly service: AboutPageService) {
    super();
  }

  getPage(): Promise<Result<AboutPageData>> {
    return this.handle(() => this.service.getPage());
  }

  getClientLogos(): Promise<Result<AboutPageData>> {
    return this.handle(() => this.service.getClientLogos());
  }
}
