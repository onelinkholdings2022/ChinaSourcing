import Image from "next/image";

/** One row of the hero's pale blue fact box. */
export type ArticleFact = { label: string; icon: string | null; value: string };

/**
 * The opener of an article — centred title over a pale blue fact box
 * (Tag / Date / Reading Time), with the same two blurred wedges as the
 * case-study hero.
 *
 * Not a `<section>` on the original but a plain `<div>`, and its top padding
 * (`pt-24 lg:pt-[120px]`) is what clears the fixed header — so the page does
 * not add its own.
 */
export function ArticleHero({
  title,
  subtitle,
  facts,
}: {
  title: string;
  subtitle: string;
  facts: ArticleFact[];
}) {
  return (
    <div className="relative pt-24 lg:pt-[120px] overflow-hidden">
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
        <div className="md:w-11/12 md:mx-auto max-w-[800px]">
          <h1 className="heading-1 font-medium text-center mb-4">{title}</h1>
          {/* The theme prints this paragraph even when empty — posts have no
              subtitle, only the resource downloads do. */}
          <p className="text-center body-1 text-grey-600">{subtitle}</p>
        </div>

        <div className="mt-6 lg:mt-10 bg-cyan-50 p-6 lg:px-10 lg:py-6 max-w-[772px] w-full lg:w-4/5 mx-auto rounded-lg flex justify-center items-center">
          <div className="flex flex-col sm:flex-row justify-center gap-6 md:justify-between w-full">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-row sm:flex-col justify-between gap-2 w-full sm:w-fit"
              >
                <div className="inline-flex gap-2 body-3 text-cyan-900 font-semibold">
                  {fact.icon && (
                    <Image
                      src={fact.icon}
                      alt=""
                      aria-hidden
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  )}
                  {fact.label}
                </div>
                <div className="body-2 text-grey-600 font-medium">
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
