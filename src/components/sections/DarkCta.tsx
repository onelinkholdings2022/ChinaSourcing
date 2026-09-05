import { Button, Tag } from "@/components/ui/button";

/**
 * The `.dark-cta` panel that closes About and every product page.
 *
 * Not the same thing as the homepage's `ClosingCta`: this one has no animated
 * chevrons and sits inside `px-5 pb-[120px]` with its own `rounded-2xl` card,
 * so the dark block stops short of the viewport edges rather than bleeding to
 * them.
 */
export function DarkCta({
  tag,
  heading,
  body,
  ctaLabel,
  ctaHref = "/contact-us",
  className = "dark-cta px-5 pb-[120px]",
}: {
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref?: string;
  /** The bottom padding is per-page ACF, not a constant — point-of-sale ships without `pb-[120px]`. */
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="container py-[80px] bg-dark-blue-950 rounded-2xl">
        <div className="space-y-3 text-center flex flex-col justify-center items-center w-4/5 max-w-[900px] mx-auto">
          <Tag className="mx-auto">{tag}</Tag>
          <h2 className="heading-2 font-semibold text-white text-center">
            {heading}
          </h2>
          <p className="text-dark-blue-400 body-2 text-center">{body}</p>
        </div>

        <Button
          href={ctaHref}
          variant="white"
          withArrow
          className="mt-10 mx-auto flex w-fit"
        >
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
