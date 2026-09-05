import type { IQuery } from "../bus";
import type { Partner } from "../../types/partner";

export const GET_ALL_PARTNERS = "partner/GetAll";

export class GetAllPartnersQuery implements IQuery<Partner[]> {
  readonly type = GET_ALL_PARTNERS;
}
