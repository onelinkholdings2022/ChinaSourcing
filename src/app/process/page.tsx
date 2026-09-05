import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { Faq } from "@/components/sections/Faq";
import { DarkCta } from "@/components/sections/DarkCta";
import { UspList } from "@/components/sections/UspList";
import { JourneyTimeline } from "@/components/sections/JourneyTimeline";
import { ProductHero } from "@/components/sections/product/ProductHero";
import { processPage } from "@/data/process";

export const metadata = landingMetadata("process");

/**
 * `/process` — five sections, all of them components this project already had.
 * The timeline is the same pinned GSAP block as About's "From Vision to
 * Impact", here with eight steps and a "Step N" label per panel.
 */
export default function Page() {
  const { hero, timeline, usp, faq, cta } = processPage;

  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <ProductHero hero={hero} />
        <JourneyTimeline
          tag={timeline.tag}
          heading={timeline.heading}
          intro={timeline.intro}
          ship={timeline.ship}
          milestones={timeline.milestones}
        />
        <UspList
          tag={usp.tag}
          heading={usp.heading}
          intro={usp.intro ?? undefined}
          icon={usp.icon}
          image={usp.image}
          items={usp.items}
        />
        <Faq
          tag={faq.tag}
          headingLines={faq.headingLines}
          email={faq.email}
          items={faq.items}
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
