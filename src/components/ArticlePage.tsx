import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHero } from "@/components/sections/article/ArticleHero";
import { ArticleBody } from "@/components/sections/article/ArticleBody";
import { SubscribeForm } from "@/components/sections/article/SubscribeForm";
import { RelatedResources } from "@/components/sections/article/RelatedResources";
import { DarkCta } from "@/components/sections/DarkCta";
import type { ArticleViewData } from "@/lib/views/articleView";
import type { NavViewItem, FooterViewData } from "@/lib/views/globalView";

/**
 * One template for every editor-authored article — the 12 `/resource/<slug>`
 * downloads and the 129 blog posts at the site root. The theme renders both
 * from the same PHP template and so does this.
 *
 * Note where the sections sit: the subscribe form, the related row and the dark
 * CTA are all *inside* the `container mx-auto spacing flex flex-col` wrapper,
 * not siblings of it. That is why the CTA is 1448px wide rather than bleeding
 * to the viewport edges the way it does on every other page.
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
          subtitle={article.subtitle}
          facts={article.facts}
          summary={article.summary}
        />

        {/* `min-[1028px]:pt-20`: hạ đệm TRÊN của khối thân bài từ 120px xuống
            80px theo yêu cầu — ô Summary đứng ngay trên nó nên 120px đọc ra như
            một quãng đứt. Dùng đúng mốc 1028px của `.spacing` chứ không phải
            `lg:` (1024px), không thì ở dải 1024-1027 utility này lại ĐỘI đệm
            40px của `.spacing` lên 80. Đệm DƯỚI giữ nguyên 120px. */}
        <div className="container mx-auto spacing min-[1028px]:pt-20 flex flex-col">
          <ArticleBody
            featuredImage={article.featuredImage}
            featuredAlt={article.featuredAlt}
            toc={article.toc}
            html={article.html}
            shareUrl={article.shareUrl}
            title={article.title}
            gated={article.gated}
          />

          <SubscribeForm
            tag={article.subscribe.tag}
            heading={article.subscribe.heading}
            body={article.subscribe.body}
            gated={article.gated}
          />

          <RelatedResources
            tag={article.related.tag}
            heading={article.related.heading}
            cards={article.related.cards}
            ctaLabel={article.related.ctaLabel}
            ctaHref={article.related.ctaHref}
          />

          <DarkCta
            tag={article.cta.tag}
            heading={article.cta.heading}
            body={article.cta.body}
            ctaLabel={article.cta.ctaLabel}
            className={article.cta.sectionClass}
          />
        </div>
      </main>
      <Footer footer={footer} />
    </>
  );
}
