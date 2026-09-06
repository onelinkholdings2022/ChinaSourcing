import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { blogPostController, resourceSettingController, globalController } from "@/lib";
import { buildBlogPostArticleView } from "@/lib/views/articleView";
import { buildNavView, buildFooterView } from "@/lib/views/globalView";

/**
 * Blog posts sit at the site root (`/some-post-slug`), matching the source
 * permalink structure. The explicit routes (about-us, products, …) take
 * precedence over this catch-all.
 */
export async function generateStaticParams() {
  const result = await blogPostController.getAll();
  return (result.data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await blogPostController.getBySlug(slug);
  const post = result.data;
  return {
    title: post ? `${post.title} | China Sourcing Co` : "China Sourcing Co",
    description: post?.excerpt || undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [postResult, allResult, settingsResult, globalResult] = await Promise.all([
    blogPostController.getBySlug(slug),
    blogPostController.getAll(),
    resourceSettingController.getSettings(),
    globalController.getGlobal(),
  ]);

  const post = postResult.data;
  if (!post) notFound();

  const all = allResult.data ?? [];
  const settings = settingsResult.data;
  const global = globalResult.data;

  const article = buildBlogPostArticleView(post, settings, all);

  return (
    <ArticlePage
      article={article}
      nav={global ? buildNavView(global) : undefined}
      footer={global ? buildFooterView(global) : undefined}
    />
  );
}
