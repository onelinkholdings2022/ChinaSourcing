import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetAllServicesQuery } from "../cqrs/queries/GetAllServicesQuery";
import { GetServiceBySlugQuery } from "../cqrs/queries/GetServiceBySlugQuery";
import type { ServiceData } from "../types/services-page";

export class ServiceService extends BaseService<QueryBus> {
  getAll(): Promise<ServiceData[] | null> {
    return this.bus.dispatch(new GetAllServicesQuery());
  }

  getBySlug(slug: string): Promise<ServiceData | null> {
    return this.bus.dispatch(new GetServiceBySlugQuery(slug));
  }
}
