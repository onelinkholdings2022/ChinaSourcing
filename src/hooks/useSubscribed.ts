"use client";

import { useEffect, useState } from "react";

/** The theme's own flag — `localStorage.onelink_subscribed`. */
const KEY = "onelink_subscribed";
const EVENT = "onelink-subscribed";

/**
 * Whether the reader has handed over an email, which is what unlocks the full
 * article body.
 *
 * The original checks `localStorage.getItem("onelink_subscribed")` on
 * `DOMContentLoaded` and, if set, lifts the `max-height` off
 * `#post-content-container`, hides `#content-overlay` and hides the subscribe
 * form. Same contract, same key — so a browser that has already been through
 * the real site stays unlocked here.
 *
 * Always starts `false` so the server and the first client render agree; the
 * effect flips it after mount, exactly as the original's script does.
 *
 * The custom event is what keeps the body and the form in step: they are
 * siblings, not nested, so submitting the form has to reach across.
 */
export function useSubscribed() {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const read = () => setSubscribed(Boolean(localStorage.getItem(KEY)));
    read();
    window.addEventListener(EVENT, read);
    // Another tab unlocking counts too.
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return subscribed;
}

export function markSubscribed() {
  localStorage.setItem(KEY, "true");
  window.dispatchEvent(new Event(EVENT));
}
