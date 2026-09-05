import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { landingMetadata } from "@/components/LandingPage";
import { caseStudiesIndex } from "@/data/case-studies";
import { SimpleHero } from "@/components/sections/SimpleHero";
import { CaseStudyList } from "@/components/sections/CaseStudyList";
import { UspList } from "@/components/sections/UspList";
import { CarouselTestimonial } from "@/components/sections/CarouselTestimonial";
import { DarkCta } from "@/components/sections/DarkCta";

export const metadata = landingMetadata("case-studies");

const { hero, list, usp, testimonials, cta, cards } = caseStudiesIndex;

/**
 * `/case-studies`, rebuilt as components.
 *
 * Section order is the original's, with one omission: the theme also renders a
 * `.featured-case-studies` band ("The Real Story Behind the Project", a 2x2
 * mosaic of three studies) between the list and the USPs. It is dropped here at
 * the owner's request — the three studies it promotes are all in the grid
 * directly above it.
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
          gradientId="case-studies-hero-glow"
        />
        <CaseStudyList
          tag={list.tag}
          heading={list.heading}
          cards={cards}
          perPage={list.perPage}
          filters={list.filters}
        />
        <UspList
          tag={usp.tag}
          heading={usp.heading}
          intro={usp.intro}
          icon={usp.icon}
          image={usp.image}
          items={usp.items}
        />
        <CarouselTestimonial
          tag={testimonials.tag}
          heading={testimonials.heading}
          items={testimonials.items}
        />
        <DarkCta
          tag={cta.tag}
          heading={cta.heading}
          body={cta.body}
          ctaLabel={cta.ctaLabel}
          className={cta.sectionClass}
        />
      </main>
      <Footer />
    </>
  );
}
