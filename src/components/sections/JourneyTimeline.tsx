"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger);

/**
 * "From Vision to Impact" — the only pinned section on the page.
 *
 * Ported from the theme bundle rather than re-invented. The original:
 *
 *   panelH     = innerHeight - 120 - headline.offsetHeight
 *   scrollDist = panels.length * panelH - panelH
 *   ScrollTrigger { start: "top-=70 top", end: `+=${scrollDist}`, scrub: true,
 *                   pin: "#timeline-scroll-container" }
 *   ship:   fromTo y: -shipH*0.75  ->  +shipH*0.75
 *   panels: to     y: `+=${-scrollDist}`
 *
 * Every `.timeline-modify-height` element is forced to `panelH` so one panel
 * exactly fills the viewport slot; the wrapper is set to `panelH * panels.length`
 * so the translated column has somewhere to travel.
 *
 * Below 1024px the original creates NO ScrollTrigger at all — the panels stack
 * and the year rail is hidden. Matching that matters: a pinned section on a
 * phone traps the scroll.
 */
export type Milestone = {
  /** Label in the left rail. */
  rail: string;
  /** Small label above the panel title ("Step 1"); About leaves this empty. */
  step?: string;
  title: string;
  body: string;
};

export function JourneyTimeline({
  tag,
  heading,
  intro,
  ship,
  milestones,
}: {
  tag: string;
  heading: string;
  /** Present on /process, absent on About. */
  intro?: string | null;
  ship: string | null;
  milestones: Milestone[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth <= 1024) return;

    const section = sectionRef.current;
    const headline = headlineRef.current;
    const content = contentRef.current;
    const panelsEl = panelsRef.current;
    const wrapper = wrapperRef.current;
    const shipEl = shipRef.current;
    if (!section || !headline || !content || !panelsEl || !wrapper || !shipEl)
      return;

    const panelH = window.innerHeight - 120 - headline.offsetHeight;
    const n = milestones.length;
    const scrollDist = n * panelH - panelH;

    content.style.height = `${panelH}px`;
    const sized = Array.from(
      section.querySelectorAll<HTMLElement>(".timeline-modify-height"),
    );
    sized.forEach((el) => (el.style.height = `${panelH}px`));

    /** Listeners registered inside the context, torn down with it. */
    const cleanups: (() => void)[] = [];

    // Built inside a context so `revert()` unwinds the pin spacer as well.
    // Killing triggers by hand leaves the spacer behind, and React's
    // double-mount in dev then measures inside the stale one.
    const ctx = gsap.context(() => {
      const items = Array.from(
        section.querySelectorAll<HTMLElement>(".timeline-track-item"),
      );
      const setActive = (index: number) =>
        items.forEach((el, i) => el.classList.toggle("active", i === index));

      // The rail index is derived from the scrub progress of the SAME
      // ScrollTrigger that moves the panels, so the two can never disagree.
      //
      // The original instead creates one trigger per panel with
      // `start: "top+=50 center"` and flips the class in `onEnter` /
      // `onEnterBack`. That desynchronises twice over. At creation all six
      // panels are still stacked in one place, so every trigger fires `onEnter`
      // in order and the last one wins — the rail lit "2025" while the panel
      // read "2020". And on a large jump (a wheel spun hard, a restored scroll
      // position) the crossings never fire at all and the rail is left several
      // steps behind the panel on screen. A separate ScrollTrigger reading the
      // same range does not fix it either: this section is pinned, so a second
      // trigger measures the post-pin layout and its range is already spent.
      //
      // Progress cannot drift: the column travels exactly (n - 1) * panelH over
      // the full scrub, so panel i is centred at progress = i / (n - 1) and
      // rounding picks whichever panel is nearest the middle. The switch lands
      // within ~7% of a step of the original's, and it is correct on the first
      // frame and after any jump.
      const syncRail = (progress: number) =>
        setActive(Math.min(n - 1, Math.max(0, Math.round(progress * (n - 1)))));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top-=70 top",
          end: `+=${scrollDist}`,
          scrub: true,
          pin: containerRef.current,
          // `body` carries `overflow-x: hidden`, which makes it a scroll
          // container — without this ScrollTrigger pins by translating the
          // section and it reads as scrolling away instead of holding still.
          pinType: "fixed",
        },
      });

      // The rail is stepped from a plain scroll listener, not from the
      // trigger's `onUpdate`. With this pin in place that callback never
      // fires — the panels scrub correctly but the callback is simply never
      // invoked, so the rail froze on whatever the first frame set. The range
      // here is the same one the trigger uses (`start: "top-=70 top"`,
      // `end: "+=scrollDist"`), computed from the section's own geometry, so
      // the two stay locked together without depending on the callback.
      const railStart = section.getBoundingClientRect().top + window.scrollY - 70;
      const onScroll = () =>
        syncRail((window.scrollY - railStart) / scrollDist);
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
      onScroll();

      const shipH = shipEl.offsetHeight;
      tl.fromTo(
        shipEl,
        { y: -shipH * 0.75 },
        { y: shipH * 0.75, ease: "none" },
      );
      tl.to(panelsEl, { y: `+=${-scrollDist}`, ease: "none" }, 0);

      gsap.set(wrapper, { height: panelH * n });

      ScrollTrigger.refresh();
      syncRail(tl.scrollTrigger?.progress ?? 0);
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      cleanups.forEach((fn) => fn());
      ctx.revert();
      content.style.height = "";
      sized.forEach((el) => (el.style.height = ""));
    };
  }, [milestones.length]);

  return (
    <section
      ref={sectionRef}
      id="timeline-scroll"
      className="bg-dark-blue-950 relative overflow-hidden"
    >
      <div ref={containerRef}>
        <div
          ref={headlineRef}
          className="container 2xl:pt-16 lg:pt-10 pt-8 lg:pb-0 pb-10"
        >
          <div className="lg:w-2/5 w-auto lg:pr-12 pr-0">
            <div className="flex flex-col gap-0 text-white container relative overflow-hidden">
              <div className="flex flex-col gap-3">
                <Reveal>
                  <Tag className="mx-auto lg:ml-0">{tag}</Tag>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="heading-3 font-semibold text-white">
                    {heading}
                  </h2>
                </Reveal>
                {intro && (
                  <Reveal delay={150}>
                    <p className="text-dark-blue-50 body-2 text-sm font-medium leading-snug">
                      {intro}
                    </p>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </div>

        <div ref={contentRef}>
          <div className="relative timeline-scroll-container">
            {/* Zero-height rail so the ship can overflow it without adding
                layout — it is positioned against the grid below. */}
            <div className="container h-0 overflow-visible">
              <div className="relative">
                <div
                  ref={shipRef}
                  className="timeline-modify-height absolute top-0 left-0 lg:right-0 z-0"
                >
                  {ship && (
                    <Image
                      src={ship}
                      alt="Ship"
                      width={300}
                      height={300}
                      className="lg:w-[300px] w-[85px] block mx-auto object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 grid-cols-1 container z-[1] timeline-modify-height">
              {/* Year rail — desktop only, exactly as the original */}
              <div className="lg:block hidden">
                <div className="flex flex-col justify-center timeline-modify-height">
                  <div className="flex flex-col 2xl:gap-6 gap-4 justify-between relative">
                    <div className="absolute z-0 top-3 bottom-3 left-[4px] w-[2px] bg-grey-100" />
                    {milestones.map((m) => (
                      <div
                        key={m.rail}
                        className="flex gap-4 items-center relative z-[1] timeline-track-item"
                      >
                        <span className="rounded-full w-[9px] h-[9px] block bg-dark-blue-700 transition-all duration-300 timeline-track-dot" />
                        <span className="font-semibold !leading-snug font-poppins text-dark-blue-700 body-1 transition-all duration-300 timeline-track-heading">
                          {m.rail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty middle column — the ship occupies it visually */}
              <div />

              <div
                ref={wrapperRef}
                className="overflow-hidden lg:pl-0 md:pl-4 timeline-modify-height"
              >
                <div ref={panelsRef} className="flex flex-col">
                  {milestones.map((m) => (
                    <div
                      key={m.rail}
                      className="gap-3 flex flex-col timeline-modify-height h-auto lg:mb-0 mb-8 justify-center panel lg:pl-0 pl-20"
                    >
                      {m.step && (
                        <span className="body-3 font-semibold text-dark-blue-50">
                          {m.step}
                        </span>
                      )}
                      <h3 className="heading-3 font-semibold text-white">
                        {m.title}
                      </h3>
                      <div className="font-medium text-base leading-tight text-dark-blue-400 whitespace-pre-line">
                        {m.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
