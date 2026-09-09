"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTypewriter, INTERNAL_TYPING } from "@/hooks/useTypewriter";

export type ProductHeroData = {
  typedPrefix?: string;
  typedWords?: string[];
  heading: string;
  intro: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: string | null;
  imageAlt: string;
};

/**
 * Product page opener.
 *
 * Same shell as the About hero — heading and intro left, square photo right,
 * the same rotated blue ellipse bleeding out of the bottom-left corner — with
 * a solid CTA under the intro that About does not have.
 *
 * The ellipse is an inline SVG rather than a CSS gradient because it is rotated
 * 40.692° and clipped by the section's `overflow-hidden`; a `radial-gradient`
 * cannot be rotated without a second positioned layer.
 *
 * ## The typed line
 *
 * `/products` opens with a line the 15 category pages do not have: the literal
 * word "Source" followed by a TypeIt animation cycling all 15 category names in
 * cyan Lora, above the static "All in One Place". The words live in the markup
 * as a hidden `.content-typeit` list, which is where they were read from.
 * `typedWords` is empty on the category pages, so the line is simply absent
 * there — same component, no branch in the page.
 */
export function ProductHero({
  hero,
}: {
  hero: ProductHeroData;
}) {
  const words = hero.typedWords ?? [];
  const typed = useTypewriter(words, INTERNAL_TYPING);

  return (
    <section className="relative overflow-hidden lg:min-h-screen">
      <svg
        className="absolute -z-10 bottom-0 left-0"
        width="196"
        height="434"
        viewBox="0 0 196 434"
        fill="none"
        aria-hidden
      >
        <ellipse
          cx="-30.0357"
          cy="217.006"
          rx="251.5"
          ry="186"
          transform="rotate(40.692 -30.0357 217.006)"
          fill="url(#product-hero-glow)"
          fillOpacity="0.2"
        />
        <defs>
          <radialGradient
            id="product-hero-glow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-30.0357 217.006) rotate(90) scale(186 251.5)"
          >
            <stop stopColor="#36A9E1" />
            <stop offset="1" stopColor="white" />
          </radialGradient>
        </defs>
      </svg>

      <div className="container flex py-10 lg:flex-row flex-col justify-between lg:items-center gap-[60px]">
        <div className="flex-1">
          {/* Dòng TypeIt và tiêu đề tĩnh nằm CHUNG một khối, và khối chứa dòng
              TypeIt là `display: contents` — đúng như theme viết. Chi tiết đó
              không phải trang trí: `contents` làm mọi thuộc tính hộp trên chính
              nó vô hiệu, nên bộ `min-h-12 lg:min-h-16 xl:min-h-20` mà theme đặt
              ở đây KHÔNG có tác dụng gì bên site gốc. Trước đây bản clone đặt
              chúng lên một hộp thật: dòng chữ cao 48px thay vì 35px và hero dài
              hơn bản gốc 13px ở mọi bề rộng dưới `lg`. */}
          <div>
            {words.length > 0 && (
              <div className="relative text-dark-blue-950 text-balance xl:min-h-20 lg:min-h-16 min-h-12 contents heading-1 font-medium">
                {hero.typedPrefix}{" "}
                <span className="text-cyan-400 font-lora">{typed}</span>
                {/* TypeIt draws its own caret; this is the same 1s blink. */}
                <span className="animate-caret ml-0.5 inline-block w-[3px] h-[0.8em] align-middle bg-cyan-400" />
              </div>
            )}
            <h1 className="heading-1 font-medium text-dark-blue-950">
              {hero.heading}
            </h1>
          </div>
          <p className="body-1 mt-4 text-grey-600 font-medium">{hero.intro}</p>
          {hero.ctaLabel && hero.ctaHref && (
            <Button
              href={hero.ctaHref}
              variant="primary"
              withArrow
              className="mt-6 w-fit"
            >
              {hero.ctaLabel}
            </Button>
          )}
        </div>

        <div className="xl:max-w-[702px] lg:max-w-[500px] flex-1 rounded-3xl relative overflow-hidden flex justify-center items-center">
          <div className="w-full h-auto aspect-square rounded-3xl relative overflow-hidden">
            {hero.image && (
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                width={702}
                height={702}
                priority
                className="aspect-square object-cover hover:scale-105 duration-300 rounded-3xl w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
