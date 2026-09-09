import Image from "next/image";
import Link from "next/link";
import { Button, Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { CalendarIcon, ClockIcon } from "@/components/icons";

export type ResourceCard = {
  href: string;
  image: string | null;
  alt: string;
  /** Post type shown above the title ("Blog"). Absent on the service pages. */
  category?: string | null;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
};

/**
 * `.resource-card` — three linked article cards on the grey band.
 *
 * `grow` on both the title and the excerpt is what keeps the meta row flush
 * with the bottom of every card regardless of how long the copy runs; the
 * original leans on it rather than a fixed height.
 */
export function ResourceCards({
  tag,
  headingLines,
  cards,
  ctaLabel,
  ctaHref,
}: {
  tag: string;
  headingLines: string[];
  cards: ResourceCard[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
}) {
  return (
    <section className="resource-card py-24 lg:pt-20 lg:pb-[120px] bg-grey-50">
      <div className="container">
        <Tag className="mx-auto">{tag}</Tag>

        <h2 className="heading-2 font-medium mb-3 lg:mb-8 mt-3 flex flex-wrap gap-x-1 justify-center">
          <span className="text-dark-blue-950 whitespace-pre-wrap">
            {headingLines[0]}
          </span>
          <span className="text-cyan-400">{headingLines[1]}</span>
        </h2>

        <div className="flex flex-row flex-wrap w-full gap-6 md:gap-10 justify-center mt-10">
          {cards.map((card) => (
            <Reveal
              key={card.href}
              className="flex flex-row md:w-[calc(50%-20px)] xl:w-[calc(33.33%-27px)] w-full"
            >
              <Link
                href={card.href}
                className="flex flex-row w-full bg-dark-blue-900 hover:bg-dark-blue-800 transition-all duration-300 text-white rounded-lg group overflow-hidden"
              >
                <div className="flex flex-col rounded-lg w-full">
                  {card.image && (
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={600}
                      height={400}
                      className="w-full aspect-[3/2] object-cover rounded-lg group-hover:scale-105 transition-all"
                    />
                  )}
                  {card.category && (
                    <div className="body-3 text-dark-blue-400 font-medium px-6 pt-6 font-lora">
                      {card.category}
                    </div>
                  )}
                  <h3 className="body-1 mt-2 mb-4 font-medium px-6 grow">
                    {card.title}
                  </h3>
                  <p className="body-3 font-medium text-dark-blue-400 px-6 grow">
                    {card.excerpt}
                  </p>
                  <div className="flex items-center gap-2 body-3 text-grey-200 px-6 pb-6 mt-20 font-lora">
                    <CalendarIcon className="w-6 h-6" />
                    <div className="font-lora">{card.date}</div>
                    <div className="w-px h-7 bg-grey-200" />
                    <ClockIcon className="w-6 h-6" />
                    <div className="font-lora">{card.readTime}</div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Nút "Explore our full Resource Hub" / "See All Resources" nằm ở
            HÀNG RIÊNG của nó bên site gốc — `div.flex justify-center mt-10`
            ngay sau lưới thẻ. Để nó bên trong lưới (như trước) thì nó thành
            một flex item nữa: ở 768px nó nằm cạnh thẻ thứ 3 và bị kéo cao
            bằng thẻ (624px), còn cả khối thì hụt đúng 90px so với bản gốc. */}
        {ctaLabel && ctaHref && (
          <div className="flex justify-center items-center mt-10">
            <Button href={ctaHref} variant="primary" withArrow>
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
