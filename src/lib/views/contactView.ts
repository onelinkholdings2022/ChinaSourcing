import { getMediaUrl } from "../api/media-url";
import type { ContactPageData } from "../types/contact-page";
import type {
  ContactDetailCard,
  ContactSocial,
  ContactHubspotForm,
} from "@/components/sections/contact/ContactInfo";
import type { FlowTrackSlide } from "@/components/sections/FlowTrackTabs";

const FALLBACK_IMAGE = "/images/blog-fallback.png";

export interface ContactHeroViewData {
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
}

export function buildContactHeroView(data: ContactPageData): ContactHeroViewData {
  return {
    heading: data.hero.heading ?? "",
    intro: data.hero.description ?? "",
    image: getMediaUrl(data.hero.image) ?? FALLBACK_IMAGE,
    imageAlt: data.hero.image?.alternativeText || "China Sourcing Co logistics",
  };
}

export interface ContactInfoViewData {
  tag: string;
  heading: string;
  intro: string;
  details: ContactDetailCard[];
  social: ContactSocial;
  form: ContactHubspotForm;
}

export function buildContactInfoView(data: ContactPageData): ContactInfoViewData {
  const { getInTouch } = data;
  return {
    tag: getInTouch.tag?.label ?? "",
    heading: getInTouch.heading ?? "",
    intro: getInTouch.description ?? "",
    details: getInTouch.infoItems.map((item) => ({
      icon: getMediaUrl(item.icon) ?? FALLBACK_IMAGE,
      label: item.label ?? "",
      value: item.value ?? "",
      href: item.href ?? undefined,
    })),
    social: {
      icon: getMediaUrl(getInTouch.socialLinks[0]?.icon) ?? FALLBACK_IMAGE,
      label: getInTouch.socialLabel ?? "Social",
      links: getInTouch.socialLinks.map((link) => ({
        href: link.url ?? "",
        image: getMediaUrl(link.icon) ?? FALLBACK_IMAGE,
        alt: link.name ?? "",
      })),
    },
    form: {
      portalId: getInTouch.form?.portalId ?? "",
      formId: getInTouch.form?.formId ?? "",
      region: getInTouch.form?.region ?? "na1",
    },
  };
}

export interface ContactFlowTrackViewData {
  tag: string;
  heading: string;
  slides: FlowTrackSlide[];
}

export function buildContactFlowTrackView(data: ContactPageData): ContactFlowTrackViewData {
  const { whatHappensNext } = data;
  return {
    tag: whatHappensNext.tag?.label ?? "",
    heading: whatHappensNext.heading ?? "",
    slides: whatHappensNext.steps.map((step, i) => ({
      // CMS field names are misleading: `label` holds the eyebrow phrase
      // ("We start with", "And Then"...) and `title` holds the step's actual
      // name ("Notification", "Contact"...) — the tab bar and the "next"
      // link both show the step name, not the eyebrow. Verified against the
      // live site's rendered DOM and its Strapi data.
      label: step.title ?? "",
      subheading: step.label ?? "",
      title: step.title ?? "",
      paragraphs: (step.description ?? "").split(/\n{2,}/).filter(Boolean),
      image: getMediaUrl(step.image) ?? FALLBACK_IMAGE,
      alt: step.title ?? "",
      nextLabel: whatHappensNext.steps[i + 1]?.title ?? undefined,
    })),
  };
}
