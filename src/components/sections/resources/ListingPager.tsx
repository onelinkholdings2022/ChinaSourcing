"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Page numbers for both listings, reproducing the theme's `renderPagination`.
 *
 * Two layouts, chosen by viewport rather than by CSS — the original reads
 * `window.innerWidth < 768` when it builds the buttons:
 *
 * - **Mobile** — `‹ prev · current · next ›`, a three-number window with
 *   chevrons that only appear when there is somewhere to go.
 * - **Desktop** — every page up to six; beyond that an elided run:
 *   `1 2 3 4 5 … n` near the start, `1 … p-1 p p+1 … n` in the middle,
 *   `1 … n-4 n-3 n-2 n-1 n` near the end.
 *
 * Nothing renders below two pages.
 */
export function ListingPager({
  page,
  totalPages,
  onChange,
  variant,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  variant: "blog" | "resource";
}) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const update = () => setNarrow(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (totalPages < 2) return null;

  // `mt-16` is on the element in the markup and overrides the stylesheet's
  // `margin-top: 2.5rem` — 64px, not 40px, which is 24px of section height.
  const cls = cn("listing-pager mt-16 text-center", `listing-pager--${variant}`);

  const numberButton = (n: number) => (
    <button
      key={n}
      type="button"
      onClick={() => onChange(n)}
      className={n === page ? "active" : undefined}
    >
      {n}
    </button>
  );

  if (narrow) {
    return (
      <div className={cls}>
        {page > 1 && (
          <button type="button" onClick={() => onChange(page - 1)}>
            &lt;
          </button>
        )}
        {page > 1 && numberButton(page - 1)}
        {numberButton(page)}
        {page < totalPages && numberButton(page + 1)}
        {page < totalPages && (
          <button type="button" onClick={() => onChange(page + 1)}>
            &gt;
          </button>
        )}
      </div>
    );
  }

  const slots: (number | "…")[] = [];
  if (totalPages <= 6) {
    for (let n = 1; n <= totalPages; n += 1) slots.push(n);
  } else if (page <= 3) {
    slots.push(1, 2, 3, 4, 5, "…", totalPages);
  } else if (page < totalPages - 2) {
    slots.push(1, "…", page - 1, page, page + 1, "…", totalPages);
  } else {
    slots.push(1, "…");
    for (let n = totalPages - 4; n <= totalPages; n += 1) slots.push(n);
  }

  return (
    <div className={cls}>
      {slots.map((slot, i) =>
        slot === "…" ? (
          // Two ellipses at most, and position is their only identity.
          <span key={`gap-${i}`} className="px-2">
            ...
          </span>
        ) : (
          numberButton(slot)
        ),
      )}
    </div>
  );
}
