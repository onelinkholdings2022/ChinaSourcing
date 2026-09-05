import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export type ProductListCard = {
  image: string | null;
  alt: string;
  title: string;
  body: string;
  href: string | null;
  ctaLabel: string;
};

/**
 * "Our Product Range" — the 15 category cards on `/products`.
 *
 * ## The hover
 *
 * Each card has two stacked caption layers, and only the second one moves:
 *
 *  - the resting bar (title + arrow) rises 40px and fades out
 *    (`group-hover:-translate-y-10`, `group-hover:opacity-0`)
 *  - a detail panel pinned to the bottom grows from `h-0` to `h-[90%]` and its
 *    contents slide up 16px into place on a 200/250ms stagger
 *
 * The panel is `lg:` only. Below 1024px there is nothing to hover, so the
 * original drops the whole mechanism: the panel is statically visible
 * (`opacity-100 translate-y-0`) and the card becomes a plain stacked block via
 * `max-[1023px]:flex-col`. Reproduced exactly — a card that needs a hover to
 * reveal its link would be a dead end on a phone.
 */
export function ProductListGrid({
  tag,
  heading,
  intro,
  cards,
}: {
  tag: string;
  heading: string;
  intro: string;
  cards: ProductListCard[];
}) {
  return (
    <section className="product-list spacing" id="products">
      <div className="container">
        <div className="flex flex-col items-center md:max-w-[800px] mx-auto w-full md:w-5/6">
          <Tag className="mx-auto">{tag}</Tag>
          <Reveal>
            <h2 className="heading-2 font-semibold text-center mt-3 mx-auto text-cyan-400">
              {heading}
            </h2>
          </Reveal>
          <Reveal>
            <p className="body-2 text-center font-medium mt-4">{intro}</p>
          </Reveal>
        </div>

        <div className="flex flex-wrap justify-center gap-10 mt-10 lg:mt-16">
          {cards.map((card) => (
            <Reveal
              key={card.title}
              className="group w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-27px)] 2xl:w-[calc(25%-30px)]"
            >
              <div className="relative w-full sm:h-full h-auto rounded-lg overflow-hidden bg-grey-50 max-[1023px]:flex max-[1023px]:flex-col">
                <div className="w-full h-auto max-[1023px]:min-h-fit aspect-[342/232] z-[1] overflow-hidden">
                  <div className="w-full h-full group-hover:scale-105 duration-300">
                    {card.image && (
                      <Image
                        src={card.image}
                        alt={card.alt}
                        width={1000}
                        height={677}
                        className="w-full h-auto aspect-[3/2] object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Resting caption — desktop only; it is what the panel covers. */}
                <div className="bg-grey-50 overflow-visible z-[1]">
                  <div className="relative lg:flex hidden group-hover:-translate-y-10 transition-all group-hover:h-[110%] duration-300 p-4 flex-row justify-between items-center gap-4 bg-grey-50">
                    <div className="text-2xl text-dark-blue-900 font-medium font-poppins duration-300 group-hover:opacity-0">
                      {card.title}
                    </div>
                    <Image
                      src="/images/arrow-next-button.svg"
                      alt=""
                      aria-hidden
                      width={48}
                      height={48}
                      className="w-12 h-12 group-hover:opacity-0 duration-300"
                    />
                  </div>
                </div>

                <div className="lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-auto lg:group-hover:h-[90%] lg:h-0 lg:delay-75 lg:duration-300 bg-grey-50 lg:z-[2] flex flex-col max-[1023px]:h-full">
                  <div className="p-4 relative flex-1 flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="text-2xl !leading-snug text-dark-blue-900 font-medium font-poppins duration-300 lg:translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 lg:opacity-0 opacity-100 translate-y-0 delay-200 ease-in-out">
                        {card.title}
                      </div>
                      <div className="font-medium font-poppins text-base !leading-snug text-grey-700 duration-300 lg:translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 lg:opacity-0 opacity-100 translate-y-0 delay-[250ms] ease-in-out">
                        {card.body}
                      </div>
                    </div>
                    <div className="group-hover:opacity-100 lg:opacity-0 opacity-100 translate-y-0 delay-[250ms] duration-300 lg:translate-y-4 group-hover:translate-y-0 ease-in-out">
                      {card.href && (
                        <Link
                          href={card.href}
                          className="flex gap-2 items-center justify-center md:px-6 md:py-3 py-4 px-4 rounded-lg font-semibold duration-300 border border-dark-blue-950 text-dark-blue-950 bg-transparent hover:bg-dark-blue-50 mt-6 w-full"
                        >
                          {card.ctaLabel}
                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden
                            >
                              <path
                                d="M4 12H20M20 12L14 6M20 12L14 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
