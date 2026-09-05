import type { IQuery } from "../bus";
import type { CaseStudySettingData } from "../../types/case-studies-page";

export const GET_CASE_STUDY_SETTING = "case-study-setting/GetSettings";

export class GetCaseStudySettingQuery implements IQuery<CaseStudySettingData> {
  readonly type = GET_CASE_STUDY_SETTING;
}
