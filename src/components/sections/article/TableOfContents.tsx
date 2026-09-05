"use client";

import { useState } from "react";

/**
 * The Easy Table of Contents box beside the article body.
 *
 * Rebuilt rather than re-imported: it is a plugin, but all it renders is a
 * titled box of anchor links plus a collapse toggle. The two glyphs on the
 * right are the plugin's own — a list mark and an unsorted-arrow — and the
 * whole title row is `display: table` with the toggle floated into it, which is
 * what makes that row 34px rather than the title's own 27px.
 *
 * The toggle really does collapse the box on the original: 481px down to 56px
 * and back.
 */
export function TableOfContents({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="ez-toc">
      <div className="ez-toc-title-container">
        <p className="ez-toc-title">Table of Contents</p>
        <button
          type="button"
          aria-label="Toggle Table of Content"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="ez-toc-toggle"
        >
          {/* The 1px outline the plugin draws sits on this span, not the
              button — see `.ez-toc-toggle > span` in globals.css. */}
          <span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6H4v2h2V6zm14 0H8v2h12V6zM4 11h2v2H4v-2zm16 0H8v2h12v-2zM4 16h2v2H4v-2zm16 0H8v2h12v-2z"
                fill="currentColor"
              />
            </svg>
            <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M18.2 9.3l-6.2-6.3-6.2 6.3c-.2.2-.3.4-.3.7s.1.5.3.7c.2.2.4.3.7.3h11c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7s-.1-.5-.3-.7zM5.8 14.7l6.2 6.3 6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7c-.2-.2-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3-.2.2-.3.5-.3.7s.1.5.3.7z"
              />
            </svg>
          </span>
        </button>
      </div>

      {open && (
        <nav aria-label="Table of contents">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
