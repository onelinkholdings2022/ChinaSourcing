"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { getLenis } from "./lenisRef";

/**
 * Forces both the native scroll position and Lenis's own internal one back to
 * the top. A plain `window.scrollTo(0, 0)` alone isn't enough once
 * `<SmoothScroll>` is mounted: Lenis tracks scroll itself and doesn't notice
 * an external jump, so a frame later it animates back to wherever it last
 * thought the page was — the new page visibly scrolls back up mid-reveal.
 * Called only while the curtain is fully covering the viewport, so the reset
 * itself is never seen.
 */
function resetScroll() {
  window.scrollTo(0, 0);
  getLenis()?.scrollTo(0, { immediate: true, force: true });
}

/**
 * The site-wide curtain: six indigo columns that cover the viewport, plus a
 * loading counter on first paint.
 *
 * ## What the original does
 *
 * The theme runs Barba.js with a single `column-slide` transition, driven by
 * GSAP. Ported verbatim from the bundle:
 *
 * ```js
 * once() {                                    // first paint
 *   gsap.set(layer2, { opacity: 1 });
 *   gsap.set(group, { y: innerHeight - 20, opacity: 1 });
 *   gsap.to({percent:0}, { percent:100, duration:1, ease:"power2.inOut",
 *     onUpdate() {
 *       percentEl.textContent = Math.floor(p) + "%";
 *       group.style.transform = `translate(-50%, ${vh - (p/100)*vh}px)`;
 *       group.style.opacity = p >= 80 ? 1 - (p - 80) / 20 : 1;
 *     },
 *     onComplete() {
 *       cols.forEach((c,i) => gsap.to(c, { y:"100%", duration:.35,
 *         delay:i*.1, ease:"power2.inOut" }));
 *     }});
 * }
 * leave() {                                   // navigating away
 *   gsap.timeline().to(overlay,{opacity:1,duration:.4})
 *     .fromTo(logo,{y:-50,opacity:0},{y:0,opacity:1,duration:.35,ease:"power2.out"});
 *   cols.forEach((c,i) => gsap.fromTo(c, {y:"-100%"},
 *     { y:"0%", duration:.6, delay:i*.1, ease:"power2.inOut" }));
 * }
 * afterLeave() { window.location.reload(true) }
 * ```
 *
 * The columns sit at `translateY(0)` by default — the theme's
 * `transform:translateY(-100%)` is commented out with `//`, which is not valid
 * CSS, so the declaration is dropped and they start covering the page. That is
 * load-bearing: it is why the first paint is hidden behind the curtain.
 *
 * ## What differs here, and why
 *
 * `afterLeave` forces `window.location.reload(true)`, so on the original every
 * navigation is a full document load and the 0→100% counter replays each time.
 * That is a second and a half of waiting on every click, and it is not wanted
 * here: the counter runs **only on a fresh load or F5**, and in-app navigation
 * gets the logo and the column wipe with no counter at all.
 *
 * Two further deliberate changes, both about the curtain not looking broken:
 *
 *  - The logo waits for full coverage. The theme drops it in at 0.4s while the
 *    last column is still 0.7s from landing, so it floats over a half-covered
 *    page.
 *  - The durations are tightened (see the timing block below). Keeping the
 *    theme's would have handed back the time saved by dropping the counter.
 *
 * Column count, colour, direction, stagger shape and `power2.inOut` easing are
 * all the theme's.
 */

const COLUMNS = 6;

/*
 * Timings.
 *
 * The theme runs the cover at 0.6s per column with a 0.1s stagger (1.1s to
 * cover), the logo at 0.35s, and the reveal at 0.35s / 0.1s — about 2.3s of
 * curtain per navigation. These are deliberately tightened to roughly 1.5s: the
 * whole point of dropping the percentage counter was to stop making people
 * wait, and a slower curtain would have given the time straight back. The shape
 * of the motion — column count, direction, stagger, `power2.inOut` — is
 * unchanged, so it still reads as the same effect, just brisker.
 */
const COVER_DURATION = 0.45;
const COVER_STAGGER = 0.07;
/** When the last column lands, and therefore when the logo may appear. */
const COVER_END = (COLUMNS - 1) * COVER_STAGGER + COVER_DURATION;
const LOGO_IN = 0.25;
const REVEAL_DURATION = 0.3;
const REVEAL_STAGGER = 0.07;

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const rootRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const logo1Ref = useRef<HTMLImageElement>(null);

  /** Guards the intro so React's double-mount in dev cannot run it twice. */
  const introDone = useRef(false);
  /** Set while a leave animation is in flight so the click handler defers. */
  const leaving = useRef(false);
  /** Skips the reveal effect on the very first pathname render. */
  const firstPath = useRef(true);

  const columns = useCallback(
    () =>
      Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>(".transition-column") ??
          [],
      ),
    [],
  );

  /** Columns slide down and out, uncovering the page. */
  const reveal = useCallback(() => {
    const cols = columns();
    cols.forEach((col, i) => {
      gsap.to(col, {
        y: "100%",
        duration: REVEAL_DURATION,
        delay: i * REVEAL_STAGGER,
        ease: "power2.inOut",
        onComplete: () => {
          if (i === cols.length - 1) {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "";
          }
        },
      });
    });
  }, [columns]);

  // ── Intro: the counter, then the reveal ────────────────────────────────
  useEffect(() => {
    if (introDone.current) return;
    introDone.current = true;

    const group = groupRef.current;
    const percentEl = percentRef.current;
    const layer2 = layer2Ref.current;
    if (!group || !percentEl || !layer2) return;

    document.body.style.overflow = "hidden";

    const vh = window.innerHeight;
    gsap.set(layer2, { opacity: 1 });
    group.style.opacity = "1";
    group.style.transform = `translate(-50%, ${vh - 20}px)`;

    const counter = { percent: 0 };
    const tween = gsap.to(counter, {
      percent: 100,
      duration: 1,
      ease: "power2.inOut",
      onUpdate() {
        const p = counter.percent;
        percentEl.textContent = `${Math.floor(p)}%`;
        group.style.transform = `translate(-50%, ${vh - (p / 100) * vh}px)`;
        // Fades across the last fifth of the count, not at the end.
        group.style.opacity = p >= 80 ? String(1 - (p - 80) / 20) : "1";
      },
      onComplete: () => {
        gsap.set(layer2, { opacity: 0 });
        reveal();
      },
    });

    // Deliberately NOT killed on cleanup. React's double-mount in development
    // would otherwise run this effect, kill the tween, then hit the `introDone`
    // guard on the second run and never restart it — leaving the curtain over
    // the page forever. The tween only writes to a scratch object and this
    // element's own styles, so letting it finish is harmless.
    void tween;

    // Belt and braces: whatever happens to the animation, the page must not
    // stay covered. The intro needs 1s of counter plus the reveal, so this sits
    // comfortably past it without leaving anyone staring at a blue screen.
    const failsafe = window.setTimeout(() => {
      const cols = columns();
      if (cols.some((c) => c.getBoundingClientRect().top > -1)) {
        gsap.set(cols, { y: "100%" });
        gsap.set(layer2, { opacity: 0 });
        document.body.style.overflow = "auto";
      }
    }, 2500);

    return () => window.clearTimeout(failsafe);
  }, [reveal, columns]);

  // ── Reveal after an in-app navigation ──────────────────────────────────
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    // Chỉ vén rèm khi CHÍNH khối này vừa kéo rèm xuống. `leaving` được bật ở
    // handler click bên dưới và chỉ ở đó.
    //
    // Cần chốt này vì `usePathname()` đổi giá trị với MỌI thứ chạm vào history,
    // kể cả `history.pushState` — mà rail category trên `/resources` dùng đúng
    // cách đó để đổi thanh địa chỉ tại chỗ (xem `BlogListing`). Không chốt thì
    // một cú bấm lọc sẽ chạy `resetScroll()` + `reveal()`: trang nhảy vọt về
    // đầu và rèm quét qua, tức trông y hệt vừa tải lại trang — đúng thứ khối đó
    // được viết ra để tránh. Nút Back/Forward của trình duyệt cũng vào nhánh
    // này, và ở đó trình duyệt tự khôi phục vị trí cuộn nên `resetScroll()`
    // cũng sai.
    if (!leaving.current) return;
    leaving.current = false;
    // Belt and braces alongside the reset in `onClick` below: Next's own
    // scroll handling for the new route can land after that one fires, so
    // reset again here too, still hidden — the curtain is still fully solid
    // and `reveal()` has not started sliding it away yet.
    resetScroll();
    // Fade the logo rather than snapping it: the curtain is still solid for the
    // first moments of the reveal, so a short cross-fade lets the logo actually
    // register instead of blinking out the instant the route changes.
    gsap.to(layer1Ref.current, { opacity: 0, duration: 0.2 });
    reveal();
  }, [pathname, reveal]);

  // ── Leave: intercept internal links, draw the curtain, then route ───────
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const anchor = (event.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      // Leave new tabs, downloads, hashes, mailto/tel and external hosts alone.
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        !anchor.href ||
        anchor.origin !== window.location.origin
      )
        return;

      // Link tự lo phần điều hướng của nó — không phải một lượt chuyển trang.
      //
      // Cần một cờ tường minh vì handler này chạy ở pha CAPTURE trên document:
      // nó luôn chạy TRƯỚC handler của chính phần tử, nên phần tử không có cách
      // nào tự rút lui. Rail category trên `/resources` dùng cờ này: pill là
      // `<a href="/canton-fair">` để bot thu thập được và mở tab mới được,
      // nhưng cú bấm thường chỉ đổi bộ lọc + `history.pushState`, không rời
      // trang — nên rèm chuyển trang mà chạy ở đây là sai hẳn.
      if (anchor.hasAttribute("data-no-transition")) return;

      const url = new URL(anchor.href);
      if (url.pathname === window.location.pathname) return;

      // `stopPropagation` as well as `preventDefault`: these are Next `<Link>`
      // elements, and Link's own click handler sits on the anchor. In the
      // bubble phase that handler runs first and routes immediately, so the
      // curtain never got a chance to play — the page just swapped. Listening
      // in the CAPTURE phase (see the addEventListener call below) and stopping
      // the event here means Link never sees the click and the navigation is
      // ours to schedule.
      event.preventDefault();
      event.stopPropagation();
      if (leaving.current) return;
      leaving.current = true;

      document.body.style.overflow = "hidden";

      const layer1 = layer1Ref.current;
      const logo = logo1Ref.current;
      const cols = columns();
      const href = url.pathname + url.search;

      // Nothing to animate (no columns rendered yet) — just go, rather than
      // swallowing the click and stranding the user on the current page.
      if (!cols.length || !layer1 || !logo) {
        resetScroll();
        router.push(href);
        return;
      }

      // One timeline so the navigation fires exactly once, from `onComplete`.
      // Chaining per-column callbacks instead makes the push depend on which
      // tween happens to finish last. The curtain is fully covering by then,
      // so resetting scroll here — rather than waiting for the reveal effect —
      // is what actually hides the jump: `router.push` starts rendering the
      // new route immediately, and it should already be scrolled to top by
      // the time any of that becomes visible.
      const tl = gsap.timeline({
        onComplete: () => {
          resetScroll();
          router.push(href);
        },
      });

      cols.forEach((col, i) => {
        tl.fromTo(
          col,
          { y: "-100%" },
          { y: "0%", duration: COVER_DURATION, ease: "power2.inOut" },
          i * COVER_STAGGER,
        );
      });

      // The logo waits for the curtain to be SOLID. The theme drops it in at
      // 0.4s, but the last column does not land until 1.1s, so on the original
      // the logo floats over a half-covered page and reads as a rendering bug.
      // Starting it at `COVER_END` is the one timing change from the theme.
      tl.set(layer1, { opacity: 1 }, COVER_END).fromTo(
        logo,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: LOGO_IN, ease: "power2.out" },
        COVER_END,
      );
    };

    // Capture phase — must beat Next `<Link>`'s own handler on the anchor.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [columns, router]);

  return (
    <div id="page-transition-layer" ref={rootRef} className="page-transition-layer">
      <div className="overlay layer-1" ref={layer1Ref}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the curtain
            paints before hydration and must not wait on the image optimiser. */}
        <img
          ref={logo1Ref}
          className="transition-logo"
          src="/images/logox3.png"
          alt=""
          aria-hidden
        />
      </div>

      <div className="overlay layer-2" ref={layer2Ref}>
        <div className="transition-group" ref={groupRef}>
          {/* eslint-disable-next-line @next/next/no-img-element -- as above */}
          <img className="transition-logo" src="/images/logox3.png" alt="" aria-hidden />
          <div className="transition-percent" ref={percentRef}>
            0%
          </div>
        </div>
      </div>

      <div className="transition-columns">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <div key={i} className="transition-column" />
        ))}
      </div>
    </div>
  );
}
