import type { IQueryHandler } from "../../bus";
import type { GetLatestBlogPostsQuery } from "../../queries/GetLatestBlogPostsQuery";
import type { BlogPostRepository } from "../../../repositories/strapi/BlogPostRepository";
import type { BlogPost } from "../../../types/blog-post";

export class GetLatestBlogPostsHandler implements IQueryHandler<GetLatestBlogPostsQuery, BlogPost[]> {
  constructor(private readonly repo: BlogPostRepository) {}

  execute(query: GetLatestBlogPostsQuery): Promise<BlogPost[]> {
    return this.repo.getLatest(query.limit);
  }
}
