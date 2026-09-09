import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/Footer";
import { SimpleHero } from "@/components/sections/SimpleHero";
import { ResourceListing } from "@/components/sections/resources/ResourceListing";
import { BlogListing } from "@/components/sections/resources/BlogListing";
import { SplitScreenDownload } from "@/components/sections/resources/SplitScreenDownload";
import { Faq } from "@/components/sections/Faq";
import {
  resourcesPageController,
  resourceController,
  resourceTypeController,
  blogPostController,
  globalController,
} from "@/lib";
import { getRouteSlugs } from "@/lib/routing/routeSlugs";
import {
  buildResourcesHeroView,
  buildFreeResourcesView,
  buildInsightsView,
  buildDownloadCtaView,
  buildResourcesFaqView,
} from "@/lib/views/resourceView";
import { buildNavView, buildFooterView } from "@/lib/views/globalView";
import type { StrapiSeo } from "@/lib/types/strapi";

/**
 * Thân trang `/resources`, dùng chung cho hai route.
 *
 * `/resources` render nó với cả hai bộ lọc ở "all"; `/<category-slug>` (thư
 * mục nội bộ `app/categories/[slug]`) render đúng trang này với category đó mở
 * sẵn, và `/<resource-type-slug>` (`app/resource-types/[slug]`) làm y hệt cho
 * rail "Free Resources". Bố cục giống HỆT nhau, hero cũng vậy — bộ lọc category không phải
 * một trang khác, nó là cùng trang, cùng rail, chỉ khác cái đang chọn. Đó cũng
 * là lý do bấm một pill không rời trang (xem `BlogListing`): nếu trang category
 * trông khác đi thì cú bấm sẽ giống một lượt chuyển trang, mà nó không phải.
 *
 * Khác nhau duy nhất là `<title>`/meta — `seo` truyền từ route category vào,
 * lấy từ `category.seo` bên CMS.
 *
 * Tách ra thành component vì hai route dựng cùng một cây; để hai bản copy thì
 * sửa một khối là quên khối kia.
 */
export async function ResourcesPageBody({
  activeCategory = "all",
  activeResourceType = "all",
  seo,
}: {
  /** Slug category blog mở sẵn — rail `.blog-listing`. */
  activeCategory?: string;
  /** Slug loại download mở sẵn — rail `.resource-listing`. */
  activeResourceType?: string;
  seo?: StrapiSeo | null;
}) {
  const [pageResult, resourcesResult, typesResult, postsResult, globalResult, slugTable] =
    await Promise.all([
      resourcesPageController.getPage(),
      resourceController.getAll(),
      resourceTypeController.getAll(),
      blogPostController.getAll(),
      globalController.getGlobal(),
      getRouteSlugs(),
    ]);

  const page = pageResult.data;
  const resources = resourcesResult.data ?? [];
  const resourceTypes = typesResult.data ?? [];
  const posts = postsResult.data ?? [];
  const global = globalResult.data;

  if (!page) {
    return (
      <>
        <Header solid nav={global ? buildNavView(global) : undefined} />
        <main>
          <p className="container py-40 text-center">
            Không tải được nội dung trang Resources. Vui lòng thử lại sau.
          </p>
        </main>
        <Footer footer={global ? buildFooterView(global) : undefined} />
      </>
    );
  }

  const hero = buildResourcesHeroView(page);
  const freeResources = buildFreeResourcesView(page, resources, resourceTypes, slugTable);
  const insights = buildInsightsView(page, posts, slugTable);
  const splitScreen = buildDownloadCtaView(page);
  const faq = buildResourcesFaqView(page);

  return (
    <>
      <JsonLd seo={seo ?? page.seo} siteSeo={global?.defaultSeo} />
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main>
        <SimpleHero
          heading={hero.heading}
          intro={hero.intro}
          image={hero.image}
          imageAlt={hero.imageAlt}
          gradientId="resources-hero-glow"
        />
        <ResourceListing
          tag={freeResources.tag}
          heading={freeResources.heading}
          tabs={freeResources.tabs}
          cards={freeResources.cards}
          perPage={freeResources.perPage}
          activeType={activeResourceType}
        />
        <BlogListing
          tag={insights.tag}
          heading={insights.heading}
          intro={insights.intro}
          tabs={insights.tabs}
          cards={insights.cards}
          perPage={insights.perPage}
          activeCategory={activeCategory}
        />
        <SplitScreenDownload
          tag={splitScreen.tag}
          heading={splitScreen.heading}
          body={splitScreen.body}
          ctaLabel={splitScreen.ctaLabel}
          image={splitScreen.image}
          alt={splitScreen.alt}
          fileUrl={splitScreen.fileUrl}
        />
        <Faq tag={faq.tag} headingLines={faq.headingLines} email={faq.email} items={faq.items} />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
