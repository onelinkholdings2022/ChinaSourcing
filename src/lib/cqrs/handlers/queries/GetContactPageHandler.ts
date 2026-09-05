import type { IQueryHandler } from "../../bus";
import type { GetContactPageQuery } from "../../queries/GetContactPageQuery";
import type { ContactPageRepository } from "../../../repositories/strapi/ContactPageRepository";
import type { ContactPageData } from "../../../types/contact-page";

export class GetContactPageHandler implements IQueryHandler<GetContactPageQuery, ContactPageData> {
  constructor(private readonly repo: ContactPageRepository) {}

  execute(): Promise<ContactPageData | null> {
    return this.repo.getPage();
  }
}
