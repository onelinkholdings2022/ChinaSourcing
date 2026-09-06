import { BaseController, type Result } from "../core/BaseController";
import type { CategoryService } from "../services/CategoryService";
import type { Category } from "../types/category";

export class CategoryController extends BaseController {
  constructor(private readonly service: CategoryService) {
    super();
  }

  getAll(): Promise<Result<Category[]>> {
    return this.handle(() => this.service.getAll());
  }
}
