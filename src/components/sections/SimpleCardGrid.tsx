import Image from "next/image";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export type SimpleCard = {
  icon: string | null;
  title: string;
  body: string;
};

/**
 * The `.simple-card` band — icon / title / body cards on the dark indigo block.
 *
 * About and the case study pages centre their header; the service pages
 * left-align theirs. Same markup otherwise, so the alignment is a prop rather
 * than a second component.
 */
export function SimpleCardGrid({
  tag,
  heading,
  intro,
  cards,
  align = "center",
  columns = 3,
}: {
  tag: string;
  heading: string;
  intro?: string | null;
  cards: SimpleCard[];
  align?: "center" | "left";
  /** Số cột từ `xl` trở lên. Theme khai theo từng khối, không theo số thẻ. */
  columns?: 3 | 4;
}) {
  const centred = align === "center";

  return (
    <section className="simple-card spacing bg-dark-blue-950">
      <div className="container space-y-20">
        <div
          className={cn(
            "flex flex-col gap-3",
            centred && "justify-center items-center",
          )}
        >
          <Reveal>
            <Tag className={centred ? "mx-auto" : "mx-auto lg:ml-0"}>{tag}</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="heading-2 font-semibold text-white lg:text-left text-center">
              {heading}
            </h2>
          </Reveal>
          {intro && (
            <Reveal delay={150}>
              <p className="text-dark-blue-50 body-2 max-w-[800px] lg:text-left text-center">
                {intro}
              </p>
            </Reveal>
          )}
        </div>

        {/* Số cột ở `xl` là của TỪNG KHỐI, không suy ra từ số thẻ: About có 3
            thẻ và trang service có 5, cả hai đều `xl:grid-cols-3`; trang case
            study có 4 thẻ và dùng `xl:grid-cols-4` (đã đọc lại từ markup của
            tag-apparel, prestige-residential và muscle-mat). Dưới `xl` thì mọi
            trang giống nhau: `lg:grid-cols-3 md:grid-cols-2`, một cột ở mobile.
            Cả hai chuỗi lớp phải viết ĐỦ chữ — Tailwind quét tĩnh, ghép
            `xl:grid-cols-${columns}` là không sinh ra lớp nào. */}
        <div
          className={cn(
            "grid gap-6 gap-y-10 lg:gap-10 lg:gap-y-16 lg:grid-cols-3 md:grid-cols-2",
            columns === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3",
          )}
        >
          {cards.map((card, i) => (
            // 150 / 200 / 250 … — the stagger the original writes out by hand.
            <Reveal key={card.title} delay={150 + i * 50} className="space-y-3">
              {card.icon && (
                <Image
                  src={card.icon}
                  alt="icon"
                  width={32}
                  height={32}
                  className="size-8 min-w-8"
                />
              )}
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
