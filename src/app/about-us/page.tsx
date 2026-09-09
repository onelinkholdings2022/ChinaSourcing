import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { JourneyTimeline } from "@/components/sections/JourneyTimeline";
import { FounderQuote } from "@/components/sections/about/FounderQuote";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { CoreValues } from "@/components/sections/about/CoreValues";
import { UspList } from "@/components/sections/UspList";
import { TeamSlider } from "@/components/sections/about/TeamSlider";
import { CaseStudySlider } from "@/components/sections/CaseStudySlider";
import { FlowTrackTabs } from "@/components/sections/FlowTrackTabs";
import { DarkCta } from "@/components/sections/DarkCta";
import { aboutPageController, teamMemberController, caseStudyController, globalController } from "@/lib";
import {
  buildAboutHeroView,
  buildJourneyView,
  buildFounderQuoteView,
  buildAboutLogosView,
  buildCoreValuesView,
  buildBenefitsView,
  buildTeamView,
  buildAboutCaseStudiesView,
  buildBrandCultureView,
  buildCtaBannerView,
} from "@/lib/views/aboutView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await aboutPageController.getPage();
  return buildPageMetadata(page?.seo, {
    title: page?.hero.heading ?? "About Us",
    description: page?.hero.description,
    image: getMediaUrl(page?.hero.image),
    path: "/about-us",
  });
}

/**
 * `/about-us`, rebuilt as components.
 *
 * Section order is the original's, top to bottom. The header is `solid` here
 * because the hero is on a light background — the transparent variant is for
 * the homepage's dark video hero only.
 */
export default async function Page() {
  const [pageResult, membersResult, caseStudiesResult, globalResult] = await Promise.all([
    aboutPageController.getPage(),
    teamMemberController.getFeatured(),
    caseStudyController.getFeatured(),
    globalController.getGlobal(),
  ]);

  const page = pageResult.data;
  const members = membersResult.data ?? [];
  const caseStudies = caseStudiesResult.data ?? [];
  const global = globalResult.data;

  if (!page) {
    return (
      <>
        <Header solid nav={global ? buildNavView(global) : undefined} />
        <main>
          <p className="container py-40 text-center">
            Không tải được nội dung trang About Us. Vui lòng thử lại sau.
          </p>
        </main>
        <Footer footer={global ? buildFooterView(global) : undefined} />
      </>
    );
  }

  const journey = buildJourneyView(page);
  const team = buildTeamView(page, members);
  const caseStudiesView = buildAboutCaseStudiesView(page, caseStudies);
  const brandCulture = buildBrandCultureView(page);
  const ctaBanner = buildCtaBannerView(page);

  return (
    <>
      <JsonLd seo={page?.seo} siteSeo={global?.defaultSeo} />
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main>
        <AboutHero {...buildAboutHeroView(page)} />
        <JourneyTimeline
          tag={journey.tag}
          heading={journey.heading}
          ship={journey.ship}
          milestones={journey.milestones}
        />
        <FounderQuote {...buildFounderQuoteView(page)} />
        <LogoStrip
          logos={buildAboutLogosView(page)}
          className="logo container text-center lg:py-[80px] py-[60px] pt-0 lg:pt-0"
        />
        <CoreValues {...buildCoreValuesView(page)} />
        <UspList {...buildBenefitsView(page)} />
        <TeamSlider
          tag={team.tag}
          heading={team.heading}
          intro={team.intro}
          members={team.members}
          localHeading={team.localHeading}
          offices={team.offices}
        />
        <CaseStudySlider
          tag={caseStudiesView.tag}
          headingLines={caseStudiesView.headingLines}
          cards={caseStudiesView.cards}
          ctaLabel={caseStudiesView.ctaLabel}
          ctaHref={caseStudiesView.ctaHref}
        />
        <FlowTrackTabs
          tag={brandCulture.tag}
          heading={brandCulture.heading}
          slides={brandCulture.slides}
        />
        <DarkCta
          tag={ctaBanner.tag}
          heading={ctaBanner.heading}
          body={ctaBanner.body}
          ctaLabel={ctaBanner.ctaLabel}
        />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
