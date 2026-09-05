import type { IQuery } from "../bus";
import type { CaseStudiesPageData } from "../../types/case-studies-page";

export const GET_CASE_STUDIES_PAGE = "case-studies-page/GetPage";

export class GetCaseStudiesPageQuery implements IQuery<CaseStudiesPageData> {
  readonly type = GET_CASE_STUDIES_PAGE;
}
