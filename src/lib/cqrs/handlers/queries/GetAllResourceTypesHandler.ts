import type { IQueryHandler } from "../../bus";
import type { GetAllResourceTypesQuery } from "../../queries/GetAllResourceTypesQuery";
import type { ResourceTypeRepository } from "../../../repositories/strapi/ResourceTypeRepository";
import type { ResourceType } from "../../../types/resource-type";

export class GetAllResourceTypesHandler
  implements IQueryHandler<GetAllResourceTypesQuery, ResourceType[]>
{
  constructor(private readonly repo: ResourceTypeRepository) {}

  execute(): Promise<ResourceType[]> {
    return this.repo.getAll();
  }
}
