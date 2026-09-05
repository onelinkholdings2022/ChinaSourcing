import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Faq } from "@/components/sections/Faq";
import { DarkCta } from "@/components/sections/DarkCta";
import { UspList } from "@/components/sections/UspList";
import { FlowTrackTabs } from "@/components/sections/FlowTrackTabs";
import { VerticalTab } from "@/components/sections/VerticalTab";
import { SimpleCardGrid } from "@/components/sections/SimpleCardGrid";
import { ResourceCards } from "@/components/sections/ResourceCards";
import { ServiceCarousel } from "@/components/sections/ServiceCards";
import { TabbedTestimonial } from "@/components/sections/TabbedTestimonial";
import { ProductHero } from "@/components/sections/product/ProductHero";
import { decodeEntities, getEntry } from "@/lib/content";
import { getServicePage, serviceSlugs } from "@/data/services";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("services", slug);
  return {
    title: entry ? `${decodeEntities(entry.title)} | China Sourcing Co` : "China Sourcing Co",
    description: entry?.excerpt || undefined,
  };
}

/**
 * `/service/<slug>` — one template for all four services, since every one of
 * them renders the identical ten-section sequence.
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <ProductHero hero={page.hero} />
        <SimpleCardGrid
          tag={page.simpleCard.tag}
          heading={page.simpleCard.heading}
          intro={page.simpleCard.intro}
          cards={page.simpleCard.cards}
          align="left"
        />
        <VerticalTab {...page.verticalTab} />
        <FlowTrackTabs
          tag={page.flowTrack.tag}
          heading={page.flowTrack.heading}
          slides={page.flowTrack.slides}
        />
        <UspList
          tag={page.usp.tag}
          heading={page.usp.heading}
          intro={page.usp.intro ?? undefined}
          icon={page.usp.icon}
          image={page.usp.image}
          items={page.usp.items}
        />
        <TabbedTestimonial
          tag={page.testimonials.tag}
          heading={page.testimonials.heading}
          tabs={page.testimonials.tabs}
        />
        <Faq
          tag={page.faq.tag}
          headingLines={page.faq.headingLines}
          email={page.faq.email}
          items={page.faq.items}
        />
        <ResourceCards
          tag={page.resources.tag}
          headingLines={page.resources.headingLines}
          cards={page.resources.cards}
          ctaLabel={page.resources.ctaLabel}
          ctaHref={page.resources.ctaHref}
        />
        <ServiceCarousel
          tag={page.carousel.tag}
          heading={page.carousel.heading}
          intro={page.carousel.intro}
          cards={page.carousel.cards}
          ctaLabel={page.carousel.ctaLabel}
          ctaHref={page.carousel.ctaHref}
        />
        <DarkCta
          tag={page.cta.tag}
          heading={page.cta.heading}
          body={page.cta.body}
          ctaLabel={page.cta.ctaLabel}
          ctaHref={page.cta.ctaHref}
          className={page.cta.sectionClass}
        />
      </main>
      <Footer />
    </>
  );
}
