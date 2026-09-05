import type { IQueryHandler } from "../../bus";
import type { GetAllPartnersQuery } from "../../queries/GetAllPartnersQuery";
import type { PartnerRepository } from "../../../repositories/strapi/PartnerRepository";
import type { Partner } from "../../../types/partner";

export class GetAllPartnersHandler implements IQueryHandler<GetAllPartnersQuery, Partner[]> {
  constructor(private readonly repo: PartnerRepository) {}

  execute(): Promise<Partner[]> {
    return this.repo.getAll();
  }
}
