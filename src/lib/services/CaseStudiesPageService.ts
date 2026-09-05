import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetCaseStudiesPageQuery } from "../cqrs/queries/GetCaseStudiesPageQuery";
import type { CaseStudiesPageData } from "../types/case-studies-page";

export class CaseStudiesPageService extends BaseService<QueryBus> {
  getPage(): Promise<CaseStudiesPageData | null> {
    return this.bus.dispatch(new GetCaseStudiesPageQuery());
  }
}
