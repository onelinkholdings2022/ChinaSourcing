"use client";

import { createElement, useEffect, useState, type ReactNode } from "react";

/**
 * Replicates the AOS `fade-up` the original site uses everywhere:
 * data-aos="fade-up" data-aos-duration="500" data-aos-offset="-50" data-aos-once="true"
 *
 * Elements start 24px low and transparent, then rise into place once they
 * cross the viewport edge, once only — the same thing AOS does, implemented the
 * same way AOS does it: one IntersectionObserver plus a CSS transition.
 *
 * ## Why not framer-motion
 *
 * This used `whileInView`, then `useInView`, and both left content stranded.
 * `whileInView` only holds its target while the observer says the element is in
 * view: this page pins a section with GSAP and calls `ScrollTrigger.refresh()`,
 * which moves scroll offsets under the observer, so on any programmatic jump
 * (`window.scrollTo`, a `#hash` landing, the browser restoring scroll on
 * reload) an element could register enter → leave within one frame. The tween
 * was cancelled and `once: true` had already detached the observer, so it froze
 * near 0.026 opacity — whole sections rendered blank. Latching with `useInView`
 * instead simply never reported true for elements that were plainly on screen.
 *
 * A bare observer has neither failure mode: the state latches to `true` and
 * never flips back, and the transition is CSS, so nothing can cancel it
 * part-way. It also drops framer-motion from every section that only needed a
 * fade-up.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  /** Milliseconds, matching the original's data-aos-delay values. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "h2" | "h3" | "li";
}) {
  // Callback ref rather than `useRef`: the node is what the effect depends on,
  // and holding it in state re-runs the effect exactly when the element is
  // attached — no reading a ref during render.
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!el) return;
    // Guard against the element already being on screen at mount — an observer
    // fires for that case, but only after a frame, and a jump-scroll can land
    // before it is even created.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      // AOS's `offset: -50` starts the animation 50px BEFORE the element
      // reaches the viewport edge, which is a positive root margin here.
      { rootMargin: "50px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [el]);

  return createElement(
    as,
    {
      ref: setEl,
      className,
      style: {
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 500ms cubic-bezier(0.25,0.1,0.25,1) ${delay}ms, transform 500ms cubic-bezier(0.25,0.1,0.25,1) ${delay}ms`,
      },
    },
    children,
  );
}
