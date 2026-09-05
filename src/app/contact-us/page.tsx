import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { SimpleHero } from "@/components/sections/SimpleHero";
import { ContactInfo } from "@/components/sections/contact/ContactInfo";
import { FlowTrackTabs } from "@/components/sections/FlowTrackTabs";
import { contactPageController, globalController } from "@/lib";
import {
  buildContactHeroView,
  buildContactInfoView,
  buildContactFlowTrackView,
} from "@/lib/views/contactView";
import { buildNavView, buildFooterView } from "@/lib/views/globalView";

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
export default async function Page() {
  const [pageResult, globalResult] = await Promise.all([
    contactPageController.getPage(),
    globalController.getGlobal(),
  ]);

  const page = pageResult.data;
  const global = globalResult.data;

  if (!page) {
    return (
      <>
        <Header solid nav={global ? buildNavView(global) : undefined} />
        <main>
          <p className="container py-40 text-center">
            Không tải được nội dung trang Contact Us. Vui lòng thử lại sau.
          </p>
        </main>
        <Footer footer={global ? buildFooterView(global) : undefined} />
      </>
    );
  }

  const hero = buildContactHeroView(page);
  const info = buildContactInfoView(page);
  const flowTrack = buildContactFlowTrackView(page);

  return (
    <>
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main className="pt-28 lg:pt-32">
        <SimpleHero
          heading={hero.heading}
          intro={hero.intro}
          image={hero.image}
          imageAlt={hero.imageAlt}
          gradientId="contact-hero-glow"
        />
        <ContactInfo
          tag={info.tag}
          heading={info.heading}
          intro={info.intro}
          details={info.details}
          social={info.social}
          form={info.form}
        />
        <FlowTrackTabs
          tag={flowTrack.tag}
          heading={flowTrack.heading}
          slides={flowTrack.slides}
        />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
