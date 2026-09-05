import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetContactPageQuery } from "../cqrs/queries/GetContactPageQuery";
import type { ContactPageData } from "../types/contact-page";

export class ContactPageService extends BaseService<QueryBus> {
  getPage(): Promise<ContactPageData | null> {
    return this.bus.dispatch(new GetContactPageQuery());
  }
}
