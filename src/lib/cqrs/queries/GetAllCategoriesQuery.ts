import type { IQuery } from "../bus";
import type { Category } from "../../types/category";

export const GET_ALL_CATEGORIES = "category/GetAll";

export class GetAllCategoriesQuery implements IQuery<Category[]> {
  readonly type = GET_ALL_CATEGORIES;
}
