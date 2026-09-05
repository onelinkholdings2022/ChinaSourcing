import { BaseController, type Result } from "../core/BaseController";
import type { CaseStudySettingService } from "../services/CaseStudySettingService";
import type { CaseStudySettingData } from "../types/case-studies-page";

export class CaseStudySettingController extends BaseController {
  constructor(private readonly service: CaseStudySettingService) {
    super();
  }

  getSettings(): Promise<Result<CaseStudySettingData>> {
    return this.handle(() => this.service.getSettings());
  }
}
