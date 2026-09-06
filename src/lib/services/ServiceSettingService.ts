import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetServiceSettingQuery } from "../cqrs/queries/GetServiceSettingQuery";
import type { ServiceSettingData } from "../types/services-page";

export class ServiceSettingService extends BaseService<QueryBus> {
  getSettings(): Promise<ServiceSettingData | null> {
    return this.bus.dispatch(new GetServiceSettingQuery());
  }
}
