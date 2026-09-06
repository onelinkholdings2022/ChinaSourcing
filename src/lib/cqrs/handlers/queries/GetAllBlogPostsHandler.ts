import type { IQueryHandler } from "../../bus";
import type { GetAllBlogPostsQuery } from "../../queries/GetAllBlogPostsQuery";
import type { BlogPostRepository } from "../../../repositories/strapi/BlogPostRepository";
import type { BlogPost } from "../../../types/blog-post";

export class GetAllBlogPostsHandler implements IQueryHandler<GetAllBlogPostsQuery, BlogPost[]> {
  constructor(private readonly repo: BlogPostRepository) {}

  execute(): Promise<BlogPost[]> {
    return this.repo.getAll();
  }
}
