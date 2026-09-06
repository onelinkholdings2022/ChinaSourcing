import type { IQuery } from "../bus";
import type { BlogPost } from "../../types/blog-post";

export const GET_ALL_BLOG_POSTS = "blog-post/GetAll";

export class GetAllBlogPostsQuery implements IQuery<BlogPost[]> {
  readonly type = GET_ALL_BLOG_POSTS;
}
