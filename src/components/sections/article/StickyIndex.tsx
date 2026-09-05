"use client";

import { useState } from "react";

/**
 * The "Index" tab pinned to the left edge of the viewport, and the drawer it
 * opens — the Easy Table of Contents plugin's sticky sidebar.
 *
 * The tab is `position: fixed; left: 0; top: 8%`, an `inline-grid` of an arrow
 * over the word "Index" set in `writing-mode: vertical-rl`, on a white pill
 * rounded only on its right edge. It stays put at every scroll position and is
 * present on every article.
 *
 * The drawer is a second fixed layer that slides in from `left: -100%` to
 * `left: 0`. Note the two transitions are not symmetrical, which is the
 * plugin's own asymmetry: opening is `left .3s linear`, closing is
 * `opacity .3s linear, left .3s cubic-bezier(.4, 0, 1, 1)`.
 *
 * Its width is `auto` — it shrink-wraps to the longest entry rather than taking
 * a set width, so a page with short headings gets a narrow drawer.
 */
export function StickyIndex({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Open index"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="ez-toc-open-icon"
      >
        <span className="text-[18px]">→</span>
        <span className="text-[13px] [writing-mode:vertical-rl]">Index</span>
      </button>

      <div className={`ez-toc-sticky-fixed ${open ? "show" : "hide"}`}>
        <div className="ez-toc-sidebar">
          <div className="ez-toc-sticky-title-container">
            <p className="ez-toc-sticky-title">Table of Contents</p>
            <button
              type="button"
              aria-label="Close index"
              onClick={() => setOpen(false)}
              className="ez-toc-close-icon"
            >
              ×
            </button>
          </div>

          <nav id="ez-toc-sticky-container" aria-label="Article index">
            <ul>
              {items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
