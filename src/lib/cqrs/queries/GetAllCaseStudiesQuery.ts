import type { IQuery } from "../bus";
import type { CaseStudy } from "../../types/case-study";

export const GET_ALL_CASE_STUDIES = "case-study/GetAll";

export class GetAllCaseStudiesQuery implements IQuery<CaseStudy[]> {
  readonly type = GET_ALL_CASE_STUDIES;
}
