import type { IQueryHandler } from "../../bus";
import type { GetHomepageQuery } from "../../queries/GetHomepageQuery";
import type { HomepageRepository } from "../../../repositories/strapi/HomepageRepository";
import type { HomepageData } from "../../../types/homepage";

export class GetHomepageHandler implements IQueryHandler<GetHomepageQuery, HomepageData> {
  constructor(private readonly repo: HomepageRepository) {}

  execute(): Promise<HomepageData | null> {
    return this.repo.getPage();
  }
}
