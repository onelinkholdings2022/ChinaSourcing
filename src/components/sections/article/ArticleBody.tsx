"use client";

import Image from "next/image";
import { ShareRow } from "@/components/sections/casestudy/ShareRow";
import { TableOfContents } from "@/components/sections/article/TableOfContents";
import { StickyIndex } from "@/components/sections/article/StickyIndex";
import { useSubscribed } from "@/hooks/useSubscribed";
import { cn } from "@/lib/utils";

/**
 * The banner image, the sidebar (table of contents + share) and the article
 * itself.
 *
 * ## The body is gated — only when the CMS says so
 *
 * `gated` (Strapi's `resource.gated` / `blog-post.gated`) decides this per
 * article. When gated, `#post-content-container`
 * is capped at `max-h-[600px] lg:max-h-[1000px]` with `overflow-clip`, and a
 * white gradient fades the cut-off edge under "Please subscribe to see the
 * detail". Handing over an email lifts the cap — see `useSubscribed`.
 */
export function ArticleBody({
  featuredImage,
  featuredAlt,
  toc,
  html,
  shareUrl,
  title,
  gated,
}: {
  featuredImage: string | null;
  featuredAlt: string;
  toc: { href: string; label: string }[];
  html: string;
  shareUrl: string;
  title: string;
  gated: boolean;
}) {
  const subscribed = useSubscribed();
  const locked = gated && !subscribed;

  return (
    <>
      {/* Pinned to the viewport, so it lives outside the column flow. */}
      <StickyIndex items={toc} />

      {featuredImage && (
        <Image
          src={featuredImage}
          alt={featuredAlt}
          width={1448}
          height={579}
          priority
          className="w-full object-cover mt-10 lg:mt-[120px] aspect-[4/3] md:aspect-[5/2] rounded-3xl"
        />
      )}

      <div className="flex flex-col lg:flex-row gap-10 mt-24 lg:mt-20">
        <div className="w-full lg:w-[252px] lg:min-w-[252px] 2xl:w-[300px] 2xl:min-w-[300px]">
          {toc.length > 0 && <TableOfContents items={toc} />}

          <ShareRow url={shareUrl} title={title} className="inline-flex" />
        </div>

        <div
          className={cn(
            "max-w-[800px] max-[1023px]:mx-auto overflow-clip relative",
            locked && "max-h-[600px] lg:max-h-[1000px]",
          )}
        >
          <div
            className="rich-text"
            // The editor's own markup, with the plugin's heading anchors intact
            // so the table of contents above actually lands somewhere.
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {locked && (
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/0 to-white">
              <p className="text-center absolute left-0 right-0 bottom-0 font-medium text-dark-blue-900 text-2xl">
                Please subscribe to see the detail
              </p>
            </span>
          )}
        </div>
      </div>
    </>
  );
}
