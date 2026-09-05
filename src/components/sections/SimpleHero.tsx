import Image from "next/image";

/**
 * Page opener — heading and intro on the left, a square photo on the right.
 *
 * The same block opens `/about-us` and `/case-studies`; the theme prints
 * identical markup on both, differing only in copy and photo, so it lives here
 * rather than being written out twice.
 *
 * The blurred blue ellipse bottom-left is an inline SVG on the original, not a
 * CSS gradient: it is rotated 40.692° and clipped by the section's
 * `overflow-hidden`, which a `radial-gradient` background cannot reproduce at
 * the same angle without a second positioned layer.
 */
export function SimpleHero({
  heading,
  intro,
  image,
  imageAlt,
  /** Unique per page — two copies of this SVG on one document would collide. */
  gradientId = "simple-hero-glow",
}: {
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
  gradientId?: string;
}) {
  return (
    <section className="relative overflow-hidden lg:min-h-screen">
      <svg
        className="absolute -z-10 bottom-0 left-0"
        width="196"
        height="434"
        viewBox="0 0 196 434"
        fill="none"
        aria-hidden
      >
        <ellipse
          cx="-30.0357"
          cy="217.006"
          rx="251.5"
          ry="186"
          transform="rotate(40.692 -30.0357 217.006)"
          fill={`url(#${gradientId})`}
          fillOpacity="0.2"
        />
        <defs>
          <radialGradient
            id={gradientId}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-30.0357 217.006) rotate(90) scale(186 251.5)"
          >
            <stop stopColor="#36A9E1" />
            <stop offset="1" stopColor="white" />
          </radialGradient>
        </defs>
      </svg>

      <div className="container flex py-10 lg:flex-row flex-col justify-between lg:items-center gap-[60px]">
        <div className="flex-1">
          <h1 className="heading-1 font-medium text-dark-blue-950">{heading}</h1>
          <p className="body-1 mt-4 text-grey-600 font-medium">{intro}</p>
        </div>

        <div className="xl:max-w-[702px] lg:max-w-[500px] flex-1 rounded-3xl relative overflow-hidden flex justify-center items-center">
          <div className="w-full h-auto aspect-square rounded-3xl relative overflow-hidden">
            <Image
              src={image}
              alt={imageAlt}
              width={702}
              height={702}
              priority
              className="aspect-square object-cover hover:scale-105 duration-300 rounded-3xl w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
