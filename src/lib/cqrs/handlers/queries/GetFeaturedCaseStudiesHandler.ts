import type { IQueryHandler } from "../../bus";
import type { GetFeaturedCaseStudiesQuery } from "../../queries/GetFeaturedCaseStudiesQuery";
import type { CaseStudyRepository } from "../../../repositories/strapi/CaseStudyRepository";
import type { CaseStudy } from "../../../types/case-study";

export class GetFeaturedCaseStudiesHandler implements IQueryHandler<GetFeaturedCaseStudiesQuery, CaseStudy[]> {
  constructor(private readonly repo: CaseStudyRepository) {}

  execute(): Promise<CaseStudy[]> {
    return this.repo.getFeatured();
  }
}
