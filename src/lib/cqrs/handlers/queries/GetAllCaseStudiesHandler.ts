import type { IQueryHandler } from "../../bus";
import type { GetAllCaseStudiesQuery } from "../../queries/GetAllCaseStudiesQuery";
import type { CaseStudyRepository } from "../../../repositories/strapi/CaseStudyRepository";
import type { CaseStudy } from "../../../types/case-study";

export class GetAllCaseStudiesHandler implements IQueryHandler<GetAllCaseStudiesQuery, CaseStudy[]> {
  constructor(private readonly repo: CaseStudyRepository) {}

  execute(): Promise<CaseStudy[]> {
    return this.repo.getAll();
  }
}
