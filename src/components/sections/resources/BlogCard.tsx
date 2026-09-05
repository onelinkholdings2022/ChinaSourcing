import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogCard as BlogCardData } from "@/data/resources";

/**
 * The indigo post card.
 *
 * Two near-identical dressings in the theme, kept as one component because the
 * structure is the same and only weights and hover differ:
 *
 * - `listing` (`.blog-card` on `/resources`) — semibold text, `line-clamp-4`
 *   excerpt that does not grow, hover lightens to `dark-blue-700`.
 * - `related` ("Explore More Relative Resources") — medium text, excerpt grows,
 *   hover lightens to `dark-blue-800` and the image scales 105%.
 */
export function BlogCard({
  card,
  variant = "listing",
}: {
  card: BlogCardData;
  variant?: "listing" | "related";
}) {
  const related = variant === "related";

  return (
    <Link
      href={card.href}
      className={cn(
        "flex flex-row md:w-[calc(50%-20px)] xl:w-[calc(33.33%-27px)] transition-all duration-300 text-white rounded-lg bg-dark-blue-900",
        related
          ? "w-full hover:bg-dark-blue-800 group overflow-hidden"
          : "blog-card hover:bg-dark-blue-700",
      )}
    >
      <div className={cn("flex flex-col rounded-lg", related && "w-full")}>
        {card.image && (
          <Image
            src={card.image}
            alt={card.alt}
            width={1024}
            height={683}
            className={cn(
              "w-full aspect-[3/2] object-cover rounded-t-lg",
              related && "group-hover:scale-105 transition-all",
            )}
          />
        )}

        {card.category && (
          <div
            className={cn(
              "body-3 text-dark-blue-400 px-6 pt-6 font-lora",
              related ? "font-medium" : "font-semibold",
            )}
          >
            {card.category}
          </div>
        )}

        <h3
          className={cn(
            "body-1 mt-2 mb-4 px-6 grow",
            related ? "font-medium" : "font-semibold",
          )}
        >
          {card.title}
        </h3>

        <p
          className={cn(
            "body-3 font-medium text-dark-blue-400 px-6",
            related ? "grow" : "line-clamp-4 grow-0",
          )}
        >
          {card.excerpt}
        </p>

        <div className="flex items-center gap-2 body-3 text-grey-200 px-6 pb-6 mt-20 font-lora">
          <Image src="/images/calendar.svg" alt="" aria-hidden width={24} height={24} className="w-6 h-6" />
          <div className="font-lora">{card.date}</div>
          <div className="w-[1px] h-7 bg-grey-200" />
          <Image src="/images/clock.svg" alt="" aria-hidden width={24} height={24} className="w-6 h-6" />
          <div className="font-lora">{card.readingTime}</div>
        </div>
      </div>
    </Link>
  );
}
