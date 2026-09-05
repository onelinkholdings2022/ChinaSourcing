import { BaseController, type Result } from "../core/BaseController";
import type { CaseStudiesPageService } from "../services/CaseStudiesPageService";
import type { CaseStudiesPageData } from "../types/case-studies-page";

export class CaseStudiesPageController extends BaseController {
  constructor(private readonly service: CaseStudiesPageService) {
    super();
  }

  getPage(): Promise<Result<CaseStudiesPageData>> {
    return this.handle(() => this.service.getPage());
  }
}
