import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { blogPostController, resourceSettingController, globalController } from "@/lib";
import { buildBlogPostArticleView } from "@/lib/views/articleView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";
import { stripHtml, trimExcerpt } from "@/lib/views/textUtils";
import { JsonLd } from "@/components/JsonLd";

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
  const { data: post } = await blogPostController.getBySlug(slug);
  return buildPageMetadata(post?.seo, {
    title: post?.title ?? "China Sourcing Co",
    description: trimExcerpt(stripHtml(post?.excerpt ?? post?.content ?? ""), 160) || undefined,
    image: getMediaUrl(post?.featureImage),
    path: `/${slug}`,
    type: "article",
    publishedTime: post?.publishedDate,
  });
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
  // 404 của site này là "về trang chủ", không phải một trang lỗi — xem
  // `src/proxy.ts`. Proxy chỉ rewrite vào đây khi slug CÓ trong bảng phân
  // giải, nên nhánh này chỉ chạy khi bảng vừa cũ đi (bản ghi vừa bị bỏ
  // publish) hoặc khi ai đó gõ thẳng đường dẫn nội bộ.
  if (!post) permanentRedirect("/");

  const all = allResult.data ?? [];
  const settings = settingsResult.data;
  const global = globalResult.data;

  const article = buildBlogPostArticleView(post, settings, all);

  return (
    <>
      <JsonLd seo={post?.seo} siteSeo={global?.defaultSeo} />
      <ArticlePage
        article={article}
        nav={global ? buildNavView(global) : undefined}
        footer={global ? buildFooterView(global) : undefined}
      />
    </>
  );
}
