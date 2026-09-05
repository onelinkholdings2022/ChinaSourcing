import processJson from "@/data/content/process-page.json";
import type { Milestone } from "@/components/sections/JourneyTimeline";
import type { UspListItem } from "@/components/sections/UspList";

/**
 * `/process` — five sections: hero, the pinned timeline, usp-list, faq, dark-cta.
 *
 * Every one of them is a component that already existed, so this page added no
 * new sections — only the generalisation of `JourneyTimeline`, which About and
 * this page now share. The timeline here runs eight steps rather than six and
 * adds a "Step N" label above each panel title.
 */
export type ProcessPage = {
  hero: {
    typedPrefix: string;
    typedWords: string[];
    heading: string;
    intro: string;
    ctaLabel: string | null;
    ctaHref: string | null;
    image: string | null;
    imageAlt: string;
  };
  timeline: {
    tag: string;
    heading: string;
    intro: string;
    ship: string | null;
    milestones: Milestone[];
  };
  usp: {
    tag: string;
    heading: string;
    intro: string | null;
    icon: string | null;
    image: string | null;
    items: UspListItem[];
  };
  faq: {
    tag: string;
    headingLines: string[];
    email: string | null;
    items: { question: string; answer: string }[];
  };
  cta: {
    sectionClass: string;
    tag: string;
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

export const processPage = processJson as ProcessPage;
