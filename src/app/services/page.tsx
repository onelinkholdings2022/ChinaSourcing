import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { DarkCta } from "@/components/sections/DarkCta";
import { UspList } from "@/components/sections/UspList";
import { FlowTrackTabs } from "@/components/sections/FlowTrackTabs";
import { VerticalTab } from "@/components/sections/VerticalTab";
import { ResourceCards } from "@/components/sections/ResourceCards";
import { ServiceList } from "@/components/sections/ServiceCards";
import { CaseStudySlider } from "@/components/sections/CaseStudySlider";
import { ProductHero } from "@/components/sections/product/ProductHero";
import { servicesIndex } from "@/data/services";

export const metadata = landingMetadata("services");

/**
 * `/services` — eight sections. Only `service-list` is unique to this page;
 * the rest are the shared components with this page's copy.
 */
export default function Page() {
  const { hero, flowTrack, serviceList, verticalTab, usp, resources, cta } =
    servicesIndex;

  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <ProductHero hero={hero} />
        <FlowTrackTabs
          tag={flowTrack.tag}
          heading={flowTrack.heading}
          slides={flowTrack.slides}
        />
        <ServiceList cards={serviceList.cards} />
        <VerticalTab {...verticalTab} />
        <UspList
          tag={usp.tag}
          heading={usp.heading}
          intro={usp.intro ?? undefined}
          icon={usp.icon}
          image={usp.image}
          items={usp.items}
        />
        <CaseStudySlider />
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
      <Footer />
    </>
  );
}
