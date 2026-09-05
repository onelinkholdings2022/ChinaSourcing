import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetLatestBlogPostsQuery } from "../cqrs/queries/GetLatestBlogPostsQuery";
import type { BlogPost } from "../types/blog-post";

export class BlogPostService extends BaseService<QueryBus> {
  getLatest(limit = 3): Promise<BlogPost[] | null> {
    return this.bus.dispatch(new GetLatestBlogPostsQuery(limit));
  }
}
