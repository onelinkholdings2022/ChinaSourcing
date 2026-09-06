import Image from "next/image";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export type ProductImageCard = {
  image: string | null;
  alt: string;
  title: string;
};

export type ImageCardGridData = {
  tag: string;
  heading: string;
  intro: string;
  cards: ProductImageCard[];
};

/**
 * "What We Source in ..." — a grid of photo cards with a caption bar.
 *
 * The zoom on hover is on an inner wrapper, not the `<img>`: the image sits in
 * a fixed `aspect-[342/232]` box with `overflow-hidden`, and the wrapper inside
 * it scales to 105%. Scaling the image itself would push it past the rounded
 * corners of the card, since the clip lives two levels up.
 *
 * Card counts differ per product (4 to 13), so the grid is fixed at 4/3/2
 * columns and the last row is simply short — the original does the same.
 */
export function ImageCardGrid({
  data,
}: {
  data: ImageCardGridData;
}) {
  return (
    <section className="image-card container spacing space-y-16">
      <div className="flex justify-center items-center flex-col text-center">
        <Tag className="mx-auto">{data.tag}</Tag>
        <Reveal>
          <h2 className="heading-2 text-cyan-400 mt-3 font-semibold">
            {data.heading}
          </h2>
        </Reveal>
        <Reveal>
          <p className="mt-4 body-2 max-w-[800px]">{data.intro}</p>
        </Reveal>
      </div>

      <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-10">
        {data.cards.map((card) => (
          <Reveal key={card.title} className="group w-full">
            <div className="relative w-full sm:h-full h-auto rounded-lg overflow-hidden bg-grey-50 max-[1023px]:flex max-[1023px]:flex-col">
              <div className="w-full h-auto max-[1023px]:min-h-fit aspect-[342/232] z-[1] overflow-hidden">
                <div className="w-full h-full group-hover:scale-105 duration-300">
                  {card.image && (
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={684}
                      height={464}
                      className="w-full h-auto aspect-[3/2] object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="bg-grey-50 overflow-visible z-[1]">
                <div className="relative duration-300 p-4 flex-row justify-between items-center gap-4 bg-grey-50">
                  <div className="text-2xl text-dark-blue-900 font-medium font-poppins duration-300">
                    {card.title}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
