import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetProcessPageQuery } from "../cqrs/queries/GetProcessPageQuery";
import type { ProcessPageData } from "../types/process-page";

export class ProcessPageService extends BaseService<QueryBus> {
  getPage(): Promise<ProcessPageData | null> {
    return this.bus.dispatch(new GetProcessPageQuery());
  }
}
