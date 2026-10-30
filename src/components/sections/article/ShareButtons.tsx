"use client";

import { useState } from "react";

const BTN =
  "w-9 h-9 rounded-full border border-[#C9D6F5] flex items-center justify-center text-dark-blue-950 " +
  "transition-colors duration-150 ease-[cubic-bezier(.4,0,.2,1)] hover:bg-[#EEF3FD] hover:border-cyan-400";

/** Copy link + LinkedIn + X + Facebook — dải "Share" dưới mục lục desktop. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Copied!" : "Copy link"}
        className={BTN}
        onClick={() => {
          void navigator.clipboard?.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          });
        }}
      >
        {copied ? (
          <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
        ) : (
          <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
        )}
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="nofollow noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={BTN}
      >
        <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3v-11zm6.5 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11z" />
        </svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`}
        target="_blank"
        rel="nofollow noopener noreferrer"
        aria-label="Share on X"
        className={BTN}
      >
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.19L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.24h1.7L7.4 4.74H5.58l11.09 14.5z" />
        </svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
        target="_blank"
        rel="nofollow noopener noreferrer"
        aria-label="Share on Facebook"
        className={BTN}
      >
        <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.2-.1-2.4-.1-2.4 0-4 1.4-4 4.1v1.9H8v3.2h2.6V21H14v-9.3h2.6l.4-3.2h-3z" />
        </svg>
      </a>
    </div>
  );
}
