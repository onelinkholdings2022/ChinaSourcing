import type { IQuery } from "../bus";
import type { HomepageData } from "../../types/homepage";

export const GET_HOMEPAGE = "homepage/GetPage";

export class GetHomepageQuery implements IQuery<HomepageData> {
  readonly type = GET_HOMEPAGE;
}
