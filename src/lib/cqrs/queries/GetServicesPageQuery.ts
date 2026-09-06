import type { IQuery } from "../bus";
import type { ServicesPageData } from "../../types/services-page";

export const GET_SERVICES_PAGE = "services-page/GetPage";

export class GetServicesPageQuery implements IQuery<ServicesPageData> {
  readonly type = GET_SERVICES_PAGE;
}
