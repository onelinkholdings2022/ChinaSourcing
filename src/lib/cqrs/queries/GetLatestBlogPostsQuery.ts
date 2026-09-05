import type { IQuery } from "../bus";
import type { BlogPost } from "../../types/blog-post";

export const GET_LATEST_BLOG_POSTS = "blog-post/GetLatest";

export class GetLatestBlogPostsQuery implements IQuery<BlogPost[]> {
  readonly type = GET_LATEST_BLOG_POSTS;
  constructor(readonly limit = 3) {}
}
