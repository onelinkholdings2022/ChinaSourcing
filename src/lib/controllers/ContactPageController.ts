import { BaseController, type Result } from "../core/BaseController";
import type { ContactPageService } from "../services/ContactPageService";
import type { ContactPageData } from "../types/contact-page";

export class ContactPageController extends BaseController {
  constructor(private readonly service: ContactPageService) {
    super();
  }

  getPage(): Promise<Result<ContactPageData>> {
    return this.handle(() => this.service.getPage());
  }
}
