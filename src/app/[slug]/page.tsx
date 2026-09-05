import type { Metadata } from "next";
import { ArticlePage } from "@/components/ArticlePage";
import { articleSlugs, getArticle } from "@/data/resources";

/**
 * Blog posts sit at the site root (`/some-post-slug`), matching the source
 * permalink structure. The explicit routes (about-us, products, …) take
 * precedence over this catch-all.
 */
export function generateStaticParams() {
  return articleSlugs("post");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return {
    title: article ? `${article.title} | China Sourcing Co` : "China Sourcing Co",
    description: article?.subtitle || undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticlePage slug={slug} />;
}
