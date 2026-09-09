"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "./lenisRef";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide smooth scroll — ported from OlcoMain's `SmoothScroll`. Lenis
 * smooths the wheel/touch input itself (native `scroll-behavior: smooth`
 * only intercepts programmatic jumps, e.g. anchor links, which is why it was
 * invisible on ordinary scrolling). It runs on GSAP's own ticker so it never
 * drifts a frame out of sync with `JourneyTimeline`'s pinned ScrollTrigger.
 *
 * ## Why `lerp` and not `duration`
 *
 * This ran at `duration: 1.15` with an expo-out easing, which restarts a
 * 1.15-second tween on every wheel notch: the page keeps gliding for over a
 * second after the input stops, and that reads as lag rather than smoothness.
 * `lerp` instead chases the target by a fixed fraction each frame — it settles
 * in roughly a third of the time and never fights a still-arriving wheel.
 *
 * That last part matters most on `/contact-us`. The "Get In Touch" form is a
 * cross-origin HubSpot iframe (deviation 22), so a wheel event with the pointer
 * over it is delivered to *that* document and never reaches this one: the
 * browser scrolls us natively and Lenis only finds out afterwards, from the
 * scroll event, and resynchronises. The longer its own animation, the further
 * apart the two positions are when they meet — which is why that page felt
 * worse than the rest. A short lerp makes the smoothed and the native scroll
 * close enough to be indistinguishable. Scrolling over the form itself stays
 * native; there is no fix for that from this side of the iframe.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      // A trackpad flick already carries plenty of delta; multiplying it on top
      // of the smoothing is what turns a small gesture into a long glide.
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    setLenis(lenis);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Web fonts change every heading's box height; a pin measured before they
    // land (JourneyTimeline in particular) is off by however much text
    // reflowed. Re-measure once, when they're actually in.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      gsap.ticker.remove(onTick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
