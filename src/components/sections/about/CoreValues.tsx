import Image from "next/image";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export type CoreValuesCard = { icon: string; title: string; body: string };

/** "Mission, Vision & Values" — three icon-led cards on the dark band. */
export function CoreValues({
  tag,
  heading,
  cards,
}: {
  tag: string;
  heading: string;
  cards: CoreValuesCard[];
}) {
  return (
    <section className="simple-card spacing bg-dark-blue-950">
      <div className="container space-y-20">
        <div className="flex flex-col gap-3 justify-center items-center">
          <Reveal>
            <Tag className="mx-auto">{tag}</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="heading-2 font-semibold text-white lg:text-left text-center">
              {heading}
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-6 gap-y-10 lg:gap-10 lg:gap-y-16 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2">
          {cards.map((card, i) => (
            // 150 / 200 / 250 — the stagger the original writes out by hand.
            <Reveal key={card.title} delay={150 + i * 50} className="space-y-3">
              <Image
                src={card.icon}
                alt="icon"
                width={32}
                height={32}
                className="size-8 min-w-8"
              />
              <h3 className="heading-3 text-white font-semibold font-lora">
                {card.title}
              </h3>
              <p className="body-2 text-dark-blue-400">{card.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
