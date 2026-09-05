import type { IQueryHandler } from "../../bus";
import type { GetCaseStudyBySlugQuery } from "../../queries/GetCaseStudyBySlugQuery";
import type { CaseStudyRepository } from "../../../repositories/strapi/CaseStudyRepository";
import type { CaseStudy } from "../../../types/case-study";

export class GetCaseStudyBySlugHandler implements IQueryHandler<GetCaseStudyBySlugQuery, CaseStudy> {
  constructor(private readonly repo: CaseStudyRepository) {}

  execute(query: GetCaseStudyBySlugQuery): Promise<CaseStudy | null> {
    return this.repo.getBySlug(query.slug);
  }
}
