import { BaseController, type Result } from "../core/BaseController";
import type { AboutPageService } from "../services/AboutPageService";
import type { AboutPagePartial } from "../types/about-page";

export class AboutPageController extends BaseController {
  constructor(private readonly service: AboutPageService) {
    super();
  }

  getClientLogos(): Promise<Result<AboutPagePartial>> {
    return this.handle(() => this.service.getClientLogos());
  }
}
