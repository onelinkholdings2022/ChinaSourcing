import type { IQueryHandler } from "../../bus";
import type { GetClientLogosQuery } from "../../queries/GetClientLogosQuery";
import type { AboutPageRepository } from "../../../repositories/strapi/AboutPageRepository";
import type { AboutPagePartial } from "../../../types/about-page";

export class GetClientLogosHandler implements IQueryHandler<GetClientLogosQuery, AboutPagePartial> {
  constructor(private readonly repo: AboutPageRepository) {}

  execute(): Promise<AboutPagePartial | null> {
    return this.repo.getClientLogos();
  }
}
