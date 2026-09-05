import { BaseController, type Result } from "../core/BaseController";
import type { CaseStudyService } from "../services/CaseStudyService";
import type { CaseStudy } from "../types/case-study";

export class CaseStudyController extends BaseController {
  constructor(private readonly service: CaseStudyService) {
    super();
  }

  getFeatured(): Promise<Result<CaseStudy[]>> {
    return this.handle(() => this.service.getFeatured());
  }
}
