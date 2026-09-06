import type { IQuery } from "../bus";
import type { ResourcesPageData } from "../../types/resources-page";

export const GET_RESOURCES_PAGE = "resources-page/GetPage";

export class GetResourcesPageQuery implements IQuery<ResourcesPageData> {
  readonly type = GET_RESOURCES_PAGE;
}
