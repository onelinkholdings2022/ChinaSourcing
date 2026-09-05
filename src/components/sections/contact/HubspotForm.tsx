"use client";

import { useEffect, useId, useRef } from "react";

const EMBED_SCRIPT = "https://js.hsforms.net/forms/embed/v2.js";

type FormsApi = {
  create: (options: {
    portalId: string;
    formId: string;
    region: string;
    target: string;
    onFormSubmitted?: () => void;
  }) => void;
};

declare global {
  interface Window {
    hbspt?: { forms: FormsApi };
  }
}

/**
 * A HubSpot embedded form — the contact form on `/contact-us`.
 *
 * The original calls `hbspt.forms.create()` from a `<script>` sitting inside
 * the box it wants to fill, which renders the form at the script's position.
 * That has no React equivalent, so this passes an explicit `target` instead;
 * the rendered markup is the same cross-origin `iframe.hs-form-iframe`.
 *
 * Every one of the site's forms sets `localStorage.onelink_subscribed` on
 * submit — the same flag that lifts the article paywall (see `useSubscribed`),
 * which is why filling in the contact form unlocks the blog.
 */
export function HubspotForm({
  portalId,
  formId,
  region = "na1",
  className,
}: {
  portalId: string;
  formId: string;
  region?: string;
  className?: string;
}) {
  const targetId = useId().replace(/:/g, "");
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const render = () => {
      if (cancelled || !window.hbspt) return;
      host.innerHTML = "";
      window.hbspt.forms.create({
        portalId,
        formId,
        region,
        target: `#${targetId}`,
        onFormSubmitted: () => {
          localStorage.setItem("onelink_subscribed", "true");
        },
      });
    };

    if (window.hbspt) {
      render();
      return () => {
        cancelled = true;
      };
    }

    // One shared loader: several pages can mount a form, and v2.js only needs
    // to run once for `window.hbspt` to exist.
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SCRIPT}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = EMBED_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", render);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", render);
    };
  }, [portalId, formId, region, targetId]);

  return <div id={targetId} ref={hostRef} className={className} />;
}
