import Image from "next/image";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * The certification / partner logo marquee.
 *
 * The original drives this with Splide's AutoScroll at `speed: 0.5` — about
 * half a pixel per frame, so ~30px/s — with `gap: 120` collapsing to 24 below
 * 1280px. Reproduced as a CSS keyframe over a doubled list, which loops
 * seamlessly at -50% and costs no JS. Splide is configured `drag: false` here,
 * so the strip is not interactive and nothing is lost by dropping the library.
 *
 * The edge fades are the theme's own `onelink_white_overlay.png` rather than a
 * CSS gradient: it is a soft-edged bitmap, and a linear-gradient leaves a
 * visible straight seam against the logos passing underneath.
 *
 * About renders this bare; `/products` puts a tag, heading and intro above it.
 */
export function LogoStrip({
  logos,
  tag,
  heading,
  intro,
  className = "logo container text-center spacing",
}: {
  logos: string[];
  tag?: string;
  heading?: string;
  intro?: string;
  className?: string;
}) {
  const loop = [...logos, ...logos];

  return (
    <section className={cn(className)}>
      {tag && <Tag className="mx-auto">{tag}</Tag>}
      {heading && (
        <Reveal>
          <h2 className="heading-2 mt-3 font-semibold">{heading}</h2>
        </Reveal>
      )}
      {intro && (
        <Reveal>
          <p className="mt-4 text-lg text-grey-600">{intro}</p>
        </Reveal>
      )}

      <div className="overflow-hidden relative">
        <div className="absolute z-[2] w-10 h-full top-0 left-[-5px] opacity-70">
          <Image
            src="/images/onelink_white_overlay.png"
            alt=""
            aria-hidden
            width={40}
            height={100}
            className="object-cover w-full h-full rotate-180"
          />
        </div>
        <div className="absolute z-[2] w-10 h-full top-0 right-0 opacity-70">
          <Image
            src="/images/onelink_white_overlay.png"
            alt=""
            aria-hidden
            width={40}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>

        {/* `mt-[80px]` sits on the strip, not the wrapper: the original puts it
            on the Splide root INSIDE `overflow-hidden`, so it adds to the
            wrapper's height (80 + 100 = 180) instead of collapsing outward. On
            About there is no heading and no gap. */}
        <div
          className={cn(
            "flex w-max animate-marquee-about",
            heading && "mt-[80px]",
          )}
        >
          {loop.map((logo, i) => (
            <div key={`${logo}-${i}`} className="shrink-0 px-3 xl:px-[60px]">
              <Image
                src={logo}
                alt=""
                width={100}
                height={100}
                className="size-[100px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
