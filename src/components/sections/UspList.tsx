import Image from "next/image";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export type UspListItem = { title: string; body: string };

/**
 * The `.usp-list` band — a rule-separated list beside a single product shot.
 *
 * Shared by About ("The Reasons to Choose Us", which adds an intro paragraph)
 * and every product page ("Why China Sourcing Co for ..."), which are the same
 * markup with different copy. Note the two pages point at different star
 * assets: `star-05.png` on About, `star-05-1.png` on the product pages.
 *
 * `flex-col-reverse` below `lg` is deliberate — on narrow screens the photo
 * belongs above the list, and reversing the column gets it there without a
 * second copy of the markup.
 */
export function UspList({
  tag,
  heading,
  intro,
  icon,
  image,
  items,
}: {
  tag: string;
  heading: string;
  intro?: string;
  icon: string | null;
  image: string | null;
  items: UspListItem[];
}) {
  return (
    <section className="usp-list spacing">
      <div className="container 2xl:px-0">
        <div className="flex flex-col gap-3 justify-center items-center mb-16">
          <Tag className="mx-auto">{tag}</Tag>
          <Reveal>
            <h2 className="heading-2 font-semibold text-cyan-400 max-w-[815px] text-center">
              {heading}
            </h2>
          </Reveal>
          {intro && (
            <Reveal>
              <p className="body-2 text-grey-600 max-w-[815px] text-center">
                {intro}
              </p>
            </Reveal>
          )}
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-10 2xl:gap-[88px] items-stretch">
          <div className="w-full lg:w-1/2 flex flex-col justify-between gap-4">
            {items.map((item) => (
              <Reveal
                key={item.title}
                className="usp-list-item transition-all duration-300 text-dark-blue-900 py-4 border-b border-grey-200"
              >
                <div className="flex items-center gap-4 md:gap-10">
                  <div className="usp-list-icon shrink-0 transition-transform duration-300">
                    {icon && (
                      <Image
                        src={icon}
                        alt=""
                        width={32}
                        height={32}
                        className="size-8"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="heading-3 font-semibold mb-2 text-cyan-400">
                      {item.title}
                    </h3>
                    <p className="body-2 text-grey-600">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="w-full lg:w-1/2 flex justify-center items-center">
            {image && (
              <Image
                src={image}
                alt="Image"
                width={600}
                height={600}
                className="w-full h-auto max-h-[466px] object-contain rounded-lg"
              />
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
