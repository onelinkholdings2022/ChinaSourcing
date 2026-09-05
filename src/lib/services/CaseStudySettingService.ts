import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetCaseStudySettingQuery } from "../cqrs/queries/GetCaseStudySettingQuery";
import type { CaseStudySettingData } from "../types/case-studies-page";

export class CaseStudySettingService extends BaseService<QueryBus> {
  getSettings(): Promise<CaseStudySettingData | null> {
    return this.bus.dispatch(new GetCaseStudySettingQuery());
  }
}
