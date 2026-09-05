import type { IQueryHandler } from "../../bus";
import type { GetCaseStudiesPageQuery } from "../../queries/GetCaseStudiesPageQuery";
import type { CaseStudiesPageRepository } from "../../../repositories/strapi/CaseStudiesPageRepository";
import type { CaseStudiesPageData } from "../../../types/case-studies-page";

export class GetCaseStudiesPageHandler implements IQueryHandler<GetCaseStudiesPageQuery, CaseStudiesPageData> {
  constructor(private readonly repo: CaseStudiesPageRepository) {}

  execute(): Promise<CaseStudiesPageData | null> {
    return this.repo.getPage();
  }
}
