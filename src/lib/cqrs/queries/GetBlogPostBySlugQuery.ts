import type { IQuery } from "../bus";
import type { BlogPost } from "../../types/blog-post";

export const GET_BLOG_POST_BY_SLUG = "blog-post/GetBySlug";

export class GetBlogPostBySlugQuery implements IQuery<BlogPost> {
  readonly type = GET_BLOG_POST_BY_SLUG;
  constructor(readonly slug: string) {}
}
