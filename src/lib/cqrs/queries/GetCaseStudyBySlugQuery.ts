import type { IQuery } from "../bus";
import type { CaseStudy } from "../../types/case-study";

export const GET_CASE_STUDY_BY_SLUG = "case-study/GetBySlug";

export class GetCaseStudyBySlugQuery implements IQuery<CaseStudy> {
  readonly type = GET_CASE_STUDY_BY_SLUG;
  constructor(readonly slug: string) {}
}
