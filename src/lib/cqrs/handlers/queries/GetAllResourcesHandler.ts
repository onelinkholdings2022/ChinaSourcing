import type { IQueryHandler } from "../../bus";
import type { GetAllResourcesQuery } from "../../queries/GetAllResourcesQuery";
import type { ResourceRepository } from "../../../repositories/strapi/ResourceRepository";
import type { Resource } from "../../../types/resource";

export class GetAllResourcesHandler implements IQueryHandler<GetAllResourcesQuery, Resource[]> {
  constructor(private readonly repo: ResourceRepository) {}

  execute(): Promise<Resource[]> {
    return this.repo.getAll();
  }
}
