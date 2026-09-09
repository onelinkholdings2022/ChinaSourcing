import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { resourceController, resourceSettingController, globalController } from "@/lib";
import { buildResourceArticleView } from "@/lib/views/articleView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";
import { stripHtml, trimExcerpt } from "@/lib/views/textUtils";
import { JsonLd } from "@/components/JsonLd";

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
  const { data: resource } = await resourceController.getBySlug(slug);
  return buildPageMetadata(resource?.seo, {
    title: resource?.title ?? "China Sourcing Co",
    description: trimExcerpt(stripHtml(resource?.content ?? ""), 160) || undefined,
    image: getMediaUrl(resource?.featureImage),
    path: `/${slug}`,
    type: "article",
    publishedTime: resource?.publishedDate,
  });
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
  // 404 của site này là "về trang chủ", không phải một trang lỗi — xem
  // `src/proxy.ts`. Proxy chỉ rewrite vào đây khi slug CÓ trong bảng phân
  // giải, nên nhánh này chỉ chạy khi bảng vừa cũ đi (bản ghi vừa bị bỏ
  // publish) hoặc khi ai đó gõ thẳng đường dẫn nội bộ.
  if (!resource) permanentRedirect("/");

  const all = allResult.data ?? [];
  const settings = settingsResult.data;
  const global = globalResult.data;

  const article = buildResourceArticleView(resource, settings, all);

  return (
    <>
      <JsonLd seo={resource?.seo} siteSeo={global?.defaultSeo} />
      <ArticlePage
        article={article}
        nav={global ? buildNavView(global) : undefined}
        footer={global ? buildFooterView(global) : undefined}
      />
    </>
  );
}
