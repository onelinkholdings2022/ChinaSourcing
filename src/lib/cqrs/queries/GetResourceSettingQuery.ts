import type { IQuery } from "../bus";
import type { ResourceSettingData } from "../../types/resources-page";

export const GET_RESOURCE_SETTING = "resource-setting/GetSettings";

export class GetResourceSettingQuery implements IQuery<ResourceSettingData> {
  readonly type = GET_RESOURCE_SETTING;
}
