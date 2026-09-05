import { Button, Tag } from "@/components/ui/button";
import { BlogCard } from "@/components/sections/resources/BlogCard";
import type { BlogCard as BlogCardData } from "@/data/resources";

/**
 * "Explore More Relative Resources" — three post cards and a link back to the
 * listing. The picks are per-article, so they come from the page's own data
 * rather than being derived here.
 */
export function RelatedResources({
  tag,
  heading,
  cards,
  ctaLabel,
  ctaHref,
}: {
  tag: string;
  heading: string;
  cards: BlogCardData[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="my-16 lg:my-[120px]">
      <Tag className="mx-auto">{tag}</Tag>
      <h2 className="heading-2 font-semibold mb-8 text-center mt-3">
        {heading}
      </h2>

      <div className="flex flex-row flex-wrap w-full gap-6 md:gap-10 justify-center">
        {cards.map((card) => (
          <BlogCard key={card.href} card={card} variant="related" />
        ))}
      </div>

      <div className="flex justify-center items-center mt-10">
        <Button href={ctaHref} withArrow>
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
