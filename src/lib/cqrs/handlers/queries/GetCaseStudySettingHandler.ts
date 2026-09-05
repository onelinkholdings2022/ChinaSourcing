import type { IQueryHandler } from "../../bus";
import type { GetCaseStudySettingQuery } from "../../queries/GetCaseStudySettingQuery";
import type { CaseStudySettingRepository } from "../../../repositories/strapi/CaseStudySettingRepository";
import type { CaseStudySettingData } from "../../../types/case-studies-page";

export class GetCaseStudySettingHandler implements IQueryHandler<GetCaseStudySettingQuery, CaseStudySettingData> {
  constructor(private readonly repo: CaseStudySettingRepository) {}

  execute(): Promise<CaseStudySettingData | null> {
    return this.repo.getSettings();
  }
}
