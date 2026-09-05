import type { IQuery } from "../bus";
import type { AboutPageData } from "../../types/about-page";

export const GET_ABOUT_PAGE = "about-page/GetPage";

export class GetAboutPageQuery implements IQuery<AboutPageData> {
  readonly type = GET_ABOUT_PAGE;
}
