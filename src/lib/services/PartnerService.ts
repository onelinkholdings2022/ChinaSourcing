import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetAllPartnersQuery } from "../cqrs/queries/GetAllPartnersQuery";
import type { Partner } from "../types/partner";

export class PartnerService extends BaseService<QueryBus> {
  getAll(): Promise<Partner[] | null> {
    return this.bus.dispatch(new GetAllPartnersQuery());
  }
}
