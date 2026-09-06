import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetResourceSettingQuery } from "../cqrs/queries/GetResourceSettingQuery";
import type { ResourceSettingData } from "../types/resources-page";

export class ResourceSettingService extends BaseService<QueryBus> {
  getSettings(): Promise<ResourceSettingData | null> {
    return this.bus.dispatch(new GetResourceSettingQuery());
  }
}
