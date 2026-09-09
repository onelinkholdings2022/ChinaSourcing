"use client";

import type Lenis from "lenis";

/**
 * The single Lenis instance created by `<SmoothScroll>` (mounted once in
 * `layout.tsx`). A few call sites need to command it directly — `PageTransition`
 * resets it to 0 on route change, since it keeps its own scroll position
 * internally and a plain `window.scrollTo` doesn't reach that: left alone,
 * Lenis animates back to where it last thought the page was, a frame later.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** `null` when `prefers-reduced-motion` is on — there is no Lenis at all then. */
export function getLenis(): Lenis | null {
  return instance;
}
