import type { IQueryHandler } from "../../bus";
import type { GetGlobalQuery } from "../../queries/GetGlobalQuery";
import type { GlobalRepository } from "../../../repositories/strapi/GlobalRepository";
import type { GlobalData } from "../../../types/global";

export class GetGlobalHandler implements IQueryHandler<GetGlobalQuery, GlobalData> {
  constructor(private readonly repo: GlobalRepository) {}

  execute(): Promise<GlobalData | null> {
    return this.repo.getGlobal();
  }
}
