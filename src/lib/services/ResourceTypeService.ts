import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetAllResourceTypesQuery } from "../cqrs/queries/GetAllResourceTypesQuery";
import type { ResourceType } from "../types/resource-type";

export class ResourceTypeService extends BaseService<QueryBus> {
  getAll(): Promise<ResourceType[] | null> {
    return this.bus.dispatch(new GetAllResourceTypesQuery());
  }
}
