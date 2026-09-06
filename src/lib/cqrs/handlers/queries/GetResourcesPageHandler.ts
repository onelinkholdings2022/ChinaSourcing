import type { IQueryHandler } from "../../bus";
import type { GetResourcesPageQuery } from "../../queries/GetResourcesPageQuery";
import type { ResourcesPageRepository } from "../../../repositories/strapi/ResourcesPageRepository";
import type { ResourcesPageData } from "../../../types/resources-page";

export class GetResourcesPageHandler implements IQueryHandler<GetResourcesPageQuery, ResourcesPageData> {
  constructor(private readonly repo: ResourcesPageRepository) {}

  execute(): Promise<ResourcesPageData | null> {
    return this.repo.getPage();
  }
}
