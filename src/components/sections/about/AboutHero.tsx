import { aboutHero } from "@/data/about";
import { SimpleHero } from "@/components/sections/SimpleHero";

/**
 * `/about-us`'s opener. The markup is shared with `/case-studies` — see
 * `SimpleHero`; this only binds the copy.
 */
export function AboutHero() {
  return (
    <SimpleHero
      heading={aboutHero.heading}
      intro={aboutHero.intro}
      image={aboutHero.image}
      imageAlt={aboutHero.imageAlt}
      gradientId="about-hero-glow"
    />
  );
}
