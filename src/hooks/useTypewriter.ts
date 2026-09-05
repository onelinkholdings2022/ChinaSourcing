"use client";

import { useEffect, useState } from "react";

/**
 * The site's TypeIt animation, reimplemented.
 *
 * Both heroes drive TypeIt from a hidden `<span>` list, and the bundle spells
 * the two configs out:
 *
 * ```js
 * // homepage — .typeit-hero
 * new TypeIt(".typeit-hero", { speed: 30, loop: true, breakLines: false, waitUntilVisible: true });
 * words.forEach(w => t.type(w).pause(2000).delete().pause(1000));
 *
 * // /products — .typeit-internal-hero
 * new TypeIt(".typeit-internal-hero", { speed: 60, loop: true, breakLines: false, waitUntilVisible: true });
 * words.forEach(w => t.type(w).pause(1500).delete().pause(500));
 * ```
 *
 * TypeIt's `deleteSpeed` defaults to half of `speed`, which is where the
 * `deleteMs` defaults below come from — the theme never sets it explicitly.
 */
export type TypewriterTiming = {
  /** ms per typed character — TypeIt's `speed`. */
  typeMs: number;
  /** ms per deleted character — TypeIt defaults this to `speed / 2`. */
  deleteMs?: number;
  /** Hold on the finished word — the `.pause()` after `.type()`. */
  holdMs: number;
  /** Gap after deleting, before the next word — the `.pause()` after `.delete()`. */
  restMs: number;
};

type TypeState = { index: number; length: number; deleting: boolean };

export function useTypewriter(words: string[], timing: TypewriterTiming) {
  const { typeMs, holdMs, restMs } = timing;
  const deleteMs = timing.deleteMs ?? typeMs / 2;

  const [state, setState] = useState<TypeState>({
    index: 0,
    length: 0,
    deleting: false,
  });
  const { index, length, deleting } = state;
  const word = words[index % words.length] ?? "";

  useEffect(() => {
    // Every transition — including "finished deleting, move to the next word" —
    // is scheduled on a timer. Applying that one synchronously in the effect
    // body instead would cascade an extra render on each keystroke.
    const [delay, next]: [number, TypeState] = !deleting
      ? length < word.length
        ? [typeMs, { index, length: length + 1, deleting: false }]
        : [holdMs, { index, length, deleting: true }]
      : length > 0
        ? [deleteMs, { index, length: length - 1, deleting: true }]
        : [
            restMs,
            { index: (index + 1) % words.length, length: 0, deleting: false },
          ];

    const tick = setTimeout(() => setState(next), delay);
    return () => clearTimeout(tick);
  }, [index, length, deleting, word, words, typeMs, deleteMs, holdMs, restMs]);

  return word.slice(0, length);
}

/** `speed: 30`, `pause(2000)` / `pause(1000)` — the homepage hero. */
export const HOME_TYPING: TypewriterTiming = {
  typeMs: 30,
  holdMs: 2000,
  restMs: 1000,
};

/** `speed: 60`, `pause(1500)` / `pause(500)` — the `/products` hero. */
export const INTERNAL_TYPING: TypewriterTiming = {
  typeMs: 60,
  holdMs: 1500,
  restMs: 500,
};
