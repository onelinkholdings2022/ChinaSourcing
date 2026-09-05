import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { reasons, aboutCta, aboutLogos, brandTabs, journey } from "@/data/about";
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

export const metadata = landingMetadata("about-us");

/**
 * `/about-us`, rebuilt as components.
 *
 * Section order is the original's, top to bottom. The header is `solid` here
 * because the hero is on a light background — the transparent variant is for
 * the homepage's dark video hero only.
 */
export default function Page() {
  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <AboutHero />
        <JourneyTimeline
          tag={journey.tag}
          heading={journey.heading}
          ship={journey.ship}
          milestones={journey.milestones}
        />
        <FounderQuote />
        <LogoStrip
          logos={aboutLogos}
          className="logo container text-center lg:py-[80px] py-[60px] pt-0 lg:pt-0"
        />
        <CoreValues />
        <UspList
          tag={reasons.tag}
          heading={reasons.heading}
          intro={reasons.intro}
          icon={reasons.icon}
          image={reasons.image}
          items={reasons.items}
        />
        <TeamSlider />
        <CaseStudySlider />
        <FlowTrackTabs
          tag={brandTabs.tag}
          heading={brandTabs.heading}
          slides={brandTabs.slides}
        />
        <DarkCta
          tag={aboutCta.tag}
          heading={aboutCta.heading}
          body={aboutCta.body}
          ctaLabel={aboutCta.cta}
        />
      </main>
      <Footer />
    </>
  );
}
