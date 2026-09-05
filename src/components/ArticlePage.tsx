import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHero } from "@/components/sections/article/ArticleHero";
import { ArticleBody } from "@/components/sections/article/ArticleBody";
import { SubscribeForm } from "@/components/sections/article/SubscribeForm";
import { RelatedResources } from "@/components/sections/article/RelatedResources";
import { DarkCta } from "@/components/sections/DarkCta";
import { getArticle } from "@/data/resources";

const SITE = "https://chinasourcing.co";

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
export function ArticlePage({ slug }: { slug: string }) {
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Header solid />
      <main>
        <ArticleHero
          title={article.title}
          subtitle={article.subtitle}
          facts={article.facts}
        />

        <div className="container mx-auto spacing flex flex-col">
          <ArticleBody
            featuredImage={article.featuredImage}
            featuredAlt={article.featuredAlt}
            toc={article.toc}
            html={article.html}
            shareUrl={`${SITE}${article.path}`}
            title={article.title}
          />

          <SubscribeForm
            tag={article.subscribe.tag}
            heading={article.subscribe.heading}
            body={article.subscribe.body}
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
      <Footer />
    </>
  );
}
