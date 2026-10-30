import Image from "next/image";
import Link from "next/link";
import type { BlogCardData } from "@/components/sections/resources/BlogCard";

/**
 * "Explore More Related Resources" — thiết kế v2.
 *
 * Desktop: nền #F7F9FD, pill + tiêu đề 40px xanh canh giữa, lưới 3 thẻ indigo.
 * Hover thẻ: nâng -4px + bóng navy, nền đậm lên (#3A47A3 → #20287A, KHÔNG sáng
 * lên), ảnh phóng 1.03 — chuẩn hover card chung của spec Motion.
 *
 * Mobile: dải vuốt ngang, thẻ 280px (~1,3 thẻ mỗi màn) thay vì 3 thẻ xếp dọc.
 */
export function RelatedResources({
  tag,
  heading,
  cards,
}: {
  tag: string;
  heading: string;
  cards: BlogCardData[];
}) {
  return (
    <section className="bg-white md:bg-[#F7F9FD] pt-4 pb-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-start px-4 md:items-center md:px-0 md:text-center">
          {tag && (
            <div className="hidden md:block rounded-full border border-cyan-400 px-4 py-1.5 text-sm text-cyan-400">
              {tag}
            </div>
          )}
          <h2 className="md:mt-4 text-xl md:text-[40px] md:leading-[1.2] font-semibold text-cyan-400">
            {heading}
          </h2>
        </div>

        <div className="mt-3.5 md:mt-12 flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-2 [scrollbar-width:none] md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rel-card group flex shrink-0 basis-[280px] snap-start flex-col overflow-hidden rounded-xl bg-[#3A47A3] text-white no-underline md:basis-auto"
            >
              <div className="h-[120px] md:h-[200px] overflow-hidden bg-[#C9CED8]">
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.alt}
                    width={600}
                    height={400}
                    sizes="(min-width: 768px) 384px, 280px"
                    className="rel-card-img h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 md:gap-2.5 p-3.5 md:p-6">
                {card.category && <div className="text-xs md:text-[13px] text-[#C9D2F7]">{card.category}</div>}
                <div className="text-[15px] md:text-lg font-semibold leading-[1.4]">{card.title}</div>
                <div className="mt-auto pt-1 md:pt-3 text-xs md:text-[13px] text-[#C9D2F7]">
                  {[card.date, card.readingTime].filter(Boolean).join(" · ")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
