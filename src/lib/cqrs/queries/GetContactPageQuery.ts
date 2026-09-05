import type { IQuery } from "../bus";
import type { ContactPageData } from "../../types/contact-page";

export const GET_CONTACT_PAGE = "contact-page/GetPage";

export class GetContactPageQuery implements IQuery<ContactPageData> {
  readonly type = GET_CONTACT_PAGE;
}
