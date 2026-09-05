"use client";

import { useEffect, useRef } from "react";

const EMBED_SCRIPT =
  "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

/**
 * The HubSpot Meetings scheduler — the booking calendar on `/contact-us`.
 *
 * This is the live third-party widget, the same embed URL the original uses, so
 * the calendar shows real availability and a visitor can actually book. It is
 * the one place the clone calls a third party rather than shelling out the UI
 * (contrast TARGET.md deviations 2 and 3) — a fake calendar showing invented
 * slots would look right and quietly waste someone's time.
 *
 * The embed script scans for `.meetings-iframe-container[data-src]` when it
 * runs, once. That is fine on a fresh load and useless on a client-side
 * navigation, so the script element is appended on mount and removed on
 * unmount: re-adding it re-executes the scan. The container is emptied first so
 * React's development double-effect cannot leave two iframes behind.
 */
export function HubspotMeetings({ src }: { src: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = "";

    const container = document.createElement("div");
    container.className = "meetings-iframe-container";
    container.dataset.src = src;
    host.appendChild(container);

    const script = document.createElement("script");
    script.src = EMBED_SCRIPT;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      host.innerHTML = "";
    };
  }, [src]);

  // 800x715 is the iframe's own size once loaded; reserving it stops the
  // section collapsing and re-flowing when the widget arrives.
  return <div ref={hostRef} className="min-h-[715px]" />;
}
