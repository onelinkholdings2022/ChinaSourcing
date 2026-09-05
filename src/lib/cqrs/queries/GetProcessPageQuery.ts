import type { IQuery } from "../bus";
import type { ProcessPageData } from "../../types/process-page";

export const GET_PROCESS_PAGE = "process-page/GetPage";

export class GetProcessPageQuery implements IQuery<ProcessPageData> {
  readonly type = GET_PROCESS_PAGE;
}
