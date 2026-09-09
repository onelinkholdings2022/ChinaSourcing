import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DarkCta } from "@/components/sections/DarkCta";
import { UspList } from "@/components/sections/UspList";
import { FlowTrackTabs } from "@/components/sections/FlowTrackTabs";
import { VerticalTab } from "@/components/sections/VerticalTab";
import { ResourceCards } from "@/components/sections/ResourceCards";
import { ServiceList } from "@/components/sections/ServiceCards";
import { CaseStudySlider } from "@/components/sections/CaseStudySlider";
import { ProductHero } from "@/components/sections/product/ProductHero";
import {
  servicesPageController,
  serviceController,
  serviceSettingController,
  globalController,
} from "@/lib";
import {
  buildServicesHeroView,
  buildServicesProcessView,
  buildCategoryShowcaseView,
  buildServicesUspView,
  buildServiceListView,
  buildServicesCaseStudiesView,
  buildServicesResourcesView,
  buildServicesCtaView,
} from "@/lib/views/serviceView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await servicesPageController.getPage();
  return buildPageMetadata(page?.seo, {
    title: page?.hero.title ?? "Services",
    description: page?.hero.description,
    image: getMediaUrl(page?.hero.image),
    path: "/services",
  });
}

/**
 * `/services` — eight sections. Only `service-list` is unique to this page;
 * the rest are the shared components with this page's copy.
 */
export default async function Page() {
  const [pageResult, allResult, settingsResult, globalResult] = await Promise.all([
    servicesPageController.getPage(),
    serviceController.getAll(),
    serviceSettingController.getSettings(),
    globalController.getGlobal(),
  ]);

  const page = pageResult.data;
  const allServices = allResult.data ?? [];
  const settings = settingsResult.data;
  const global = globalResult.data;

  if (!page) {
    return (
      <>
        <Header solid nav={global ? buildNavView(global) : undefined} />
        <main>
          <p className="container py-40 text-center">
            Không tải được nội dung trang Services. Vui lòng thử lại sau.
          </p>
        </main>
        <Footer footer={global ? buildFooterView(global) : undefined} />
      </>
    );
  }

  const hero = buildServicesHeroView(page);
  const flowTrack = buildServicesProcessView(page);
  const verticalTab = buildCategoryShowcaseView(page.categoryShowcase);
  const usp = buildServicesUspView(page);
  const serviceList = buildServiceListView(allServices, settings);
  const caseStudies = buildServicesCaseStudiesView(page);
  const resources = buildServicesResourcesView(page);
  const cta = buildServicesCtaView(page);

  return (
    <>
      <JsonLd seo={page?.seo} siteSeo={global?.defaultSeo} />
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main>
        <ProductHero hero={hero} />
        <FlowTrackTabs tag={flowTrack.tag} heading={flowTrack.heading} slides={flowTrack.slides} />
        <ServiceList cards={serviceList} />
        <VerticalTab
          tag={verticalTab.tag}
          heading={verticalTab.heading}
          intro={verticalTab.intro}
          ctaLabel={verticalTab.ctaLabel}
          ctaHref={verticalTab.ctaHref}
          tabs={verticalTab.tabs}
        />
        <UspList
          tag={usp.tag}
          heading={usp.heading}
          intro={usp.intro ?? undefined}
          icon={usp.icon}
          image={usp.image}
          items={usp.items}
        />
        <CaseStudySlider
          tag={caseStudies.tag}
          headingLines={caseStudies.headingLines}
          cards={caseStudies.cards}
          ctaLabel={caseStudies.ctaLabel}
          ctaHref={caseStudies.ctaHref}
        />
        <ResourceCards
          tag={resources.tag}
          headingLines={resources.headingLines}
          cards={resources.cards}
          ctaLabel={resources.ctaLabel}
          ctaHref={resources.ctaHref}
        />
        <DarkCta
          tag={cta.tag}
          heading={cta.heading}
          body={cta.body}
          ctaLabel={cta.ctaLabel}
          ctaHref={cta.ctaHref}
          className={cta.sectionClass}
        />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
