"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { team } from "@/data/about";
import { Tag } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/*
 * Geometry, straight from the theme stylesheet:
 *
 *   #team-slider .splide__slide           { width: 200px; height: 300px; transition: width .5s ease }
 *   #team-slider .splide__slide.is-active { width: 700px; height: 525px }
 *   #team-slider .splide__list            { align-items: center }
 *   @media (max-width: 1023px) { both -> width: 300px; height: auto }
 *
 * Splide runs this with `autoWidth: true, focus: "center"`, so the active card
 * is centred in the viewport. Because every width is a known constant we can
 * compute the track offset arithmetically instead of measuring the DOM — which
 * matters, since measuring mid-transition (the widths animate over 500ms)
 * returns intermediate values and the track visibly lags behind the card.
 */
const CARD_W = 200;
const CARD_ACTIVE_W = 700;
const CARD_MOBILE_W = 300;
const GAP = 16; // gap: "1rem"
const SPEED = 500; // Splide `speed`
const AUTOPLAY = 6000; // Splide `interval`

/** Three copies of the list; the middle one is the one actually on screen. */
const COPIES = 3;

export type TeamMemberCard = {
  name: string;
  position: string;
  description: string;
  image: string;
};

export type OfficeCard = { flag: string; alt: string; country: string; body: string };

export function TeamSlider({
  tag = team.tag,
  heading = team.heading,
  intro = team.intro,
  members: memberCards = team.members,
  localHeading = team.localHeading,
  offices = team.offices,
}: {
  tag?: string;
  heading?: string;
  intro?: string;
  members?: TeamMemberCard[];
  localHeading?: string;
  offices?: OfficeCard[];
} = {}) {
  const members = memberCards;
  const len = members.length;
  const rendered = Array.from({ length: COPIES * len }, (_, i) => ({
    member: members[i % len],
    key: i,
  }));

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  /** Index into `rendered`; starts in the middle copy so both ways can loop. */
  const [vi, setVi] = useState(len);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      setViewportW(viewportRef.current?.clientWidth ?? 0);
      setIsDesktop(window.innerWidth >= 1024);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = useCallback((delta: number) => {
    setAnimate(true);
    setVi((v) => v + delta);
  }, []);

  /* Autoplay — `pauseOnHover` / `pauseOnFocus` in the original. */
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(1), AUTOPLAY);
    return () => window.clearInterval(id);
  }, [paused, go]);

  /*
   * Snap back into the middle copy once a move has finished.
   *
   * The jump is a whole number of copies, so the card under the centre is the
   * same one before and after — but the transition must be off for that frame
   * or the track visibly rewinds across the whole strip.
   */
  useEffect(() => {
    if (vi >= len && vi < len * 2) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setVi((v) => ((v % len) + len) % len + len);
    }, SPEED);
    return () => window.clearTimeout(id);
  }, [vi, len]);

  useEffect(() => {
    if (animate) return;
    // Re-enable on the next frame, after the browser has painted the snap.
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const width = (i: number) =>
    !isDesktop ? CARD_MOBILE_W : i === vi ? CARD_ACTIVE_W : CARD_W;

  /* Left edge of card `i` within the track. */
  const left = (i: number) => {
    let x = 0;
    for (let k = 0; k < i; k++) x += width(k) + GAP;
    return x;
  };

  const offset = viewportW / 2 - (left(vi) + width(vi) / 2);

  /** Shortest way round the loop, as the original computes it on card click. */
  const goToReal = (realIndex: number) => {
    const current = ((vi % len) + len) % len;
    let delta = realIndex - current;
    if (delta > len / 2) delta -= len;
    if (delta < -len / 2) delta += len;
    go(delta);
  };

  const activeReal = ((vi % len) + len) % len;

  return (
    <section className="team spacing bg-grey-50">
      <div className="flex flex-col gap-3 justify-center items-center mb-16 container">
        <Reveal>
          <Tag className="mx-auto">{tag}</Tag>
        </Reveal>
        <Reveal>
          <h2 className="heading-2 font-semibold max-w-[815px] text-center mt-3 text-cyan-400">
            {heading}
          </h2>
        </Reveal>
        <Reveal>
          <p className="body-2 font-medium max-w-[815px] text-center mt-3">
            {intro}
            {/* The original ends this paragraph with `<br /><br />`, which
                leaves one blank line under the intro. It is load-bearing: drop
                it and the section comes up 28px short of the original. */}
            <br />
            <br />
          </p>
        </Reveal>
      </div>

      <div className="max-w-full overflow-hidden">
        <div
          ref={viewportRef}
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <ul
            className="flex items-center will-change-transform py-3"
            style={{
              gap: `${GAP}px`,
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: animate
                ? `transform ${SPEED}ms cubic-bezier(0.25,0.1,0.25,1)`
                : "none",
            }}
          >
            {rendered.map(({ member, key }, i) => {
              const isActive = i === vi;
              return (
                <li
                  key={key}
                  data-active={isActive || undefined}
                  className="group shrink-0 cursor-pointer relative"
                  style={{
                    width: width(i),
                    height: isDesktop ? (isActive ? 525 : 300) : "auto",
                    // WIDTH ONLY. The theme writes `transition: width .5s ease`
                    // and deliberately leaves height out, so the card snaps to
                    // its new height while the width slides — animating height
                    // as well makes the whole row visibly stretch, which the
                    // original never does.
                    transition: `width ${SPEED}ms ease`,
                  }}
                  onClick={() => goToReal(i % len)}
                >
                  <div className="team-card border border-grey-200 rounded-lg relative overflow-hidden w-full h-full flex lg:flex-row-reverse flex-col bg-white">
                    <div className="w-full h-full flex-1 lg:aspect-auto aspect-[300/400] relative bg-grey-100">
                      {/* Three copies of a 16-person list is 48 cards, and
                          mounting an <img> in every one asks the optimiser for
                          48 separate 2560px JPEGs — enough that the visible
                          cards stay blank for seconds. Only the cards that can
                          actually reach the viewport carry an image; +-6 at
                          200px a card is ~1200px of runway each side, well past
                          the ~610px the widest viewport needs. */}
                      {Math.abs(i - vi) <= 6 && (
                        <Image
                          src={member.image}
                          alt={member.name.toLowerCase()}
                          fill
                          sizes="(max-width: 1023px) 300px, 700px"
                          className={cn(
                            "object-cover transition-all duration-500",
                            // Inactive cards are drained of colour; the active
                            // one and anything hovered come back. The original
                            // writes `grayscale(12)`, which clamps to 1.
                            "lg:grayscale lg:group-hover:grayscale-0",
                            isActive && "lg:grayscale-0",
                          )}
                        />
                      )}
                    </div>

                    {/* Detail panel: 0% wide until the card is active, then 50%
                        on desktop and full width on mobile. `overflow-hidden`
                        is what makes the 0% state clip rather than squash. */}
                    {/* No width transition here either, and that is the trick:
                        50% of a parent whose width is itself animating already
                        grows smoothly. The theme's rule is `transition:
                        transform .5s ease` on a box whose transform never
                        changes — i.e. the width genuinely snaps, and it still
                        reads as smooth because the parent carries the motion.
                        Animating this width too just double-animates it. */}
                    <div
                      className="overflow-hidden lg:h-full shrink-0"
                      style={{
                        width: isDesktop ? (isActive ? "50%" : "0%") : "100%",
                      }}
                    >
                      <div className="md:max-w-[350px] w-full md:h-full h-auto overflow-hidden flex flex-col justify-center bg-white p-6 z-10">
                        <h3 className="heading-3 font-semibold mb-1 text-dark-blue-900">
                          {member.name}
                        </h3>
                        <p className="body-2 font-semibold text-grey-600 mb-4">
                          {member.position}
                        </p>
                        <div className="body-3 font-medium text-grey-600 mb-4 max-[1024px]:line-clamp-3">
                          {member.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-row gap-2 items-center justify-center mt-8">
          <button
            type="button"
            aria-label="Previous team member"
            onClick={() => go(-1)}
            className="w-12 h-12 cursor-pointer"
          >
            <Image
              src="/images/button-next.svg"
              alt=""
              width={48}
              height={48}
              className="w-full h-full object-cover rotate-180"
            />
          </button>
          <button
            type="button"
            aria-label="Next team member"
            onClick={() => go(1)}
            className="w-12 h-12 cursor-pointer"
          >
            <Image
              src="/images/button-next.svg"
              alt=""
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <div className="container">
        <div className="mt-10 lg:mt-16">
          <div className="text-center heading-3 font-semibold text-cyan-400">
            {localHeading}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 2xl:gap-10 mt-16">
          {offices.map((office) => (
            <Reveal key={office.country} className="flex flex-col gap-3">
              <Image
                src={office.flag}
                alt={office.alt}
                width={32}
                height={32}
                className="w-8 h-8 object-cover rounded-full"
              />
              <div className="heading-3 font-semibold text-dark-blue-950">
                {office.country}
              </div>
              <div className="body-2 font-medium text-grey-600">
                {office.body}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* `activeReal` drives nothing visual on its own but keeps the announced
          state in sync for assistive tech, which the original omits entirely. */}
      <span className="sr-only" aria-live="polite">
        {members[activeReal].name}, {members[activeReal].position}
      </span>
    </section>
  );
}
