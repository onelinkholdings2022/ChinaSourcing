import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { resourcesIndex } from "@/data/resources";
import { SimpleHero } from "@/components/sections/SimpleHero";
import { ResourceListing } from "@/components/sections/resources/ResourceListing";
import { BlogListing } from "@/components/sections/resources/BlogListing";
import { SplitScreenDownload } from "@/components/sections/resources/SplitScreenDownload";
import { Faq } from "@/components/sections/Faq";

export const metadata = landingMetadata("resources");

const { hero, resources, blogs, splitScreen, faq } = resourcesIndex;

/**
 * `/resources`, rebuilt as components.
 *
 * Section order is the original's, with one omission: the theme also renders a
 * `.featured-resources` band ("Most Popular Blogs", a 2x2 mosaic of three
 * posts) between the hero and the downloads. It is dropped here at the owner's
 * request — all three posts are in the blog listing further down.
 */
export default function Page() {
  return (
    <>
      <Header solid />
      <main className="pt-28 lg:pt-32">
        <SimpleHero
          heading={hero.heading}
          intro={hero.intro}
          image={hero.image}
          imageAlt={hero.imageAlt}
          gradientId="resources-hero-glow"
        />
        <ResourceListing
          tag={resources.tag}
          heading={resources.heading}
          tabs={resources.tabs}
          cards={resources.cards}
          perPage={resources.perPage}
        />
        <BlogListing
          tag={blogs.tag}
          heading={blogs.heading}
          intro={blogs.intro}
          tabs={blogs.tabs}
          cards={blogs.cards}
          perPage={blogs.perPage}
        />
        <SplitScreenDownload
          tag={splitScreen.tag}
          heading={splitScreen.heading}
          body={splitScreen.body}
          ctaLabel={splitScreen.ctaLabel}
          image={splitScreen.image}
          alt={splitScreen.alt}
        />
        <Faq
          tag={faq.tag}
          headingLines={faq.headingParts}
          email={faq.email}
          items={faq.items}
        />
      </main>
      <Footer />
    </>
  );
}
