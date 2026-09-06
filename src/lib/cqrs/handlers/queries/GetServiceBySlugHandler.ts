import type { IQueryHandler } from "../../bus";
import type { GetServiceBySlugQuery } from "../../queries/GetServiceBySlugQuery";
import type { ServiceRepository } from "../../../repositories/strapi/ServiceRepository";
import type { ServiceData } from "../../../types/services-page";

export class GetServiceBySlugHandler implements IQueryHandler<GetServiceBySlugQuery, ServiceData> {
  constructor(private readonly repo: ServiceRepository) {}

  execute(query: GetServiceBySlugQuery): Promise<ServiceData | null> {
    return this.repo.getBySlug(query.slug);
  }
}
