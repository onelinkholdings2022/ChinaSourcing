import type { IQueryHandler } from "../../bus";
import type { GetAllCategoriesQuery } from "../../queries/GetAllCategoriesQuery";
import type { CategoryRepository } from "../../../repositories/strapi/CategoryRepository";
import type { Category } from "../../../types/category";

export class GetAllCategoriesHandler implements IQueryHandler<GetAllCategoriesQuery, Category[]> {
  constructor(private readonly repo: CategoryRepository) {}

  execute(): Promise<Category[]> {
    return this.repo.getAll();
  }
}
