import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetLatestBlogPostsQuery } from "../cqrs/queries/GetLatestBlogPostsQuery";
import { GetAllBlogPostsQuery } from "../cqrs/queries/GetAllBlogPostsQuery";
import { GetBlogPostBySlugQuery } from "../cqrs/queries/GetBlogPostBySlugQuery";
import type { BlogPost } from "../types/blog-post";

export class BlogPostService extends BaseService<QueryBus> {
  getLatest(limit = 3): Promise<BlogPost[] | null> {
    return this.bus.dispatch(new GetLatestBlogPostsQuery(limit));
  }

  getAll(): Promise<BlogPost[] | null> {
    return this.bus.dispatch(new GetAllBlogPostsQuery());
  }

  getBySlug(slug: string): Promise<BlogPost | null> {
    return this.bus.dispatch(new GetBlogPostBySlugQuery(slug));
  }
}
