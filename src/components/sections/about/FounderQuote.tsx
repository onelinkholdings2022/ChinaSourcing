import { Fragment } from "react";
import Image from "next/image";
import { founderQuote } from "@/data/about";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

/**
 * "From Our Founder" — centred pull-quote with the two quote marks hanging
 * outside the text block.
 *
 * The marks are decorative and deliberately allowed to overflow the column
 * (`-top-6 -left-6` / `-bottom-6 -right-6`); they sit above the text on the
 * z-order but must never intercept a click, hence `pointer-events-none`.
 */
export function FounderQuote() {
  return (
    <section className="simple-quote spacing">
      <div className="container flex flex-col items-center text-center">
        <Reveal>
          <Tag className="mx-auto">{founderQuote.tag}</Tag>
        </Reveal>

        <div className="mt-3 flex flex-col items-center">
          <Reveal>
            <Image
              src={founderQuote.avatar}
              alt={founderQuote.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full overflow-hidden object-cover mb-3"
            />
          </Reveal>
          <Reveal>
            <p className="font-bold body-2 text-grey-600 font-lora">
              {founderQuote.name}
            </p>
          </Reveal>
          <Reveal>
            <p className="body-2 font-medium text-grey-600">
              {founderQuote.role}
            </p>
          </Reveal>
        </div>

        <Reveal className="relative mt-6 lg:mt-10 mx-6">
          <Image
            src="/images/quote-1.svg"
            alt=""
            width={96}
            height={70}
            aria-hidden
            className="absolute -top-6 -left-6 w-8 h-8 lg:w-[96px] lg:h-[70px] pointer-events-none"
          />
          <blockquote className="[&>*]:heading-3 text-grey-600 mx-10 lg:mx-28">
            {founderQuote.paragraphs.map((p, i) => (
              // The original separates the paragraphs with an empty `<p>&nbsp;</p>`
              // rather than a margin. Keep it: `[&>*]:heading-3` gives that blank
              // line the heading line-height, so the gap grows with the type scale
              // at every breakpoint — a fixed margin would drift apart at 1920.
              <Fragment key={i}>
                {i > 0 && <p>&nbsp;</p>}
                <p>{p}</p>
              </Fragment>
            ))}
          </blockquote>
          <Image
            src="/images/quote-2.svg"
            alt=""
            width={96}
            height={70}
            aria-hidden
            className="absolute -bottom-6 -right-6 w-8 h-8 lg:w-[96px] lg:h-[70px] pointer-events-none"
          />
        </Reveal>
      </div>
    </section>
  );
}
