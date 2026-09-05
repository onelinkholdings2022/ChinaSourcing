import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CaseStudyFact } from "@/data/case-studies";

/**
 * The opener of a `/case-study/<slug>` page — centred title and intro over a
 * pale blue fact box (Region / Industry / Service).
 *
 * The two blurred blue wedges are the theme's `pattern-left.svg` and
 * `pattern-right.svg`, both rotated 40.692° and pushed half out of the section
 * so `overflow-hidden` clips them. They are `hidden md:block` — below `md` the
 * hero is plain white.
 */
export function CaseStudyHero({
  heading,
  intro,
  facts,
}: {
  heading: string;
  intro: string;
  facts: CaseStudyFact[];
}) {
  return (
    <section className="spacing relative overflow-hidden">
      <Image
        src="/images/pattern-left.svg"
        alt=""
        aria-hidden
        width={503}
        height={372}
        className="absolute w-[503px] h-[372px] -bottom-[96px] left-0 -translate-x-1/2 -translate-y-1/3 rotate-[40.692deg] -z-10 hidden md:block"
      />
      <Image
        src="/images/pattern-right.svg"
        alt=""
        aria-hidden
        width={503}
        height={372}
        className="absolute w-[503px] h-[372px] rotate-[40.692deg] top-0 -translate-y-1/3 right-0 translate-x-1/2 -z-10 hidden md:block"
      />

      <div className="container z-10">
        <div className="md:w-11/12 md:mx-auto max-w-[1000px]">
          <h1 className="heading-1 font-medium mb-4 text-center">{heading}</h1>
          <p className="body-1 text-grey-600 max-w-[800px] mx-auto text-center">
            {intro}
          </p>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-center md:justify-between gap-6 bg-cyan-50 p-6 lg:px-10 lg:py-6 max-w-[772px] w-full lg:w-4/5 mx-auto rounded-lg">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className="flex flex-row md:flex-col justify-between gap-2 w-full sm:w-fit"
            >
              <div
                className={cn(
                  "body-3 text-cyan-900 font-semibold",
                  // Only the third column carries it in the theme's template.
                  i === 2 && "mb-2",
                )}
              >
                {fact.label}
              </div>
              <div className="body-2 text-grey-600 font-medium inline-flex gap-2 items-center">
                {fact.flag && (
                  <Image
                    src={fact.flag}
                    alt={fact.flagAlt ?? fact.value}
                    width={30}
                    height={20}
                    className="w-[30px] h-5"
                  />
                )}
                {fact.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
