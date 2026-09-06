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
import { productsPageController, productController, partnerController, globalController } from "@/lib";
import {
  buildProductsHeroView,
  buildProductListView,
  buildProductsCaseStudiesView,
  buildCertificationsView,
  buildProductsPartnersView,
  buildProductsFaqView,
  buildProductsCtaView,
} from "@/lib/views/productView";
import { buildNavView, buildFooterView } from "@/lib/views/globalView";

export const metadata = landingMetadata("products");

/**
 * `/products` — the category index.
 *
 * Seven sections. Only the hero, the 15-card grid and the FAQ copy belong to
 * this page; the case-study slider is the same block as on About, and the
 * partner tabs are the homepage's with a different tag and heading, so both are
 * reused rather than duplicated.
 */
export default async function Page() {
  const [pageResult, productsResult, partnersResult, globalResult] = await Promise.all([
    productsPageController.getPage(),
    productController.getAll(),
    partnerController.getAll(),
    globalController.getGlobal(),
  ]);

  const page = pageResult.data;
  const products = productsResult.data ?? [];
  const partners = partnersResult.data ?? [];
  const global = globalResult.data;

  if (!page) {
    return (
      <>
        <Header solid nav={global ? buildNavView(global) : undefined} />
        <main>
          <p className="container py-40 text-center">
            Không tải được nội dung trang Products. Vui lòng thử lại sau.
          </p>
        </main>
        <Footer footer={global ? buildFooterView(global) : undefined} />
      </>
    );
  }

  const hero = buildProductsHeroView(page);
  const list = buildProductListView(page, products);
  const caseStudies = buildProductsCaseStudiesView(page);
  const logos = buildCertificationsView(page);
  const partnersView = buildProductsPartnersView(page, partners);
  const faq = buildProductsFaqView(page);
  const cta = buildProductsCtaView(page);

  return (
    <>
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main className="pt-28 lg:pt-32">
        <ProductHero hero={hero} />
        <ProductListGrid tag={list.tag} heading={list.heading} intro={list.intro} cards={list.cards} />
        <CaseStudySlider
          tag={caseStudies.tag}
          headingLines={caseStudies.headingLines}
          cards={caseStudies.cards}
          ctaLabel={caseStudies.ctaLabel}
          ctaHref={caseStudies.ctaHref}
        />
        <LogoStrip logos={logos.items} tag={logos.tag} heading={logos.heading} intro={logos.intro} />
        <Partners tag={partnersView.tag} headingLines={partnersView.headingLines} tabs={partnersView.tabs} />
        <Faq tag={faq.tag} headingLines={faq.headingLines} email={faq.email} items={faq.items} />
        <DarkCta
          tag={cta.tag}
          heading={cta.heading}
          body={cta.body}
          ctaLabel={cta.ctaLabel}
          ctaHref={cta.ctaHref}
        />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
