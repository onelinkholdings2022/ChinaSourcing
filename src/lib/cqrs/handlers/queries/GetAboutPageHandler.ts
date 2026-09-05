import type { IQueryHandler } from "../../bus";
import type { GetAboutPageQuery } from "../../queries/GetAboutPageQuery";
import type { AboutPageRepository } from "../../../repositories/strapi/AboutPageRepository";
import type { AboutPageData } from "../../../types/about-page";

export class GetAboutPageHandler implements IQueryHandler<GetAboutPageQuery, AboutPageData> {
  constructor(private readonly repo: AboutPageRepository) {}

  execute(): Promise<AboutPageData | null> {
    return this.repo.getPage();
  }
}
