import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/sections/Faq";
import { DarkCta } from "@/components/sections/DarkCta";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { Partners } from "@/components/sections/Partners";
import { CaseStudySlider } from "@/components/sections/CaseStudySlider";
import { ProductHero } from "@/components/sections/product/ProductHero";
import { ProductListGrid } from "@/components/sections/product/ProductListGrid";
import { productsPageController, productController, partnerController, globalController } from "@/lib";
import { getRouteSlugs } from "@/lib/routing/routeSlugs";
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
import type { StrapiSeo } from "@/lib/types/strapi";

/**
 * Thân trang `/products`, dùng chung cho hai route.
 *
 * Bảy khối. Chỉ hero, lưới 15 thẻ và phần FAQ là của riêng trang này; slider
 * case study là đúng khối trên About, còn tab partner là của trang chủ với tag
 * và heading khác — nên cả hai dùng lại chứ không nhân bản.
 *
 * `/products` render nó với `activePartner` bỏ trống; `/<partner-category-slug>`
 * (thư mục nội bộ `app/partner-categories/[slug]`) render đúng trang này với
 * tab nhà máy đó mở sẵn. Bố cục giống HỆT nhau — bộ lọc partner không phải một
 * trang khác, nó là cùng trang, cùng rail, chỉ khác cái đang chọn.
 *
 * Tách thành component vì hai route dựng cùng một cây; để hai bản copy thì sửa
 * một khối là quên khối kia.
 */
export async function ProductsPageBody({
  activePartner,
  seo,
}: {
  /** Slug partner category mở sẵn trong dải logo nhà máy. */
  activePartner?: string;
  seo?: StrapiSeo | null;
}) {
  const [pageResult, productsResult, partnersResult, globalResult, slugTable] = await Promise.all([
    productsPageController.getPage(),
    productController.getAll(),
    partnerController.getAll(),
    globalController.getGlobal(),
    getRouteSlugs(),
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
  const partnersView = buildProductsPartnersView(page, partners, slugTable);
  const faq = buildProductsFaqView(page);
  const cta = buildProductsCtaView(page);

  return (
    <>
      <JsonLd seo={seo ?? page.seo} siteSeo={global?.defaultSeo} />
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main>
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
        <Partners
          tag={partnersView.tag}
          headingLines={partnersView.headingLines}
          tabs={partnersView.tabs}
          activeCategory={activePartner}
        />
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
