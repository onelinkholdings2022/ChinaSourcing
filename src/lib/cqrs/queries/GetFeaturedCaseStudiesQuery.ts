import type { IQuery } from "../bus";
import type { CaseStudy } from "../../types/case-study";

export const GET_FEATURED_CASE_STUDIES = "case-study/GetFeatured";

export class GetFeaturedCaseStudiesQuery implements IQuery<CaseStudy[]> {
  readonly type = GET_FEATURED_CASE_STUDIES;
}
