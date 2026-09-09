"use client";

import Image from "next/image";
import Link from "next/link";
import type { HeroViewData } from "@/lib/views/homeView";
import { ArrowRightIcon } from "@/components/icons";
import { useTypewriter, HOME_TYPING } from "@/hooks/useTypewriter";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Hero({ hero }: { hero: HeroViewData }) {
  // speed 30 / pause 2000 / pause 1000, straight from the theme's TypeIt call.
  const typed = useTypewriter(hero.words, HOME_TYPING);

  // Video nền chỉ dựng từ `lg` trở lên. Dưới mốc đó trình duyệt di động chặn
  // autoplay, Vimeo lùi về giao diện player đầy đủ — nút play to đùng và THANH
  // ĐIỀU KHIỂN/CÀI ĐẶT nằm chình ình dưới đáy hero — mà `background=1&controls=0`
  // không cứu được, vì tham số đó chỉ có tác dụng khi video thật sự tự chạy.
  // Poster là đúng khung hình đầu của video nên hero trông không khác gì.
  //
  // Phải KHÔNG DỰNG chứ không phải `hidden lg:block`: iframe bị ẩn vẫn tải,
  // vẫn phát, và trên 4G thì đó là vài MB không ai xem.
  const showVideo = useMediaQuery("(min-width: 1024px)");

  return (
    <section className="hero-block lg:mx-6 lg:mt-6">
      <div className="lg:rounded-3xl relative w-full lg:mb-6 min-h-screen py-40 lg:py-56 2xl:py-[280px] overflow-hidden text-white flex items-center justify-center">
        {/* Background — poster stays mounted underneath so there is no flash
            while the Vimeo iframe loads (and it is the whole background when
            there is no video). */}
        <div className="absolute inset-0 lg:rounded-3xl overflow-hidden z-0">
          <Image
            src={hero.poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {hero.videoUrl && showVideo && (
            <iframe
              src={hero.videoUrl}
              title=""
              aria-hidden
              allow="autoplay; fullscreen"
              frameBorder={0}
              className="absolute top-1/2 left-1/2 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ width: "177.78vh", height: "56.25vw", minWidth: "100%", minHeight: "100%" }}
            />
          )}
        </div>
        {/* Dark scrim — #1A1A1A at 65% */}
        <div className="absolute inset-0 bg-[#1A1A1AA6] z-10" />

        <div className="relative z-20 text-center px-4">
          <h1 className="heading-max uppercase break-words font-bold max-w-[1600px] mx-auto">
            {hero.heading}
          </h1>

          {/* Typewriter line */}
          <div className="mt-4 lg:mt-6 flex justify-center">
            <div className="heading-2 font-medium min-h-12 lg:min-h-16 xl:min-h-20 flex items-center">
              <span className="bg-dark-blue-900 text-white px-6 inline-flex items-center">
                {typed}
                <span className="animate-caret ml-0.5 inline-block w-[2px] self-stretch bg-white" />
              </span>
            </div>
          </div>

          <p className="body-1 font-medium mt-4 lg:mt-8 text-white text-center max-w-[627px] mx-auto break-words">
            {hero.subheading}
          </p>

          {/* Button swaps its label on hover by sliding a second copy up */}
          <Link
            href="/contact-us"
            className="h-[50px] overflow-hidden text-sm leading-6 group inline-block mt-8 align-top"
          >
            <div className="group-hover:-translate-y-[57px] transition-all duration-500">
              <div className="group-hover:opacity-0 opacity-100 duration-300 px-6 py-3 border border-dark-blue-700 text-dark-blue-700 inline-block bg-white font-semibold rounded-lg">
                <span className="inline-flex gap-1 items-center">
                  {hero.cta.idle}
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </div>
              <div className="h-[7px]" />
              <div className="group-hover:opacity-100 opacity-0 duration-300 px-6 py-3 border border-dark-blue-700 text-dark-blue-700 inline-block bg-white font-semibold rounded-lg">
                <span className="inline-flex gap-1 items-center">
                  {hero.cta.hover}
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
