import { BaseController, type Result } from "../core/BaseController";
import type { PrivacyPolicyPageService } from "../services/PrivacyPolicyPageService";
import type { PrivacyPolicyPageData } from "../types/privacy-policy-page";

export class PrivacyPolicyPageController extends BaseController {
  constructor(private readonly service: PrivacyPolicyPageService) {
    super();
  }

  getPage(): Promise<Result<PrivacyPolicyPageData>> {
    return this.handle(() => this.service.getPage());
  }
}
