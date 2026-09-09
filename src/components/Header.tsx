"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const IMG = "/images";

/** The original's `scrollThreshold`. */
const SCROLL_THRESHOLD = 100;

/** Dùng khi Strapi (`global.navbar`) không truy cập được — không phải nav thật. */
const FALLBACK_NAV = [
  { label: "About Us", href: "/about-us" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Resources", href: "/resources" },
];

/** The original marks the nav link whose path equals the current one. */
function isActive(pathname: string, href: string) {
  const strip = (p: string) => p.replace(/\/$/, "");
  return strip(pathname) === strip(href);
}

/**
 * Fixed header. Above the threshold it floats as a translucent white pill with
 * white nav text over the hero; past it the pill loses its background and the
 * header itself becomes a full-width bar flush to the top, carrying the
 * pale-blue-to-white gradient and dark nav text.
 *
 * Two independent pieces of state, which is why they are separate variables:
 *
 *  - `scrolled` picks the COLOUR treatment. Inner pages force it on (`solid`)
 *    because their hero is light and white-on-white nav text would vanish.
 *  - `atTop` gates the SHADOW, and is driven purely by scroll position. Tying
 *    it to `scrolled` put a permanent line under the header on every inner
 *    page, including at the very top.
 *
 * On the shadow specifically: the live site has none at all on inner pages —
 * its header is just `bg-gradient-header sticky top-0`, with `box-shadow: none`
 * measured at every scroll position. The subtle line once you scroll away from
 * the top is a deliberate addition, asked for because a bar with no edge reads
 * as detached once content passes under it.
 */
export function Header({
  /**
   * Pages that open on a dark hero (home, articles) let the nav sit
   * transparent with white text. Pages that open on a light background must
   * start in the solid treatment or the nav would be white-on-white.
   */
  solid = false,
  nav = FALLBACK_NAV,
}: {
  solid?: boolean;
  nav?: { label: string; href: string }[];
} = {}) {
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = solid || !atTop;
  /** Shadow follows the scroll position alone, never `solid`. */
  const lifted = !atTop;
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "w-full z-40 duration-300",
        // Vị trí là thứ site gốc PHÂN BIỆT theo trang, không phải hằng số:
        //   • trang chủ  → `fixed lg:top-8 top-3` (viên thuốc nổi trên hero tối)
        //   • trang trong → `sticky top-0` — NẰM TRONG DÒNG, chiếm 82px chiều cao
        // Bản clone trước đây `fixed` ở cả hai, rồi bù bằng `pt-28 lg:pt-32`
        // trên `<main>`. Hai con số đó (112 / 128px) lớn hơn header thật, nên
        // MỌI trang trong đều bắt đầu thấp hơn bản gốc 30px (mobile) tới 46px
        // (desktop), và tài liệu dài thêm đúng chừng ấy.
        solid
          ? "sticky top-0 bg-gradient-header lg:px-0 px-3"
          : cn(
              "fixed lg:px-3 px-2",
              scrolled ? "top-0 bg-gradient-header" : "lg:top-8 top-3 bg-transparent",
            ),
        lifted && "shadow-[0_1px_0_0_rgba(15,23,42,0.06),0_4px_12px_-8px_rgba(15,23,42,0.18)]",
      )}
    >
      <div className="container sm:px-5 px-0">
        <nav
          className={cn(
            "mx-auto rounded-2xl py-4 lg:px-6 px-3 flex items-center justify-between duration-300",
            !scrolled && "bg-white/[0.12]",
          )}
        >
          <Link href="/" className="shrink-0">
            <Image
              src={
                scrolled ? `${IMG}/Group.png` : `${IMG}/China_sourcing-white.png`
              }
              alt="China Sourcing Co"
              width={180}
              height={48}
              priority
              className="max-h-12 w-auto object-contain duration-300"
            />
          </Link>

          {/* Desktop nav */}
          <div className="lg:flex hidden items-center 2xl:gap-6 xl:gap-4 lg:gap-3">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "header-link font-medium lg:text-sm xl:text-base rounded-full bg-transparent duration-300 py-2 2xl:px-4 px-2.5 lg:px-1.5",
                  "hover:!text-white hover:bg-gradient-cyan",
                  scrolled ? "text-grey-600" : "!text-white",
                  isActive(pathname, item.href) && "active",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <Button href="/contact-us" className="md:inline-flex hidden">
              Contact Us
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className={cn(
                "lg:hidden inline-flex px-3 py-3 rounded-lg duration-300 hover:bg-black/5",
                scrolled ? "text-grey-600" : "!text-white",
              )}
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-40 h-screen w-screen bg-black/50 duration-300 lg:hidden",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />
      <div
        className={cn(
          "z-50 fixed flex flex-col top-0 h-screen overflow-y-auto duration-300 bg-white w-full max-w-screen-md lg:hidden",
          menuOpen ? "left-0" : "-left-full",
        )}
      >
        <div className="flex p-3 pt-6 items-center justify-between">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src={`${IMG}/Group.png`}
              alt="China Sourcing Co"
              width={180}
              height={48}
              className="max-h-12 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-3 rounded-full duration-300 hover:bg-black/5 text-dark-blue-950"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 flex justify-between flex-col">
          <div className="flex flex-col py-6 px-4 gap-8">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="w-fit font-medium text-lg text-dark-blue-950 duration-300 hover:text-cyan-400"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="py-6 px-4 border-t border-grey-200">
            <Button href="/contact-us" className="w-full">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
