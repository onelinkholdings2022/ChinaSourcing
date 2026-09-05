import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetGlobalQuery } from "../cqrs/queries/GetGlobalQuery";
import type { GlobalData } from "../types/global";

export class GlobalService extends BaseService<QueryBus> {
  getGlobal(): Promise<GlobalData | null> {
    return this.bus.dispatch(new GetGlobalQuery());
  }
}
