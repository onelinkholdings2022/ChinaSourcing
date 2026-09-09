import type { IQuery } from "../bus";
import type { PrivacyPolicyPageData } from "../../types/privacy-policy-page";

export const GET_PRIVACY_POLICY_PAGE = "privacy-policy-page/GetPage";

export class GetPrivacyPolicyPageQuery implements IQuery<PrivacyPolicyPageData> {
  readonly type = GET_PRIVACY_POLICY_PAGE;
}
