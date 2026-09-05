import type { IQuery } from "../bus";
import type { GlobalData } from "../../types/global";

export const GET_GLOBAL = "global/GetGlobal";

export class GetGlobalQuery implements IQuery<GlobalData> {
  readonly type = GET_GLOBAL;
}
