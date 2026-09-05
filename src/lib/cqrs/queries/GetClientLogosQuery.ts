import type { IQuery } from "../bus";
import type { AboutPageData } from "../../types/about-page";

export const GET_CLIENT_LOGOS = "about-page/GetClientLogos";

export class GetClientLogosQuery implements IQuery<AboutPageData> {
  readonly type = GET_CLIENT_LOGOS;
}
