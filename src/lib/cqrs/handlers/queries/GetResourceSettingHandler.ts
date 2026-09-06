import type { IQueryHandler } from "../../bus";
import type { GetResourceSettingQuery } from "../../queries/GetResourceSettingQuery";
import type { ResourceSettingRepository } from "../../../repositories/strapi/ResourceSettingRepository";
import type { ResourceSettingData } from "../../../types/resources-page";

export class GetResourceSettingHandler implements IQueryHandler<GetResourceSettingQuery, ResourceSettingData> {
  constructor(private readonly repo: ResourceSettingRepository) {}

  execute(): Promise<ResourceSettingData | null> {
    return this.repo.getSettings();
  }
}
