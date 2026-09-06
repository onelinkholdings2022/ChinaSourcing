import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetServicesPageQuery } from "../cqrs/queries/GetServicesPageQuery";
import type { ServicesPageData } from "../types/services-page";

export class ServicesPageService extends BaseService<QueryBus> {
  getPage(): Promise<ServicesPageData | null> {
    return this.bus.dispatch(new GetServicesPageQuery());
  }
}
