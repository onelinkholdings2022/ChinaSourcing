import type { IQuery } from "../bus";
import type { AboutPagePartial } from "../../types/about-page";

export const GET_CLIENT_LOGOS = "about-page/GetClientLogos";

export class GetClientLogosQuery implements IQuery<AboutPagePartial> {
  readonly type = GET_CLIENT_LOGOS;
}
