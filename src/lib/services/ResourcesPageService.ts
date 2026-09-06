import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetResourcesPageQuery } from "../cqrs/queries/GetResourcesPageQuery";
import type { ResourcesPageData } from "../types/resources-page";

export class ResourcesPageService extends BaseService<QueryBus> {
  getPage(): Promise<ResourcesPageData | null> {
    return this.bus.dispatch(new GetResourcesPageQuery());
  }
}
