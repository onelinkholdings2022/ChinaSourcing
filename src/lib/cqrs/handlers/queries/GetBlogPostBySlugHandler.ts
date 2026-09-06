import type { IQueryHandler } from "../../bus";
import type { GetBlogPostBySlugQuery } from "../../queries/GetBlogPostBySlugQuery";
import type { BlogPostRepository } from "../../../repositories/strapi/BlogPostRepository";
import type { BlogPost } from "../../../types/blog-post";

export class GetBlogPostBySlugHandler implements IQueryHandler<GetBlogPostBySlugQuery, BlogPost> {
  constructor(private readonly repo: BlogPostRepository) {}

  execute(query: GetBlogPostBySlugQuery): Promise<BlogPost | null> {
    return this.repo.getBySlug(query.slug);
  }
}
