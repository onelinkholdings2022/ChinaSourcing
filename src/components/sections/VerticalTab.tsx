"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type VerticalTabItem = {
  label: string;
  image?: string | null;
  alt?: string;
  body?: string;
  linkLabel?: string | null;
  linkHref?: string | null;
};

/**
 * `.vertical-tab` — a rail of category buttons beside an image/text panel.
 *
 * The rail is a column above 1024px and a horizontally scrolling row below it
 * (`flex lg:flex-col … overflow-auto`), which is why the buttons carry
 * `flex-shrink-0` and `whitespace-nowrap`: on mobile they must keep their width
 * and scroll rather than wrap into a block of stacked text.
 *
 * The panel enters from the right — the theme's Alpine transition is
 * `opacity-0 translate-x-20` → `opacity-100 translate-x-0` over 500ms ease-out.
 * Re-mounting the panel on each change (via the `key`) is what restarts it.
 */
export function VerticalTab({
  tag,
  heading,
  intro,
  ctaLabel,
  ctaHref,
  tabs,
}: {
  tag: string;
  heading: string;
  intro?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  tabs: VerticalTabItem[];
}) {
  const [active, setActive] = useState(0);
  const panel = tabs[active];

  return (
    <section className="vertical-tab container spacing space-y-10">
      <div className="text-center flex flex-col justify-center items-center">
        <Tag className="mx-auto">{tag}</Tag>
        <Reveal>
          <h2 className="heading-2 mt-3 text-cyan-400 font-semibold">
            {heading}
          </h2>
        </Reveal>
        {intro && (
          <Reveal>
            <p className="mt-4 text-lg max-w-[450px]">{intro}</p>
          </Reveal>
        )}
        {ctaLabel && ctaHref && (
          <Button href={ctaHref} variant="primary" withArrow className="mt-6">
            {ctaLabel}
          </Button>
        )}
      </div>

      <div className="max-w-[1168px] mx-auto lg:flex-row flex-col flex lg:items-center lg:gap-20 gap-12">
        <div className="relative">
          <div className="overflow-hidden relative">
            <div className="flex lg:flex-col gap-4 no-scrollbar lg:pr-4 lg:pb-0 pb-4 overflow-auto scroll-smooth">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex-shrink-0 rounded-lg px-6 lg:text-start py-4 transition-colors duration-300 whitespace-nowrap cursor-pointer",
                    i === active
                      ? "bg-dark-blue-950 text-white body-3 font-medium"
                      : "text-grey-400 hover:bg-cyan-50",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* `lg:w-full lg:max-w-[800px]` là phần BÙ cho `next/image`, không có
            trong theme. Site gốc dùng `<img>` thường: bề rộng NỘI TẠI của ảnh
            đẩy cột này ra tới trần `max-w-[800px]` của khối bên trong. Ở đây
            ảnh là `fill` (position: absolute) nên không đóng góp gì vào
            max-content, cột co lại theo dòng chữ dài nhất — 684px thay vì 800
            ở 1512px, ảnh tỉ lệ 800/376 thấp theo, cả section hụt 55px.
            Chỉ đặt từ `lg`: dưới mốc đó hàng xếp dọc và cột vốn đã rộng hết
            phần còn lại, giống hệt bản gốc. */}
        <div className="relative will-change-transform lg:w-full lg:max-w-[800px]">
          {panel && (
            <div
              key={panel.label}
              className="space-y-4 max-w-[800px] mx-auto lg:ml-0 lg:mr-auto animate-tab-in"
            >
              <div className="w-full aspect-[800/376] relative bg-stone-50 rounded-xl overflow-hidden">
                {panel.image && (
                  <Image
                    src={panel.image}
                    alt={panel.alt ?? ""}
                    fill
                    sizes="(max-width: 1023px) 100vw, 800px"
                    className="block w-full h-full object-cover"
                  />
                )}
              </div>
              {panel.body && (
                <div className="text-grey-600 font-medium body-2">
                  <p>{panel.body}</p>
                </div>
              )}
              {panel.linkLabel && panel.linkHref && (
                <Link
                  href={panel.linkHref}
                  className="flex gap-2 items-center font-semibold duration-300 group text-cyan-400 hover:underline hover:text-dark-blue-950 transition-all w-fit"
                >
                  {panel.linkLabel}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRightIcon className="w-5 h-5" />
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
