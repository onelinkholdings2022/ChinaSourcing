import type { IQuery } from "../bus";
import type { ServiceSettingData } from "../../types/services-page";

export const GET_SERVICE_SETTING = "service-setting/GetSettings";

export class GetServiceSettingQuery implements IQuery<ServiceSettingData> {
  readonly type = GET_SERVICE_SETTING;
}
