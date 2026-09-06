import { getMediaUrl } from "../api/media-url";
import { stripHtml } from "./textUtils";
import { buildPartnerTabsView } from "./homeView";
import type { ProductsPageData, ProductData, ProductSettingData } from "../types/products-page";
import type { Partner } from "../types/partner";
import type { Testimonial as TestimonialModel } from "../types/testimonial";
import type { ProductListCard } from "@/components/sections/product/ProductListGrid";
import type { CaseCard } from "@/components/sections/CaseStudySlider";
import type { ProductImageCard, ProductTestimonial, ProductUsp, ProductFaq } from "@/data/products";

const FALLBACK_IMAGE = "/images/blog-fallback.png";

export interface ProductHeroViewData {
  typedPrefix: string;
  typedWords: string[];
  heading: string;
  intro: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: string | null;
  imageAlt: string;
}

export function buildProductsHeroView(page: ProductsPageData): ProductHeroViewData {
  return {
    typedPrefix: page.hero.titlePrefix ?? "",
    typedWords: page.hero.rotatingWords.map((w) => w.text),
    heading: page.hero.title ?? "",
    intro: page.hero.subtitle ?? "",
    ctaLabel: page.hero.ctaButton?.label ?? null,
    ctaHref: page.hero.ctaButton?.url ?? null,
    image: getMediaUrl(page.hero.image),
    imageAlt: page.hero.image?.alternativeText || "China Sourcing Co products",
  };
}

export function buildProductHeroView(product: ProductData): ProductHeroViewData {
  return {
    typedPrefix: "",
    typedWords: [],
    heading: product.title,
    intro: product.heroDescription ?? "",
    ctaLabel: product.heroButton?.label ?? null,
    ctaHref: product.heroButton?.url ?? null,
    image: getMediaUrl(product.heroImage),
    imageAlt: product.heroImage?.alternativeText || product.title,
  };
}

export interface ProductListViewData {
  tag: string;
  heading: string;
  intro: string;
  cards: ProductListCard[];
}

export function buildProductListView(page: ProductsPageData, products: ProductData[]): ProductListViewData {
  return {
    tag: page.productList.tag?.label ?? "",
    heading: page.productList.heading ?? "",
    intro: page.productList.description ?? "",
    cards: products.map((p) => ({
      image: getMediaUrl(p.cardImage) ?? FALLBACK_IMAGE,
      alt: p.title,
      title: p.title,
      body: p.cardDescription ?? "",
      href: `/products/${p.slug}`,
      ctaLabel: page.productList.cardButtonLabel ?? "See Product Detail",
    })),
  };
}

function buildCaseCards(list: import("../types/case-study").CaseStudy[]): CaseCard[] {
  return list.map((c) => ({
    title: c.title,
    body: c.description ?? "",
    href: `/case-studies/${c.slug}`,
    image: getMediaUrl(c.featureImage) ?? FALLBACK_IMAGE,
    alt: `${c.title} case study`,
  }));
}

export interface CaseStudiesSliderViewData {
  tag: string;
  headingLines: string[];
  ctaLabel: string;
  ctaHref: string;
  cards: CaseCard[];
}

export function buildProductsCaseStudiesView(page: ProductsPageData): CaseStudiesSliderViewData {
  const { caseStudies } = page;
  return {
    tag: caseStudies.tag?.label ?? "",
    headingLines: (caseStudies.title ?? "").split("\n").filter(Boolean),
    ctaLabel: caseStudies.ctaButton?.label ?? "See All Case Studies",
    ctaHref: caseStudies.ctaButton?.url ?? "/case-studies",
    cards: buildCaseCards(caseStudies.featuredCaseStudies),
  };
}

export interface LogoStripViewData {
  tag: string;
  heading: string;
  intro: string;
  items: string[];
}

export function buildCertificationsView(page: ProductsPageData): LogoStripViewData {
  const { certifications } = page;
  return {
    tag: certifications.tag?.label ?? "",
    heading: certifications.heading ?? "",
    intro: certifications.description ?? "",
    items: certifications.logos.map((l) => getMediaUrl(l.logo) ?? FALLBACK_IMAGE),
  };
}

export interface PartnersSectionViewData {
  tag: string;
  headingLines: string[];
  tabs: { label: string; logos: string[] }[];
}

export function buildProductsPartnersView(page: ProductsPageData, partners: Partner[]): PartnersSectionViewData {
  const { partners: section } = page;
  return {
    tag: section.tag?.label ?? "",
    headingLines: [section.title, section.titleHighlight].filter((s): s is string => Boolean(s)),
    tabs: buildPartnerTabsView(partners),
  };
}

export interface FaqViewData {
  tag: string;
  headingLines: string[];
  email: string | null;
  items: { question: string; answer: string }[];
}

export function buildProductsFaqView(page: ProductsPageData): FaqViewData {
  const { faq } = page;
  return {
    tag: faq.tag?.label ?? "",
    headingLines: [faq.title, faq.titleHighlight].filter((s): s is string => Boolean(s)),
    email: faq.contactEmail,
    items: faq.items.map((item) => ({ question: item.question ?? "", answer: stripHtml(item.answer) })),
  };
}

export interface DarkCtaViewData {
  sectionClass: string;
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref?: string;
}

export function buildProductsCtaView(page: ProductsPageData): DarkCtaViewData {
  const { ctaBanner } = page;
  return {
    sectionClass: "dark-cta px-5",
    tag: ctaBanner.tag?.label ?? "",
    heading: ctaBanner.heading ?? "",
    body: ctaBanner.subheading ?? "",
    ctaLabel: ctaBanner.button?.label ?? "",
    ctaHref: ctaBanner.button?.url ?? "/contact-us",
  };
}

// ─── Product detail (`/products/<slug>`) ─────────────────────────────────────

export interface ImageCardSectionViewData {
  tag: string;
  heading: string;
  intro: string;
  cards: ProductImageCard[];
}

export function buildProductImageCardView(product: ProductData): ImageCardSectionViewData {
  return {
    tag: product.sourceTag?.label ?? "",
    heading: product.sourceHeading ?? "",
    intro: product.sourceDescription ?? "",
    cards: product.sourceItems.map((item) => ({
      image: getMediaUrl(item.image),
      alt: item.title ?? "",
      title: item.title ?? "",
    })),
  };
}

export interface ProductTestimonialSectionViewData {
  tag: string;
  heading: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  items: ProductTestimonial[];
}

export function buildProductTestimonialView(
  product: ProductData,
  settings: ProductSettingData | null,
  allTestimonials: TestimonialModel[]
): ProductTestimonialSectionViewData {
  const items = allTestimonials.filter((t) => t.product?.id === product.id);
  return {
    tag: settings?.testimonialsTag?.label ?? "",
    heading: product.testimonialsHeading ?? "",
    ctaLabel: settings?.testimonialsButton?.label ?? null,
    ctaHref: settings?.testimonialsButton?.url ?? "/case-studies",
    items: items.map((t) => ({
      image: null,
      alt: t.authorName,
      quote: t.quote ?? "",
      avatar: getMediaUrl(t.authorAvatar ?? t.image),
      name: t.authorName,
      role: t.authorRole ?? "",
    })),
  };
}

export interface ProductUspSectionViewData {
  tag: string;
  heading: string;
  icon: string | null;
  image: string | null;
  items: ProductUsp[];
}

export function buildProductUspView(product: ProductData, settings: ProductSettingData | null): ProductUspSectionViewData {
  const items = product.usps.length > 0 ? product.usps : settings?.defaultUsps ?? [];
  return {
    tag: settings?.uspTag?.label ?? "",
    heading: product.uspHeading ?? "",
    icon: getMediaUrl(items[0]?.icon) ?? FALLBACK_IMAGE,
    image: getMediaUrl(product.uspImage) ?? FALLBACK_IMAGE,
    items: items.map((item) => ({ title: item.title ?? "", body: item.description ?? "" })),
  };
}

export interface ProductFaqSectionViewData {
  tag: string;
  headingLines: string[];
  email: string | null;
  items: ProductFaq[];
}

export function buildProductFaqView(product: ProductData, settings: ProductSettingData | null): ProductFaqSectionViewData {
  return {
    tag: settings?.faqTag?.label ?? "",
    headingLines: [settings?.faqHeading, settings?.faqHeadingHighlight].filter((s): s is string => Boolean(s)),
    email: settings?.faqContactEmail ?? null,
    items: product.faqItems.map((item) => ({ question: item.question ?? "", answer: stripHtml(item.answer) })),
  };
}

export function buildProductCtaView(product: ProductData): DarkCtaViewData {
  const cta = product.ctaBanner;
  return {
    sectionClass: "dark-cta px-5 pb-[120px]",
    tag: cta?.tag?.label ?? "Contact Us Today",
    heading: cta?.heading ?? "Ready to work with a sourcing team that delivers real-world results?",
    body: cta?.subheading ?? "From first quote to final delivery, China Sourcing Co helps you simplify sourcing, reduce risks, and scale with confidence.",
    ctaLabel: cta?.button?.label ?? "Get a Free Quote",
    ctaHref: cta?.button?.url ?? "/contact-us",
  };
}
