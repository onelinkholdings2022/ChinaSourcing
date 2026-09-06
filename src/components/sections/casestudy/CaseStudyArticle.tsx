import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ShareRow } from "@/components/sections/casestudy/ShareRow";

/** One tag + heading + rich-text block of the article body. */
export type CaseStudyBlock = { tag: string; heading: string; html: string };

/**
 * The article body of a case study: "The Challenge" and "The Solution", each a
 * tag, a Lora heading and a WYSIWYG region, then the share strip.
 *
 * The region keeps its `.rich-text` class — the type scale, the 24px gap
 * between paragraphs and the `rounded-3xl` full-width images all come from
 * that rule in globals.css, and the HTML inside is the editor's, untouched.
 *
 * The heading is an `<h3>` on the original even though it is the page's second
 * level; kept, because the `.rich-text` body below it can itself contain an
 * `<h2>` and the theme's own scale would then invert.
 */
export function CaseStudyArticle({
  blocks,
  shareUrl,
  title,
}: {
  blocks: CaseStudyBlock[];
  shareUrl: string;
  title: string;
}) {
  return (
    <section className="spacing container max-w-[800px] mx-auto flex flex-col gap-10">
      {blocks.map((block) => (
        <div key={block.heading}>
          <Reveal>
            <Tag className="mx-auto lg:ml-0">{block.tag}</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h3 className="heading-2 font-semibold text-cyan-950 mt-3 mb-4 font-lora">
              {block.heading}
            </h3>
          </Reveal>
          <Reveal delay={150}>
            <div
              className="rich-text flex flex-col text-grey-600"
              // The editor's own markup — headings, lists, inline images.
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          </Reveal>
        </div>
      ))}

      <ShareRow url={shareUrl} title={title} />
    </section>
  );
}
