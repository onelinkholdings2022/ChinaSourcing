import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetFeaturedCaseStudiesQuery } from "../cqrs/queries/GetFeaturedCaseStudiesQuery";
import type { CaseStudy } from "../types/case-study";

export class CaseStudyService extends BaseService<QueryBus> {
  getFeatured(): Promise<CaseStudy[] | null> {
    return this.bus.dispatch(new GetFeaturedCaseStudiesQuery());
  }
}
