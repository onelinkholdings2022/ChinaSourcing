import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { contactFlowTrack, contactHero } from "@/data/contact";
import { SimpleHero } from "@/components/sections/SimpleHero";
import { ContactInfo } from "@/components/sections/contact/ContactInfo";
import { FlowTrackTabs } from "@/components/sections/FlowTrackTabs";

export const metadata = landingMetadata("contact-us");

/**
 * `/contact-us`, rebuilt as components.
 *
 * Section order is the original's, with one omission: the theme also renders
 * `.book-meeting-form` ("Book your preferred time here and let's get started!",
 * a HubSpot Meetings calendar) between the hero and the contact details. It is
 * dropped here at the owner's request — visitors reach the team through the
 * "Get In Touch" form below instead. `BookMeeting` and `HubspotMeetings` are
 * kept in `src/components/sections/contact/` so the band can be put back by
 * re-adding one element.
 */
export default function Page() {
  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <SimpleHero
          heading={contactHero.heading}
          intro={contactHero.intro}
          image={contactHero.image}
          imageAlt={contactHero.imageAlt}
          gradientId="contact-hero-glow"
        />
        <ContactInfo />
        <FlowTrackTabs
          tag={contactFlowTrack.tag}
          heading={contactFlowTrack.heading}
          slides={contactFlowTrack.slides}
        />
      </main>
      <Footer />
    </>
  );
}
