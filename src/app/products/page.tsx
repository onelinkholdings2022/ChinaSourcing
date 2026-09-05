import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { Faq } from "@/components/sections/Faq";
import { DarkCta } from "@/components/sections/DarkCta";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { Partners } from "@/components/sections/Partners";
import { CaseStudySlider } from "@/components/sections/CaseStudySlider";
import { ProductHero } from "@/components/sections/product/ProductHero";
import { ProductListGrid } from "@/components/sections/product/ProductListGrid";
import { productsIndex } from "@/data/products-index";

export const metadata = landingMetadata("products");

/**
 * `/products` — the category index.
 *
 * Seven sections. Only the hero, the 15-card grid and the FAQ copy belong to
 * this page; the case-study slider is the same block as on About, and the
 * partner tabs are the homepage's with a different tag and heading, so both are
 * reused rather than duplicated.
 */
export default function Page() {
  const { hero, list, faq, cta, logos } = productsIndex;

  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <ProductHero hero={hero} />
        <ProductListGrid
          tag={list.tag}
          heading={list.heading}
          intro={list.intro}
          cards={list.cards}
        />
        <CaseStudySlider />
        <LogoStrip
          logos={logos.items}
          tag={logos.tag}
          heading={logos.heading}
          intro={logos.intro}
        />
        <Partners
          tag="Our Partners"
          headingLines={["Certified Supply Chains", "You Can Trust"]}
        />
        <Faq
          tag={faq.tag}
          headingLines={faq.headingLines}
          email={faq.email}
          items={faq.items}
        />
        <DarkCta
          tag={cta.tag}
          heading={cta.heading}
          body={cta.body}
          ctaLabel={cta.ctaLabel}
          ctaHref={cta.ctaHref}
        />
      </main>
      <Footer />
    </>
  );
}
