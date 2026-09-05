import { Button, Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import type { ProductPage } from "@/data/products";

/**
 * "Success Stories in ..." — two testimonial columns, centred.
 *
 * The photos stay `grayscale` permanently: the class carries
 * `transition-all duration-300` but the original never adds a hover rule to
 * remove it, so it is a static treatment, not an interaction. Kept as-is.
 *
 * The closing quote mark sits beside the text as a flex sibling (`inline-flex
 * gap-4`), not absolutely positioned like the About pull-quote, so it pushes
 * the blockquote narrower rather than overlapping it.
 */
export function TwoColumnTestimonial({
  data,
}: {
  data: ProductPage["testimonial"];
}) {
  return (
    <section className="two-column-testimonial spacing container">
      <Tag className="mx-auto">{data.tag}</Tag>
      <Reveal>
        <h2 className="heading-2 font-semibold mb-10 text-center mt-3 text-cyan-400">
          {data.heading}
        </h2>
      </Reveal>

      <div className="w-fit mx-auto flex flex-row flex-wrap justify-center gap-10">
        {data.items.map((item) => (
          <div key={item.name} className="flex flex-row">
            <TestimonialCard item={item} />
          </div>
        ))}
      </div>

      {data.ctaLabel && data.ctaHref && (
        <div className="flex justify-center items-center mt-10">
          <Button href={data.ctaHref} variant="primary" withArrow>
            {data.ctaLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
