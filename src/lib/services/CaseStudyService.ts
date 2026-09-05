import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetFeaturedCaseStudiesQuery } from "../cqrs/queries/GetFeaturedCaseStudiesQuery";
import { GetAllCaseStudiesQuery } from "../cqrs/queries/GetAllCaseStudiesQuery";
import { GetCaseStudyBySlugQuery } from "../cqrs/queries/GetCaseStudyBySlugQuery";
import type { CaseStudy } from "../types/case-study";

export class CaseStudyService extends BaseService<QueryBus> {
  getFeatured(): Promise<CaseStudy[] | null> {
    return this.bus.dispatch(new GetFeaturedCaseStudiesQuery());
  }

  getAll(): Promise<CaseStudy[] | null> {
    return this.bus.dispatch(new GetAllCaseStudiesQuery());
  }

  getBySlug(slug: string): Promise<CaseStudy | null> {
    return this.bus.dispatch(new GetCaseStudyBySlugQuery(slug));
  }
}
