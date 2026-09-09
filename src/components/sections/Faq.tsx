"use client";

import { useState } from "react";
import { Tag } from "@/components/ui/button";
import { PlusMinusIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Shared FAQ accordion.
 *
 * Defaults reproduce the homepage's block; the product and About pages pass
 * their own tag, heading pair and rows. The heading really is two coloured
 * halves in the markup rather than one string with a span, so it stays a pair
 * here — `headingLines[1]` is the cyan word.
 */
export function Faq({
  tag = "Common Questions",
  headingLines = ["Frequently Asked", "Questions"],
  email = "info@chinasourcing.co",
  items,
  className = "faq py-10 lg:pt-20 lg:pb-[120px]",
}: {
  tag?: string;
  headingLines?: string[];
  email?: string | null;
  items: { question: string; answer: string }[];
  className?: string;
}) {
  // The original opens the first row on load.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={className}>
      <div className="container flex flex-col lg:flex-row gap-10 2xl:gap-[120px]">
        {/* Theme viết `lg:min-w-5/12 2xl:min-w-1/3` ở đây, nhưng trong
            Tailwind v3 thang `min-width` KHÔNG có phân số — hai lớp đó không
            sinh ra CSS nào bên site gốc. v4 thì có, nên chép nguyên văn là đổi
            hẳn bố cục: hai cột `w-5/12` + `w-7/12` cộng thêm `gap-10` rộng hơn
            hàng 39px, bình thường chúng co lại theo tỉ lệ (377 / 527 ở 1024px);
            có min-width thì cột trái không co được nữa và thành 393 / 511 —
            cột FAQ hẹp đi 16px, đủ để một câu trả lời xuống thêm dòng và cả
            section cao dư 28-56px. Bỏ hẳn, đúng như bản gốc phân giải ra. */}
        <div className="w-full lg:w-5/12 2xl:w-1/3">
          <Tag className="mx-auto lg:ml-0">{tag}</Tag>

          <h2 className="heading-2 font-medium mb-3 lg:mb-8 mt-3 flex flex-wrap gap-x-1 justify-center lg:justify-start">
            <span className="text-dark-blue-950 whitespace-pre-wrap">
              {headingLines[0]}
            </span>
            <span className="text-cyan-400">{headingLines[1]}</span>
          </h2>

          {email && (
            <p className="body-2 text-center lg:text-left text-grey-600 font-medium">
              Still have questions? Reach out to us at{" "}
              <a
                href={`mailto:${email}`}
                className="text-dark-blue-900 hover:text-dark-blue-500 underline"
              >
                {email}
              </a>
            </p>
          )}
        </div>

        <div className="faq-wrapper w-full lg:w-7/12 2xl:w-2/3">
          {items.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className="faq-item border-b border-grey-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={cn(
                    "w-full text-left p-6 flex justify-between gap-6 items-start duration-300 text-dark-blue-950 cursor-pointer",
                    isOpen && "bg-dark-blue-50",
                  )}
                >
                  <span className="body-2 font-semibold">{faq.question}</span>
                  <span className="shrink-0 transition-transform duration-300">
                    <PlusMinusIcon open={isOpen} />
                  </span>
                </button>
                <div
                  className={cn(
                    // `whitespace-pre-line`: the theme separates paragraphs
                    // inside an answer with `<br /><br />`, which the extractor
                    // keeps as a blank line.
                    "bg-dark-blue-50 overflow-hidden text-grey-600 transition-all duration-500 ease-in-out body-3 font-medium whitespace-pre-line",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 p-6 pt-0"
                      : "max-h-0 opacity-0 p-0",
                  )}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
