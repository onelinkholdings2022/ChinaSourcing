import type { IQuery } from "../bus";
import type { ServiceData } from "../../types/services-page";

export const GET_SERVICE_BY_SLUG = "service/GetBySlug";

export class GetServiceBySlugQuery implements IQuery<ServiceData> {
  readonly type = GET_SERVICE_BY_SLUG;
  constructor(readonly slug: string) {}
}
