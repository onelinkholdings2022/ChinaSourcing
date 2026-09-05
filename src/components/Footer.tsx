"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { footer as staticFooter, IMG } from "@/data/site";
import type { FooterViewData } from "@/lib/views/globalView";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  MailIcon,
  MapPinIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/** Small square bullet used in front of every footer entry. */
function Bullet() {
  return (
    <span className="size-5 min-w-5 flex items-center justify-center">
      <span className="size-2 min-w-2 bg-dark-blue-900 rounded-[1px]" />
    </span>
  );
}

/**
 * One office. Collapsed it is just the bullet, the country and a chevron;
 * expanded it reveals the street address and the contact email, the way the
 * original's Alpine `x-show` accordion does.
 */
function LocationRow({
  country,
  address,
  email,
}: {
  country: string;
  address: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-3 lg:max-w-[218px] w-full group cursor-pointer"
      >
        <Bullet />
        <span className="block text-left group-hover:text-grey-950 font-normal duration-300 body-3 text-gray-600">
          {country}
        </span>
        <ChevronDownIcon
          className={cn(
            "block group-hover:text-primary ml-auto duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="space-y-2 mt-4">
          <div className="flex gap-3">
            <MapPinIcon className="translate-y-[5px] w-5 h-5 min-w-5 min-h-5" />
            <span className="body-3 text-grey-600 text-left sm:max-w-[180px] max-w-[260px]">
              {address}
            </span>
          </div>
          <div className="flex gap-3">
            <MailIcon className="translate-y-[5px] w-5 h-5 min-w-5 min-h-5" />
            <a
              href={`mailto:${email}`}
              className="body-3 text-grey-600 text-left sm:max-w-[180px] max-w-[260px] hover:underline"
            >
              {email}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * The dark band under the footer: two copies of the same oversized line
 * scrolling forever, with a "Say Hi!" button that appears on hover and tracks
 * the cursor across the band.
 */
function MarqueeBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const follow = (e: React.MouseEvent<HTMLDivElement>) => {
    const band = bandRef.current;
    const button = buttonRef.current;
    if (!band || !button) return;
    const { top, left } = band.getBoundingClientRect();
    button.style.left = `${e.clientX - left - button.offsetWidth / 2}px`;
    button.style.top = `${e.clientY - top - button.offsetHeight / 2}px`;
  };

  return (
    <div
      ref={bandRef}
      onMouseMove={follow}
      className="py-2 bg-dark-blue-950 overflow-hidden relative group"
    >
      {/* Positioned imperatively by `follow`, so it is a plain anchor rather
          than <Button> — it needs a ref. */}
      <Link
        ref={buttonRef}
        href="/contact-us"
        className="absolute opacity-0 group-hover:opacity-100 z-20 duration-0 inline-flex gap-2 items-center justify-center md:px-6 md:py-3 py-4 px-4 rounded-lg font-semibold group/btn bg-cyan-400 text-white border border-cyan-400"
      >
        Say Hi!
        <ArrowRightIcon className="w-5 h-5" />
      </Link>
      <div className="flex gap-8 marquee-animate">
        {[0, 1].map((i) => (
          <p
            key={i}
            aria-hidden={i === 1}
            className="md:text-[100px] text-7xl text-dark-blue-400 text-nowrap whitespace-nowrap"
          >
            {staticFooter.marquee}
          </p>
        ))}
      </div>
    </div>
  );
}

export function Footer({ footer = staticFooter }: { footer?: FooterViewData } = {}) {
  return (
    <footer>
      <div className="py-10 bg-grey-50 relative z-10">
        <div className="container space-y-10">
          {/* Logo + newsletter */}
          <div className="flex flex-wrap justify-between gap-8">
            <Image
              src={`${IMG}/Group.png`}
              alt="China Sourcing Co"
              /* The asset's intrinsic size — anything else letterboxes it */
              width={353}
              height={120}
              /* `w-auto` ở đây từng khiến trình duyệt tính sai bề rộng trong
                 flex row (còn 176px thay vì 353px thật) — set width tường
                 minh (cùng tỉ lệ 353:120 với 2 mốc max-h cũ) để tránh hẳn quirk
                 auto-size trong flex, thay vì cap theo chiều cao. */
              className="h-auto object-contain w-[235px] lg:w-[353px]"
            />
            <div className="flex flex-col max-w-[523px] w-full">
              <h3 className="text-lg text-[#093343] font-normal">
                {footer.newsletter.heading}
              </h3>
              <p className="mt-2 text-lg text-[#0A0A0A] font-normal">
                {footer.newsletter.subheading}
              </p>
              <form
                className="mt-6"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Newsletter signup"
              >
                <input
                  type="email"
                  required
                  placeholder="Email*"
                  aria-label="Email"
                  className="w-full bg-transparent border-b border-grey-400 pb-2 text-grey-600 placeholder:text-grey-400 outline-none focus:border-dark-blue-950 duration-300"
                />
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-dark-blue-950 text-white text-sm font-semibold rounded px-6 py-2.5 duration-300 hover:bg-dark-blue-900 cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Link columns, locations and social */}
          <div className="py-10 border-y border-grey-400 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[22px]">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <span className="body-2 text-black text-left uppercase font-medium mb-6">
                  {col.title}
                </span>
                <div className="mt-6 space-y-6">
                  {col.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-3 lg:max-w-[218px] w-full group"
                    >
                      <Bullet />
                      <span className="block body-3 text-gray-600 group-hover:text-grey-950 duration-300 text-left font-normal">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  {col.more && (
                    <Link
                      href={col.more.href}
                      className="flex items-center gap-3 group hover:underline"
                    >
                      <ChevronDownIcon className="text-cyan-500" />
                      <span className="block body-3 text-cyan-500 text-left">
                        {col.more.label}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            ))}

            <div>
              <span className="body-2 text-black text-left uppercase font-medium mb-6">
                OUR LOCATION
              </span>
              <div className="mt-6 space-y-6">
                {footer.locations.map((loc) => (
                  <LocationRow key={loc.country} {...loc} />
                ))}
              </div>
            </div>

            <div className="xl:col-start-5">
              <span className="text-lg uppercase font-semibold mb-6 text-black">
                Social media
              </span>
              <div className="space-y-6">
                {footer.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-between mt-6 lg:max-w-[186px] group"
                  >
                    <span className="flex items-center gap-2">
                      <Bullet />
                      <span className="text-grey-600 text-left group-hover:text-grey-950 duration-300">
                        {s.label}
                      </span>
                    </span>
                    <ArrowUpRightIcon className="group-hover:text-primary duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex md:flex-row flex-col gap-3 justify-between mt-4">
            <p className="text-grey-600 font-normal">{footer.copyright}</p>
            <Link
              href="/privacy-policy"
              className="text-grey-600 hover:text-primary duration-300 font-normal"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <MarqueeBand />
    </footer>
  );
}
