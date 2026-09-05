import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCaseStudyPage, caseStudySlugs } from "@/data/case-studies";
import { CaseStudyHero } from "@/components/sections/casestudy/CaseStudyHero";
import { CaseStudyArticle } from "@/components/sections/casestudy/CaseStudyArticle";
import { SimpleCardGrid } from "@/components/sections/SimpleCardGrid";
import { CaseStudySlider } from "@/components/sections/CaseStudySlider";
import { DarkCta } from "@/components/sections/DarkCta";

const SITE = "https://chinasourcing.co";

export function generateStaticParams() {
  return caseStudySlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCaseStudyPage(slug);
  return {
    title: page ? `${page.title} | China Sourcing Co` : "China Sourcing Co",
    description: page?.description || undefined,
  };
}

/**
 * `/case-study/<slug>` — one template for all 14.
 *
 * Every case study renders the identical five-section sequence (hero, the
 * dark "What We Do" card grid, the article body, the slider of other studies,
 * the dark CTA), so there is one component tree and the differences are all
 * content in `case-study-pages.json`.
 *
 * The `flex flex-col pb-[120px]` wrapper is the theme's — the trailing 120px is
 * what separates the CTA from the footer, since `.dark-cta` here ships without
 * the `pb-[120px]` the product pages carry.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCaseStudyPage(slug);
  if (!page) notFound();

  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <div className="flex flex-col pb-[120px]">
          <CaseStudyHero
            heading={page.hero.heading}
            intro={page.hero.intro}
            facts={page.hero.meta}
          />
          <SimpleCardGrid
            tag={page.simple.tag}
            heading={page.simple.heading}
            intro={page.simple.intro}
            cards={page.simple.cards}
            align="left"
            columns={4}
          />
          <CaseStudyArticle
            blocks={page.blocks}
            title={page.title}
            shareUrl={`${SITE}/case-study/${page.slug}/`}
          />
          <CaseStudySlider
            variant="dark"
            tag={page.slider.tag}
            headingLines={[page.slider.heading]}
            cards={page.slider.cards}
            ctaLabel={page.slider.ctaLabel}
            ctaHref={page.slider.ctaHref}
          />
          <DarkCta
            tag={page.cta.tag}
            heading={page.cta.heading}
            body={page.cta.body}
            ctaLabel={page.cta.ctaLabel}
            className={page.cta.sectionClass}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
