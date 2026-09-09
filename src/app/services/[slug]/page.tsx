import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
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
import {
  serviceController,
  serviceSettingController,
  testimonialController,
  globalController,
} from "@/lib";
import {
  buildServiceHeroView,
  buildServiceSimpleCardView,
  buildCategoryShowcaseView,
  buildServiceProcessView,
  buildServiceUspView,
  buildServiceTestimonialsView,
  buildServiceFaqView,
  buildServiceSettingResourcesView,
  buildOtherServicesView,
  buildServiceSettingCtaView,
} from "@/lib/views/serviceView";
import { buildNavView, buildFooterView, buildPageMetadata } from "@/lib/views/globalView";
import { getMediaUrl } from "@/lib/api/media-url";
import { JsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  const result = await serviceController.getAll();
  return (result.data ?? []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: service } = await serviceController.getBySlug(slug);
  return buildPageMetadata(service?.seo, {
    title: service?.heroHeading ?? service?.title ?? "China Sourcing Co",
    description: service?.heroDescription ?? service?.cardDescription,
    image: getMediaUrl(service?.heroImage ?? service?.cardImage),
    path: `/${slug}`,
  });
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

  const [serviceResult, allResult, settingsResult, testimonialsResult, globalResult] = await Promise.all([
    serviceController.getBySlug(slug),
    serviceController.getAll(),
    serviceSettingController.getSettings(),
    testimonialController.getAll(),
    globalController.getGlobal(),
  ]);

  const service = serviceResult.data;
  // 404 của site này là "về trang chủ", không phải một trang lỗi — xem
  // `src/proxy.ts`. Proxy chỉ rewrite vào đây khi slug CÓ trong bảng phân
  // giải, nên nhánh này chỉ chạy khi bảng vừa cũ đi (bản ghi vừa bị bỏ
  // publish) hoặc khi ai đó gõ thẳng đường dẫn nội bộ.
  if (!service) permanentRedirect("/");

  const allServices = allResult.data ?? [];
  const settings = settingsResult.data;
  const allTestimonials = testimonialsResult.data ?? [];
  const global = globalResult.data;

  const hero = buildServiceHeroView(service);
  const simpleCard = buildServiceSimpleCardView(service);
  const verticalTab = settings ? buildCategoryShowcaseView(settings.categoryShowcase) : null;
  const flowTrack = buildServiceProcessView(service);
  const usp = buildServiceUspView(service);
  const testimonials = buildServiceTestimonialsView(settings, allTestimonials);
  const faq = buildServiceFaqView(service, settings);
  const resources = buildServiceSettingResourcesView(settings);
  const carousel = buildOtherServicesView(service, allServices, settings);
  const cta = buildServiceSettingCtaView(settings);

  return (
    <>
      <JsonLd seo={service?.seo} siteSeo={global?.defaultSeo} />
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main>
        <ProductHero hero={hero} />
        <SimpleCardGrid
          tag={simpleCard.tag}
          heading={simpleCard.heading}
          intro={simpleCard.intro}
          cards={simpleCard.cards}
          align="left"
        />
        {verticalTab && (
          <VerticalTab
            tag={verticalTab.tag}
            heading={verticalTab.heading}
            intro={verticalTab.intro}
            ctaLabel={verticalTab.ctaLabel}
            ctaHref={verticalTab.ctaHref}
            tabs={verticalTab.tabs}
          />
        )}
        <FlowTrackTabs tag={flowTrack.tag} heading={flowTrack.heading} slides={flowTrack.slides} />
        <UspList
          tag={usp.tag}
          heading={usp.heading}
          intro={usp.intro ?? undefined}
          icon={usp.icon}
          image={usp.image}
          items={usp.items}
        />
        <TabbedTestimonial tag={testimonials.tag} heading={testimonials.heading} tabs={testimonials.tabs} />
        <Faq tag={faq.tag} headingLines={faq.headingLines} email={faq.email} items={faq.items} />
        <ResourceCards
          tag={resources.tag}
          headingLines={resources.headingLines}
          cards={resources.cards}
          ctaLabel={resources.ctaLabel}
          ctaHref={resources.ctaHref}
        />
        <ServiceCarousel
          tag={carousel.tag}
          heading={carousel.heading}
          intro={carousel.intro}
          cards={carousel.cards}
          ctaLabel={carousel.ctaLabel}
          ctaHref={carousel.ctaHref}
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
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
