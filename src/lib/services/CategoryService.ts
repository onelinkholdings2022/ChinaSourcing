import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetAllCategoriesQuery } from "../cqrs/queries/GetAllCategoriesQuery";
import type { Category } from "../types/category";

export class CategoryService extends BaseService<QueryBus> {
  getAll(): Promise<Category[] | null> {
    return this.bus.dispatch(new GetAllCategoriesQuery());
  }
}
