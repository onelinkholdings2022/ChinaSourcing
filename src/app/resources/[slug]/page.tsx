import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { resourceController, resourceSettingController, globalController } from "@/lib";
import { buildResourceArticleView } from "@/lib/views/articleView";
import { buildNavView, buildFooterView } from "@/lib/views/globalView";

/** The 12 downloads, published by the original at `/resource/<slug>`. */
export async function generateStaticParams() {
  const result = await resourceController.getAll();
  return (result.data ?? []).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await resourceController.getBySlug(slug);
  const resource = result.data;
  return {
    title: resource ? `${resource.title} | China Sourcing Co` : "China Sourcing Co",
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [resourceResult, allResult, settingsResult, globalResult] = await Promise.all([
    resourceController.getBySlug(slug),
    resourceController.getAll(),
    resourceSettingController.getSettings(),
    globalController.getGlobal(),
  ]);

  const resource = resourceResult.data;
  if (!resource) notFound();

  const all = allResult.data ?? [];
  const settings = settingsResult.data;
  const global = globalResult.data;

  const article = buildResourceArticleView(resource, settings, all);

  return (
    <ArticlePage
      article={article}
      nav={global ? buildNavView(global) : undefined}
      footer={global ? buildFooterView(global) : undefined}
    />
  );
}
