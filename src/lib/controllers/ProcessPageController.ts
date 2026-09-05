import { BaseController, type Result } from "../core/BaseController";
import type { ProcessPageService } from "../services/ProcessPageService";
import type { ProcessPageData } from "../types/process-page";

export class ProcessPageController extends BaseController {
  constructor(private readonly service: ProcessPageService) {
    super();
  }

  getPage(): Promise<Result<ProcessPageData>> {
    return this.handle(() => this.service.getPage());
  }
}
