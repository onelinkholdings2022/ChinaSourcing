import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetClientLogosQuery } from "../cqrs/queries/GetClientLogosQuery";
import type { AboutPagePartial } from "../types/about-page";

export class AboutPageService extends BaseService<QueryBus> {
  getClientLogos(): Promise<AboutPagePartial | null> {
    return this.bus.dispatch(new GetClientLogosQuery());
  }
}
