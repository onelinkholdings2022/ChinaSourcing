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

  getAll(): Promise<Result<CaseStudy[]>> {
    return this.handle(() => this.service.getAll());
  }

  getBySlug(slug: string): Promise<Result<CaseStudy>> {
    return this.handle(() => this.service.getBySlug(slug));
  }
}
