import Image from "next/image";
import { Button, Tag } from "@/components/ui/button";
import { DownloadButton } from "@/components/ui/DownloadButton";

/**
 * `.split-screen` — the indigo panel that closes `/resources`.
 *
 * The document shot is flush to the bottom edge of the rounded card and gets
 * clipped by it: the card is `overflow-hidden` and the image carries only a
 * top radius, so it reads as sliding up out of the panel. Its aspect is pinned
 * at `1000/270` so the crop never moves.
 *
 * The button itself is not a link on the original: `#downloadBtnCta`'s inline
 * script builds a throwaway `<a download>` for a static PDF and clicks it.
 * `DownloadButton` does the same — it is the same PDF, and the same behaviour,
 * as the homepage's "Download A Sourcing Guide".
 */
export function SplitScreenDownload({
  tag,
  heading,
  body,
  ctaLabel,
  image,
  alt,
  fileUrl,
}: {
  tag: string;
  heading: string;
  body: string;
  ctaLabel: string;
  image: string;
  alt: string;
  fileUrl: string | null;
}) {
  return (
    <section className="split-screen px-5 lg:pb-[120px] pb-20">
      <div className="container overflow-hidden text-center rounded-2xl bg-dark-blue-950 md:pt-20 pt-16 flex flex-col justify-center items-center">
        <Tag className="mx-auto">{tag}</Tag>
        <h2 className="heading-2 max-w-[800px] text-white mt-3 font-semibold">
          {heading}
        </h2>
        <p className="mt-3 body-2 max-w-[800px] text-dark-blue-400">{body}</p>

        {fileUrl ? (
          <DownloadButton fileUrl={fileUrl} variant="white" withArrow className="my-10">
            {ctaLabel}
          </DownloadButton>
        ) : (
          <Button href="/contact-us" variant="white" withArrow className="my-10">
            {ctaLabel}
          </Button>
        )}

        <Image
          src={image}
          alt={alt}
          width={1000}
          height={270}
          className="rounded-t-lg object-cover w-full max-w-[1000px] aspect-[1000/270]"
        />
      </div>
    </section>
  );
}
