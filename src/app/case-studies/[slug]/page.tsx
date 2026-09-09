import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CaseStudyHero } from "@/components/sections/casestudy/CaseStudyHero";
import { CaseStudyArticle } from "@/components/sections/casestudy/CaseStudyArticle";
import { SimpleCardGrid } from "@/components/sections/SimpleCardGrid";
import { CaseStudySlider } from "@/components/sections/CaseStudySlider";
import { DarkCta } from "@/components/sections/DarkCta";
import { caseStudyController, caseStudySettingController, globalController } from "@/lib";
import {
  buildCaseStudyHeroView,
  buildCaseStudySimpleView,
  buildCaseStudyBlocksView,
  buildCaseStudyRelatedView,
  buildCaseStudyCtaView,
} from "@/lib/views/caseStudyView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";
import { JsonLd } from "@/components/JsonLd";

const SITE = "https://chinasourcing.co";

export async function generateStaticParams() {
  const result = await caseStudyController.getAll();
  return (result.data ?? []).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: study } = await caseStudyController.getBySlug(slug);
  return buildPageMetadata(study?.seo, {
    title: study?.title ?? "China Sourcing Co",
    description: study?.description,
    image: getMediaUrl(study?.featureImage),
    path: `/${slug}`,
    type: "article",
  });
}

/**
 * `/case-study/<slug>` — one template for all 14.
 *
 * Every case study renders the identical five-section sequence (hero, the
 * dark "What We Do" card grid, the article body, the slider of other studies,
 * the dark CTA), so there is one component tree and the differences are all
 * content from Strapi's `case-study` collection.
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

  const [caseStudyResult, allResult, settingsResult, globalResult] = await Promise.all([
    caseStudyController.getBySlug(slug),
    caseStudyController.getAll(),
    caseStudySettingController.getSettings(),
    globalController.getGlobal(),
  ]);

  const cs = caseStudyResult.data;
  // 404 của site này là "về trang chủ", không phải một trang lỗi — xem
  // `src/proxy.ts`. Proxy chỉ rewrite vào đây khi slug CÓ trong bảng phân
  // giải, nên nhánh này chỉ chạy khi bảng vừa cũ đi (bản ghi vừa bị bỏ
  // publish) hoặc khi ai đó gõ thẳng đường dẫn nội bộ.
  if (!cs) permanentRedirect("/");

  const all = allResult.data ?? [];
  const settings = settingsResult.data;
  const global = globalResult.data;

  const hero = buildCaseStudyHeroView(cs);
  const simple = buildCaseStudySimpleView(cs);
  const blocks = buildCaseStudyBlocksView(cs);
  const related = buildCaseStudyRelatedView(cs, all, settings);
  const cta = buildCaseStudyCtaView(settings);

  return (
    <>
      <JsonLd seo={cs?.seo} siteSeo={global?.defaultSeo} />
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main>
        <div className="flex flex-col pb-[120px]">
          <CaseStudyHero heading={hero.heading} intro={hero.intro} facts={hero.facts} />
          <SimpleCardGrid
            tag={simple.tag}
            heading={simple.heading}
            intro={simple.intro}
            cards={simple.cards}
            /* Khối này của trang case study là 4 cột ở `xl` — xem
               SimpleCardGrid. About và trang service giữ mặc định 3. */
            columns={4}
          />
          <CaseStudyArticle blocks={blocks} title={cs.title} shareUrl={`${SITE}/case-study/${cs.slug}/`} />
          <CaseStudySlider
            variant="dark"
            tag={related.tag}
            headingLines={related.headingLines}
            cards={related.cards}
            ctaLabel={related.ctaLabel}
            ctaHref={related.ctaHref}
          />
          <DarkCta
            tag={cta.tag}
            heading={cta.heading}
            body={cta.body}
            ctaLabel={cta.ctaLabel}
            className={cta.sectionClass}
          />
        </div>
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
