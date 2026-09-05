import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetHomepageQuery } from "../cqrs/queries/GetHomepageQuery";
import type { HomepageData } from "../types/homepage";

export class HomepageService extends BaseService<QueryBus> {
  getPage(): Promise<HomepageData | null> {
    return this.bus.dispatch(new GetHomepageQuery());
  }
}
