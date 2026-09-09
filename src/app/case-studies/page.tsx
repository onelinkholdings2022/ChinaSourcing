import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SimpleHero } from "@/components/sections/SimpleHero";
import { CaseStudyList } from "@/components/sections/CaseStudyList";
import { UspList } from "@/components/sections/UspList";
import { CarouselTestimonial } from "@/components/sections/CarouselTestimonial";
import { DarkCta } from "@/components/sections/DarkCta";
import { caseStudiesPageController, caseStudyController, globalController } from "@/lib";
import {
  buildCaseStudiesHeroView,
  buildCaseStudiesListView,
  buildCaseStudyCardsView,
  buildCaseStudiesUspView,
  buildCaseStudiesTestimonialsView,
  buildCaseStudiesCtaView,
} from "@/lib/views/caseStudyView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await caseStudiesPageController.getPage();
  return buildPageMetadata(page?.seo, {
    title: page?.hero.heading ?? "Case Studies",
    description: page?.hero.description,
    image: getMediaUrl(page?.hero.image),
    path: "/case-studies",
  });
}

/**
 * `/case-studies`, rebuilt as components.
 *
 * Section order is the original's, with one omission: the theme also renders a
 * `.featured-case-studies` band ("The Real Story Behind the Project", a 2x2
 * mosaic of three studies) between the list and the USPs. It is dropped here at
 * the owner's request — the three studies it promotes are all in the grid
 * directly above it.
 */
export default async function Page() {
  const [pageResult, allResult, globalResult] = await Promise.all([
    caseStudiesPageController.getPage(),
    caseStudyController.getAll(),
    globalController.getGlobal(),
  ]);

  const page = pageResult.data;
  const all = allResult.data ?? [];
  const global = globalResult.data;

  if (!page) {
    return (
      <>
        <Header solid nav={global ? buildNavView(global) : undefined} />
        <main>
          <p className="container py-40 text-center">
            Không tải được nội dung trang Case Studies. Vui lòng thử lại sau.
          </p>
        </main>
        <Footer footer={global ? buildFooterView(global) : undefined} />
      </>
    );
  }

  const hero = buildCaseStudiesHeroView(page);
  const list = buildCaseStudiesListView(page, all);
  const cards = buildCaseStudyCardsView(all);
  const usp = buildCaseStudiesUspView(page);
  const testimonials = buildCaseStudiesTestimonialsView(page);
  const cta = buildCaseStudiesCtaView(page);

  return (
    <>
      <JsonLd seo={page?.seo} siteSeo={global?.defaultSeo} />
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main>
        <SimpleHero
          heading={hero.heading}
          intro={hero.intro}
          image={hero.image}
          imageAlt={hero.imageAlt}
          gradientId="case-studies-hero-glow"
        />
        <CaseStudyList
          tag={list.tag}
          heading={list.heading}
          cards={cards}
          perPage={list.perPage}
          filters={list.filters}
        />
        <UspList
          tag={usp.tag}
          heading={usp.heading}
          intro={usp.intro}
          icon={usp.icon}
          image={usp.image}
          items={usp.items}
        />
        <CarouselTestimonial
          tag={testimonials.tag}
          heading={testimonials.heading}
          items={testimonials.items}
        />
        <DarkCta
          tag={cta.tag}
          heading={cta.heading}
          body={cta.body}
          ctaLabel={cta.ctaLabel}
          className={cta.sectionClass}
        />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
