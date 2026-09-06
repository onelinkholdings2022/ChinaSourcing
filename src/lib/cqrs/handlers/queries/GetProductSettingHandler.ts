import type { IQueryHandler } from "../../bus";
import type { GetProductSettingQuery } from "../../queries/GetProductSettingQuery";
import type { ProductSettingRepository } from "../../../repositories/strapi/ProductSettingRepository";
import type { ProductSettingData } from "../../../types/products-page";

export class GetProductSettingHandler implements IQueryHandler<GetProductSettingQuery, ProductSettingData> {
  constructor(private readonly repo: ProductSettingRepository) {}

  execute(): Promise<ProductSettingData | null> {
    return this.repo.getSettings();
  }
}
