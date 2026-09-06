import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Faq } from "@/components/sections/Faq";
import { UspList } from "@/components/sections/UspList";
import { DarkCta } from "@/components/sections/DarkCta";
import { ProductHero } from "@/components/sections/product/ProductHero";
import { ImageCardGrid } from "@/components/sections/product/ImageCardGrid";
import { TwoColumnTestimonial } from "@/components/sections/product/TwoColumnTestimonial";
import { productController, productSettingController, testimonialController, globalController } from "@/lib";
import {
  buildProductHeroView,
  buildProductImageCardView,
  buildProductTestimonialView,
  buildProductUspView,
  buildProductFaqView,
  buildProductCtaView,
} from "@/lib/views/productView";
import { buildNavView, buildFooterView } from "@/lib/views/globalView";

export async function generateStaticParams() {
  const result = await productController.getAll();
  return (result.data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await productController.getBySlug(slug);
  const product = result.data;
  return {
    title: product ? `${product.title} | China Sourcing Co` : "China Sourcing Co",
    description: product?.cardDescription || undefined,
  };
}

/**
 * `/product/<slug>` — one template for all 15 categories.
 *
 * Every one of them renders the same six sections in the same order, so the
 * differences are entirely content, now sourced from Strapi's `product`
 * collection instead of the static JSON.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [productResult, settingsResult, testimonialsResult, globalResult] = await Promise.all([
    productController.getBySlug(slug),
    productSettingController.getSettings(),
    testimonialController.getAll(),
    globalController.getGlobal(),
  ]);

  const product = productResult.data;
  if (!product) notFound();

  const settings = settingsResult.data;
  const allTestimonials = testimonialsResult.data ?? [];
  const global = globalResult.data;

  const hero = buildProductHeroView(product);
  const imageCard = buildProductImageCardView(product);
  const testimonial = buildProductTestimonialView(product, settings, allTestimonials);
  const usp = buildProductUspView(product, settings);
  const faq = buildProductFaqView(product, settings);
  const cta = buildProductCtaView(product);

  return (
    <>
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main className="pt-28 lg:pt-32">
        <ProductHero hero={hero} />
        <ImageCardGrid data={imageCard} />
        <TwoColumnTestimonial data={testimonial} />
        <UspList
          tag={usp.tag}
          heading={usp.heading}
          icon={usp.icon}
          image={usp.image}
          items={usp.items}
        />
        <Faq tag={faq.tag} headingLines={faq.headingLines} email={faq.email} items={faq.items} />
        <DarkCta
          tag={cta.tag}
          heading={cta.heading}
          body={cta.body}
          ctaLabel={cta.ctaLabel}
          className={cta.sectionClass}
        />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
