import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetPrivacyPolicyPageQuery } from "../cqrs/queries/GetPrivacyPolicyPageQuery";
import type { PrivacyPolicyPageData } from "../types/privacy-policy-page";

export class PrivacyPolicyPageService extends BaseService<QueryBus> {
  getPage(): Promise<PrivacyPolicyPageData | null> {
    return this.bus.dispatch(new GetPrivacyPolicyPageQuery());
  }
}
