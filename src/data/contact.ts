import type { FlowTrackSlide } from "@/components/sections/FlowTrackTabs";

const IMG = "/images";

/** The HubSpot portal every embed on the site belongs to. */
export const hubspot = {
  portalId: "46681098",
  region: "na1",
  /**
   * "Get In Touch" — Name / Email / Company / Website / Message.
   *
   * The site embeds three different HubSpot forms and they are easy to mix up:
   * this one also backs the header's contact dialog, `e30221f0…` is the
   * footer's email-only newsletter, and `bed6a08e…` is the article paywall's.
   */
  contactFormId: "216cfe97-ca6b-4edd-bcd6-eca85d0d4a5a",
  /** The booking calendar, embedded as an iframe rather than a form. */
  meetingsSrc: "https://meetings-eu1.hubspot.com/developers?embed=true",
};

export const contactHero = {
  heading: "Contact Us",
  intro:
    "Whether you need a quick quote or full sourcing support, our team is here to help.",
  image: `${IMG}/china-sourcing-contact-us.png`,
  imageAlt: "logistic",
};

/**
 * Copy for the `.book-meeting-form` band, which the page no longer renders —
 * removed at the owner's request. Kept beside `BookMeeting` so restoring the
 * section needs no re-scraping.
 */
export const bookMeeting = {
  tag: "Let's Talk",
  heading: "Book your preferred time here and let’s get started!",
  intro: "Let’s connect and discuss how we can support your growth.",
};

export type ContactDetail = {
  icon: string;
  label: string;
  value: string;
  /** `mailto:` / `tel:` — the address block has none and renders as text. */
  href?: string;
};

export const contactInfo = {
  tag: "Get In Touch",
  heading: "We're here to help and answer any questions you may have",
  intro:
    "Discover how we can help your business achieve its supply chain goals with tailored solutions and expert support.",
  details: [
    {
      icon: `${IMG}/mail.svg`,
      label: "Email",
      value: "info@chinasourcing.co",
      href: "mailto:info@chinasourcing.co",
    },
    {
      icon: `${IMG}/phone.svg`,
      label: "Phone",
      value: "(+84)866 360 817",
      href: "tel:(+84)866 360 817",
    },
    {
      icon: `${IMG}/pin.svg`,
      // The theme's own spelling.
      label: "Headquater",
      value:
        "Jinbin Tengyuue Mansion, South Tower, No.49 Huaxia Road, Tianhe District, Guangzhou city, Guangdong Province, China",
    },
  ] satisfies ContactDetail[],
  social: {
    icon: `${IMG}/share.svg`,
    label: "Social",
    links: [
      {
        href: "https://www.linkedin.com/company/onelink-holdings/",
        image: `${IMG}/linkedin-logo.png`,
        alt: "linkedin-logo",
      },
      {
        href: "https://www.facebook.com/onelinkholdings",
        image: `${IMG}/facebook-logo.png`,
        alt: "facebook-logo",
      },
      {
        href: "https://www.instagram.com/onelink_sourcing/",
        image: `${IMG}/instagram-logo-1.png`,
        alt: "instagram-logo",
      },
    ],
  },
};

/**
 * "What Happens Next" — the same `.flow-track` block as About and the service
 * pages.
 *
 * Each slide but the last carries a link to the next one, named after it. Those
 * are `<button class="flow-track-next-tab-btn">` on the original, not anchors —
 * which is exactly how they get missed.
 */
export const contactFlowTrack: { tag: string; heading: string; slides: FlowTrackSlide[] } = {
  tag: "Next Steps",
  heading: "What Happens Next",
  slides: [
    {
      label: "Notification",
      subheading: "We start with",
      title: "Notification",
      paragraphs: [
        "A confirmation email will be sent, and our team will get back to you within 24 hours.",
      ],
      image: `${IMG}/email-notification-1024x798.png`,
      alt: "Guys meeting in the room",
      nextLabel: "Contact",
    },
    {
      label: "Contact",
      subheading: "And Then",
      title: "Contact",
      paragraphs: [
        "A member of our team will reach out to learn more about your requirements and how we can best assist you.",
      ],
      image: `${IMG}/telephone-1024x798.png`,
      alt: "telephone",
      nextLabel: "Discussion",
    },
    {
      label: "Discussion",
      subheading: "After That",
      title: "Discussion",
      paragraphs: [
        "We work with you to create a detailed product requirements brief tailored to your needs.",
      ],
      image: `${IMG}/people-discussing-1024x798.png`,
      alt: "Guys meeting in the room",
      nextLabel: "Quote",
    },
    {
      label: "Quote",
      subheading: "Finally",
      title: "Quote",
      paragraphs: [
        "We’ll provide you with the best options and pricing, helping you make an informed decision.",
      ],
      image: `${IMG}/china-sourcing-quote-1024x798.png`,
      alt: "china sourcing quote",
    },
  ],
};
