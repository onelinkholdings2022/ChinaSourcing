import type { IQuery } from "../bus";
import type { ServiceData } from "../../types/services-page";

export const GET_ALL_SERVICES = "service/GetAll";

export class GetAllServicesQuery implements IQuery<ServiceData[]> {
  readonly type = GET_ALL_SERVICES;
}
