import type { Metadata } from "next";
import { ArticlePage } from "@/components/ArticlePage";
import { articleSlugs, getArticle } from "@/data/resources";

/** The 12 downloads, published by the original at `/resource/<slug>`. */
export function generateStaticParams() {
  return articleSlugs("resource");
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

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticlePage slug={slug} />;
}
