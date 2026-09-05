import { BaseController, type Result } from "../core/BaseController";
import type { GlobalService } from "../services/GlobalService";
import type { GlobalData } from "../types/global";

export class GlobalController extends BaseController {
  constructor(private readonly service: GlobalService) {
    super();
  }

  getGlobal(): Promise<Result<GlobalData>> {
    return this.handle(() => this.service.getGlobal());
  }
}
