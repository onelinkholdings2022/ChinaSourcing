import type { IQueryHandler } from "../../bus";
import type { GetServicesPageQuery } from "../../queries/GetServicesPageQuery";
import type { ServicesPageRepository } from "../../../repositories/strapi/ServicesPageRepository";
import type { ServicesPageData } from "../../../types/services-page";

export class GetServicesPageHandler implements IQueryHandler<GetServicesPageQuery, ServicesPageData> {
  constructor(private readonly repo: ServicesPageRepository) {}

  execute(): Promise<ServicesPageData | null> {
    return this.repo.getPage();
  }
}
