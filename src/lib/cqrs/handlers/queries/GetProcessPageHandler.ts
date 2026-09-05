import type { IQueryHandler } from "../../bus";
import type { GetProcessPageQuery } from "../../queries/GetProcessPageQuery";
import type { ProcessPageRepository } from "../../../repositories/strapi/ProcessPageRepository";
import type { ProcessPageData } from "../../../types/process-page";

export class GetProcessPageHandler implements IQueryHandler<GetProcessPageQuery, ProcessPageData> {
  constructor(private readonly repo: ProcessPageRepository) {}

  execute(): Promise<ProcessPageData | null> {
    return this.repo.getPage();
  }
}
