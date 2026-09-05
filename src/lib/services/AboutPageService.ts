import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetClientLogosQuery } from "../cqrs/queries/GetClientLogosQuery";
import { GetAboutPageQuery } from "../cqrs/queries/GetAboutPageQuery";
import type { AboutPageData } from "../types/about-page";

export class AboutPageService extends BaseService<QueryBus> {
  getPage(): Promise<AboutPageData | null> {
    return this.bus.dispatch(new GetAboutPageQuery());
  }

  getClientLogos(): Promise<AboutPageData | null> {
    return this.bus.dispatch(new GetClientLogosQuery());
  }
}
