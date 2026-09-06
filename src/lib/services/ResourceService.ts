import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetAllResourcesQuery } from "../cqrs/queries/GetAllResourcesQuery";
import { GetResourceBySlugQuery } from "../cqrs/queries/GetResourceBySlugQuery";
import type { Resource } from "../types/resource";

export class ResourceService extends BaseService<QueryBus> {
  getAll(): Promise<Resource[] | null> {
    return this.bus.dispatch(new GetAllResourcesQuery());
  }

  getBySlug(slug: string): Promise<Resource | null> {
    return this.bus.dispatch(new GetResourceBySlugQuery(slug));
  }
}
