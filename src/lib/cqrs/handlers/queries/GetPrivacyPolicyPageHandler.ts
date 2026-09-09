import type { IQueryHandler } from "../../bus";
import type { GetPrivacyPolicyPageQuery } from "../../queries/GetPrivacyPolicyPageQuery";
import type { PrivacyPolicyPageRepository } from "../../../repositories/strapi/PrivacyPolicyPageRepository";
import type { PrivacyPolicyPageData } from "../../../types/privacy-policy-page";

export class GetPrivacyPolicyPageHandler
  implements IQueryHandler<GetPrivacyPolicyPageQuery, PrivacyPolicyPageData>
{
  constructor(private readonly repo: PrivacyPolicyPageRepository) {}

  execute(): Promise<PrivacyPolicyPageData | null> {
    return this.repo.getPage();
  }
}
