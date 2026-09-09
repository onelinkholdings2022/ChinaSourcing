"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button, Tag } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { PartnerTabViewData } from "@/lib/views/homeView";
import { useUrlFilter } from "@/hooks/useUrlFilter";

/**
 * Industry tabs over a grid of factory logos. The tab rail scrolls
 * horizontally when it overflows, with arrow buttons that fade out at
 * either end.
 *
 * ## Tab đổi URL nhưng KHÔNG rời trang
 *
 * Giống hệt rail category của `.blog-listing` (xem `BlogListing`): mỗi category
 * có URL riêng `/<slug>`, gõ thẳng vào thanh địa chỉ thì server render đúng
 * category đó, nhưng BẤM một tab thì chỉ đổi lưới logo tại chỗ và thay URL
 * bằng `history.pushState`. Không fetch lại, không rèm chuyển trang.
 *
 * Bốn trong bảy slug (`point-of-sale`, `gym-fitness`, `hospitality-items`,
 * `household-appliances`) trùng với một trang product, và trang product nhận —
 * nên F5 ở một trong bốn URL đó ra trang sản phẩm cùng ngành chứ không phải
 * dải logo. Đó là chủ ý: hai thứ nói về cùng một ngành. Ba slug còn lại render
 * lại thân `/products` với đúng tab này mở sẵn.
 */
export function Partners({
  tag = "Manufacturing Network",
  headingLines = ["Our Trusted", "Manufacturing Partners"],
  tabs,
  activeCategory,
}: {
  tag?: string;
  headingLines?: string[];
  tabs: PartnerTabViewData[];
  /** Slug category server render — chỉ là giá trị khởi tạo, xem chú thích trên. */
  activeCategory?: string;
}) {
  const partnerTabs = tabs;

  // Rail ngành nhà máy: mỗi ngành có URL riêng `/<slug>`, bấm thì đổi lưới
  // logo tại chỗ và URL đổi theo — cùng hợp đồng với rail category blog, xem
  // `useUrlFilter`.
  //
  // Rail này KHÔNG có mục "All": theme luôn mở sẵn một ngành, nên `resetValue`
  // là ngành đầu tiên. Nhờ vậy `/products` và trang chủ (không có slug ngành
  // trên URL) vẫn mở tab đầu như trước.
  const values = useMemo(() => partnerTabs.map((t) => t.value), [partnerTabs]);
  const first = partnerTabs[0]?.value ?? "";
  const [activeValue, select] = useUrlFilter({
    initial: activeCategory && values.includes(activeCategory) ? activeCategory : first,
    values,
    resetValue: first,
  });
  const active = Math.max(0, partnerTabs.findIndex((t) => t.value === activeValue));

  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const checkScroll = () => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scrollBy = (delta: number) => {
    railRef.current?.scrollBy({ left: delta, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="container spacing">
      <Tag className="mx-auto">{tag}</Tag>

      <h2 className="heading-2 font-medium mb-3 lg:mb-8 mt-3 flex flex-wrap gap-x-1 justify-center">
        <span className="text-dark-blue-950 whitespace-pre-wrap">
          {headingLines[0]}
        </span>
        <span className="text-cyan-400">{headingLines[1]}</span>
      </h2>

      <div className="mx-auto mt-16">
        {/* Tab rail */}
        <div className="relative">
          <button
            type="button"
            aria-label="Scroll tabs left"
            onClick={() => scrollBy(-200)}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg z-10 transition-opacity duration-300 p-3 rounded-full text-dark-blue-900",
              atStart && "opacity-10 cursor-not-allowed pointer-events-none",
            )}
          >
            <ChevronRightIcon className="rotate-180" />
          </button>

          <div
            ref={railRef}
            onScroll={checkScroll}
            className="overflow-x-auto no-scrollbar border-b border-grey-200"
          >
            <div className="flex w-max mx-auto">
              {partnerTabs.map((tab, i) => {
                const className = cn(
                  "flex-shrink-0 text-base leading-7 px-6 py-4 transition-colors duration-300 whitespace-nowrap cursor-pointer",
                  active === i
                    ? "bg-dark-blue-900 text-white"
                    : "text-grey-400 hover:text-dark-blue-900",
                );
                // `<a>` thường, KHÔNG phải `next/link`: Link prefetch cả trang
                // đích rồi router.push khi bấm, mà ở đây không có lượt điều
                // hướng nào để đẩy. `data-no-transition` bảo `PageTransition`
                // đừng kéo rèm (nó nghe ở pha capture nên phần tử không tự rút
                // lui được).
                return tab.href ? (
                  <a
                    key={tab.value}
                    href={tab.href}
                    data-no-transition
                    className={className}
                    onClick={(e) => {
                      // Cmd/Ctrl/Shift-click hoặc chuột giữa: để trình duyệt mở
                      // tab mới bằng đúng `href` — lý do pill vẫn là thẻ <a>.
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      select(tab.value, tab.href);
                    }}
                  >
                    {tab.label}
                  </a>
                ) : (
                  <button key={tab.value} type="button" onClick={() => select(tab.value)} className={className}>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label="Scroll tabs right"
            onClick={() => scrollBy(200)}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg z-10 transition-opacity duration-300 p-3 rounded-full text-dark-blue-900",
              atEnd && "opacity-10 cursor-not-allowed pointer-events-none",
            )}
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* Logo grid */}
        <div className="relative py-10 lg:py-[90px]">
          {partnerTabs.map((tab, i) => (
            <div
              key={tab.value}
              hidden={active !== i}
              className={cn(
                "overflow-hidden",
                active === i && "animate-in fade-in slide-in-from-right-4 duration-350",
              )}
            >
              <div className="flex justify-center items-center flex-wrap gap-y-10 gap-x-5 lg:gap-x-10 lg:gap-y-[62px]">
                {tab.logos.map((logo, n) => (
                  <div key={logo} className="w-[45%] md:w-[30%] lg:w-[20%]">
                    <div className="flex items-center justify-center h-[68px]">
                      <Image
                        src={logo}
                        alt={`${tab.label} factory logo ${n + 1}`}
                        width={300}
                        height={82}
                        className="h-[64px] w-auto object-contain grayscale hover:grayscale-0 hover:h-[68px] transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="/products" withArrow>
            Explore Our Products
          </Button>
        </div>
      </div>
    </section>
  );
}
