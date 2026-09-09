import Image from "next/image";

export type Testimonial = {
  image: string | null;
  alt: string;
  quote: string;
  avatar: string | null;
  name: string;
  role: string;
};

/**
 * One testimonial: photo, quote with a closing quote mark beside it, then the
 * attribution row.
 *
 * Used two-up on the product pages (`.two-column-testimonial`) and three-up
 * inside tab panels on the service pages (`.tabbed-testimonial`) — identical
 * markup, so the column widths belong to the caller, not here.
 *
 * The photo stays `grayscale` permanently. The class carries
 * `transition-all duration-300` but the theme never adds a hover rule to remove
 * it, so it is a static treatment rather than an interaction.
 */
export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="w-full max-w-md flex flex-col">
      {item.image && (
        <Image
          src={item.image}
          alt={item.alt}
          width={684}
          height={464}
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover w-full h-auto aspect-[5/4] grayscale transition-all duration-300 rounded-lg"
        />
      )}

      <div className="relative mt-6 lg:mt-10 inline-flex gap-4 grow">
        <blockquote className="font-medium text-grey-600">
          <span className="font-normal">{item.quote}</span>
        </blockquote>
        <Image
          src="/images/quote-2.svg"
          alt=""
          aria-hidden
          width={60}
          height={60}
          className="w-8 h-8 lg:w-[60px] lg:h-[60px] shrink-0 self-start"
        />
      </div>

      <div className="flex flex-row items-center mt-[26px] gap-2">
        {item.avatar && (
          <Image
            src={item.avatar}
            alt={item.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col gap-1">
          <div className="font-semibold body-2 text-grey-800 font-lora">
            {item.name}
          </div>
          <div className="body-3 text-grey-600">{item.role}</div>
        </div>
      </div>
    </div>
  );
}
