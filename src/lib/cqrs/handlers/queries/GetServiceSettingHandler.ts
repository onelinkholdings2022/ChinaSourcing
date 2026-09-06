import type { IQueryHandler } from "../../bus";
import type { GetServiceSettingQuery } from "../../queries/GetServiceSettingQuery";
import type { ServiceSettingRepository } from "../../../repositories/strapi/ServiceSettingRepository";
import type { ServiceSettingData } from "../../../types/services-page";

export class GetServiceSettingHandler implements IQueryHandler<GetServiceSettingQuery, ServiceSettingData> {
  constructor(private readonly repo: ServiceSettingRepository) {}

  execute(): Promise<ServiceSettingData | null> {
    return this.repo.getSettings();
  }
}
