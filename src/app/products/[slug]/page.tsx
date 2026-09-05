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
import { decodeEntities, getEntry } from "@/lib/content";
import { getProductPage, productSlugs } from "@/data/products";

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("products", slug);
  return {
    title: entry ? `${decodeEntities(entry.title)} | China Sourcing Co` : "China Sourcing Co",
    description: entry?.excerpt || undefined,
  };
}

/**
 * `/product/<slug>` — one template for all 15 categories.
 *
 * Every one of them renders the same six sections in the same order (checked
 * against the live markup for all 15), so the differences are entirely content
 * and live in `src/data/content/product-pages.json`.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getProductPage(slug);
  if (!page) notFound();

  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <ProductHero hero={page.hero} />
        <ImageCardGrid data={page.imageCard} />
        <TwoColumnTestimonial data={page.testimonial} />
        <UspList
          tag={page.usp.tag}
          heading={page.usp.heading}
          icon={page.usp.icon}
          image={page.usp.image}
          items={page.usp.items}
        />
        <Faq
          tag={page.faq.tag}
          headingLines={page.faq.headingLines}
          email={page.faq.email}
          items={page.faq.items}
        />
        <DarkCta
          tag={page.cta.tag}
          heading={page.cta.heading}
          body={page.cta.body}
          ctaLabel={page.cta.ctaLabel}
          className={page.cta.sectionClass}
        />
      </main>
      <Footer />
    </>
  );
}
