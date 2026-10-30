import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHero } from "@/components/sections/article/ArticleHero";
import { ArticleBody } from "@/components/sections/article/ArticleBody";
import { SubscribeForm } from "@/components/sections/article/SubscribeForm";
import { RelatedResources } from "@/components/sections/article/RelatedResources";
import type { ArticleViewData } from "@/lib/views/articleView";
import type { NavViewItem, FooterViewData } from "@/lib/views/globalView";

/**
 * Một khuôn cho mọi bài viết — 12 resource tải về và toàn bộ blog post.
 *
 * Bố cục theo thiết kế "CNS Blog Layout Redesign" v2 (desktop + mobile 390px):
 *   hero canh giữa → thân bài 3 cột (mục lục dính | bài 720px | cột trống)
 *   → dải "Explore More Related Resources".
 *
 * Logic khoá bài GIỮ NGUYÊN như cũ: bài `gated` bên CMS thì thân bài bị cắt
 * sau một đoạn + lớp mờ "Please subscribe to see the detail", và form subscribe
 * hiện ngay dưới bài; điền email (hoặc đăng ký newsletter ở footer) là mở khoá
 * vĩnh viễn trên máy đó (`useSubscribed`). Bài không `gated` thì không có gì
 * trong số đó.
 *
 * Dải CTA tối cuối trang thì bỏ theo thiết kế — CTA giờ là các khung "CTA Box"
 * biên tập viên tự chèn vào giữa bài từ CKEditor.
 */
export function ArticlePage({
  article,
  nav,
  footer,
}: {
  article: ArticleViewData;
  nav?: NavViewItem[];
  footer?: FooterViewData;
}) {
  return (
    <>
      <Header solid nav={nav} />
      <main>
        <ArticleHero
          title={article.title}
          category={article.category}
          publishedShort={article.publishedShort}
          publishedLong={article.publishedLong}
          readingTime={article.readingTime}
          summary={article.summary}
          image={article.featuredImage}
          imageAlt={article.featuredAlt}
        />

        <ArticleBody
          toc={article.toc}
          blocks={article.blocks}
          ctas={article.ctas}
          previews={article.previews}
          shareUrl={article.shareUrl}
          title={article.title}
          gated={article.gated}
        />

        {/* Tự ẩn khi bài không khoá hoặc đã đăng ký — logic cũ của theme. */}
        <div className="mx-auto max-w-[1264px] -mt-10 md:-mt-16 mb-12 md:mb-24 px-4 md:px-6 [&:not(:has(section))]:hidden">
          <SubscribeForm
            tag={article.subscribe.tag}
            heading={article.subscribe.heading}
            body={article.subscribe.body}
            gated={article.gated}
          />
        </div>

        {article.related.cards.length > 0 && (
          <RelatedResources
            tag={article.related.tag}
            heading={article.related.heading}
            cards={article.related.cards}
          />
        )}
      </main>
      <Footer footer={footer} />
    </>
  );
}
