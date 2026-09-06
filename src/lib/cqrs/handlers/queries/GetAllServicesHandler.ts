import type { IQueryHandler } from "../../bus";
import type { GetAllServicesQuery } from "../../queries/GetAllServicesQuery";
import type { ServiceRepository } from "../../../repositories/strapi/ServiceRepository";
import type { ServiceData } from "../../../types/services-page";

export class GetAllServicesHandler implements IQueryHandler<GetAllServicesQuery, ServiceData[]> {
  constructor(private readonly repo: ServiceRepository) {}

  execute(): Promise<ServiceData[]> {
    return this.repo.getAll();
  }
}
