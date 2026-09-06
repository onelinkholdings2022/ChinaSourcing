import { BaseController, type Result } from "../core/BaseController";
import type { BlogPostService } from "../services/BlogPostService";
import type { BlogPost } from "../types/blog-post";

export class BlogPostController extends BaseController {
  constructor(private readonly service: BlogPostService) {
    super();
  }

  getLatest(limit = 3): Promise<Result<BlogPost[]>> {
    return this.handle(() => this.service.getLatest(limit));
  }

  getAll(): Promise<Result<BlogPost[]>> {
    return this.handle(() => this.service.getAll());
  }

  getBySlug(slug: string): Promise<Result<BlogPost>> {
    return this.handle(() => this.service.getBySlug(slug));
  }
}
