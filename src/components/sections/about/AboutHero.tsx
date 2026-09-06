import { SimpleHero } from "@/components/sections/SimpleHero";

/**
 * `/about-us`'s opener. The markup is shared with `/case-studies` — see
 * `SimpleHero`; this only binds the copy.
 */
export function AboutHero({
  heading,
  intro,
  image,
  imageAlt,
}: {
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <SimpleHero
      heading={heading}
      intro={intro}
      image={image}
      imageAlt={imageAlt}
      gradientId="about-hero-glow"
    />
  );
}
