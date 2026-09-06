import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { SimpleHero } from "@/components/sections/SimpleHero";
import { ResourceListing } from "@/components/sections/resources/ResourceListing";
import { BlogListing } from "@/components/sections/resources/BlogListing";
import { SplitScreenDownload } from "@/components/sections/resources/SplitScreenDownload";
import { Faq } from "@/components/sections/Faq";
import { resourcesPageController, resourceController, blogPostController, globalController } from "@/lib";
import {
  buildResourcesHeroView,
  buildFreeResourcesView,
  buildInsightsView,
  buildDownloadCtaView,
  buildResourcesFaqView,
} from "@/lib/views/resourceView";
import { buildNavView, buildFooterView } from "@/lib/views/globalView";

export const metadata = landingMetadata("resources");

/**
 * `/resources`, rebuilt as components.
 *
 * Section order is the original's, with one omission: the theme also renders a
 * `.featured-resources` band ("Most Popular Blogs", a 2x2 mosaic of three
 * posts) between the hero and the downloads. It is dropped here at the owner's
 * request — all three posts are in the blog listing further down.
 */
export default async function Page() {
  const [pageResult, resourcesResult, postsResult, globalResult] = await Promise.all([
    resourcesPageController.getPage(),
    resourceController.getAll(),
    blogPostController.getAll(),
    globalController.getGlobal(),
  ]);

  const page = pageResult.data;
  const resources = resourcesResult.data ?? [];
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
  const freeResources = buildFreeResourcesView(page, resources);
  const insights = buildInsightsView(page, posts);
  const splitScreen = buildDownloadCtaView(page);
  const faq = buildResourcesFaqView(page);

  return (
    <>
      <Header solid nav={global ? buildNavView(global) : undefined} />
      <main className="pt-28 lg:pt-32">
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
        />
        <BlogListing
          tag={insights.tag}
          heading={insights.heading}
          intro={insights.intro}
          tabs={insights.tabs}
          cards={insights.cards}
          perPage={insights.perPage}
        />
        <SplitScreenDownload
          tag={splitScreen.tag}
          heading={splitScreen.heading}
          body={splitScreen.body}
          ctaLabel={splitScreen.ctaLabel}
          image={splitScreen.image}
          alt={splitScreen.alt}
        />
        <Faq tag={faq.tag} headingLines={faq.headingLines} email={faq.email} items={faq.items} />
      </main>
      <Footer footer={global ? buildFooterView(global) : undefined} />
    </>
  );
}
