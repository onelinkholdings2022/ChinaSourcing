import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The share strip under the article body.
 *
 * The original uses the Heateor plugin: five 24x24 `rounded` squares with a
 * white glyph inside. Rebuilt as plain links so the page carries no plugin —
 * the 4px radius, the 2px margins and the glyph paths are the plugin's own.
 *
 * ## The chips are grey, not brand colours
 *
 * Every anchor ships an inline `background-color` in its network's colour
 * (`#0765FE` for Facebook, `#0077b5` for LinkedIn, and so on) — and none of
 * them apply. The theme's stylesheet paints over all five at once:
 *
 *     .heateor_sss_horizontal_sharing .heateor_sss_svg {
 *       color: #fff; border: 0; background: rgb(163,163,163) !important;
 *     }
 *     .heateor_sss_horizontal_sharing span.heateor_sss_svg:hover {
 *       background-color: rgb(15,45,66) !important;
 *     }
 *
 * So the strip reads as one grey row (`grey-300`) that goes dark navy on
 * hover, with no transition. Reading the inline attribute instead of the
 * computed style is the trap here.
 *
 * "Copy Link" and "More" are `preventDefault()` no-ops on the original — the
 * plugin binds their popups at runtime. Copy Link keeps its `href` (the page
 * itself, so a right-click still yields the URL); More stays inert.
 */
const CHIP =
  "w-6 h-6 m-0.5 rounded flex items-center justify-center shrink-0 " +
  "bg-grey-300 text-white hover:bg-[#0f2d42]";

function Chip({ children }: { children: ReactNode }) {
  return <span className={CHIP}>{children}</span>;
}

export function ShareRow({
  url,
  title,
  /**
   * The case study writes `justify-end`, the article pages do not. It makes no
   * visual difference — the chip group grows to fill the row either way — but
   * the class is theirs, so it stays a prop.
   */
  className = "inline-flex justify-end",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  return (
    <div
      className={cn("body-3 text-dark-blue-900 gap-4 items-center", className)}
    >
      Share:
      {/* The plugin's own wrapper is a block that takes the rest of the row and
          floats the chips left inside it, each with a 2px margin — so
          `justify-end` on the row above has nothing left to move. Same
          geometry here: the group grows, the chips stay left. */}
      <div className="grow flex flex-wrap pt-px">
        <a
          href={url}
          aria-label="Copy Link"
          title="Copy Link"
          rel="noopener"
          className="inline-block"
        >
          <Chip>
            <svg viewBox="-4 -4 40 40" width="24" height="24" aria-hidden>
              <path
                fill="#FFFFFF"
                d="M24.412 21.177c0-.36-.126-.665-.377-.917l-2.804-2.804a1.235 1.235 0 0 0-.913-.378c-.377 0-.7.144-.97.43.026.028.11.11.255.25.144.14.24.236.29.29s.117.14.2.256c.087.117.146.232.177.344.03.112.046.236.046.37 0 .36-.126.666-.377.918a1.25 1.25 0 0 1-.918.377 1.4 1.4 0 0 1-.373-.047 1.062 1.062 0 0 1-.345-.175 2.268 2.268 0 0 1-.256-.2 6.815 6.815 0 0 1-.29-.29c-.14-.142-.223-.23-.25-.254-.297.28-.445.607-.445.984 0 .36.126.664.377.916l2.778 2.79c.243.243.548.364.917.364.36 0 .665-.118.917-.35l1.982-1.97c.252-.25.378-.55.378-.9zm-9.477-9.504c0-.36-.126-.665-.377-.917l-2.777-2.79a1.235 1.235 0 0 0-.913-.378c-.35 0-.656.12-.917.364L7.967 9.92c-.254.252-.38.553-.38.903 0 .36.126.665.38.917l2.802 2.804c.242.243.547.364.916.364.377 0 .7-.14.97-.418-.026-.027-.11-.11-.255-.25s-.24-.235-.29-.29a2.675 2.675 0 0 1-.2-.255 1.052 1.052 0 0 1-.176-.344 1.396 1.396 0 0 1-.047-.37c0-.36.126-.662.377-.914.252-.252.557-.377.917-.377.136 0 .26.015.37.046.114.03.23.09.346.175.117.085.202.153.256.2.054.05.15.148.29.29.14.146.222.23.25.258.294-.278.442-.606.442-.983zM27 21.177c0 1.078-.382 1.99-1.146 2.736l-1.982 1.968c-.745.75-1.658 1.12-2.736 1.12-1.087 0-2.004-.38-2.75-1.143l-2.777-2.79c-.75-.747-1.12-1.66-1.12-2.737 0-1.106.392-2.046 1.183-2.818l-1.186-1.185c-.774.79-1.708 1.186-2.805 1.186-1.078 0-1.995-.376-2.75-1.13l-2.803-2.81C5.377 12.82 5 11.903 5 10.826c0-1.08.382-1.993 1.146-2.738L8.128 6.12C8.873 5.372 9.785 5 10.864 5c1.087 0 2.004.382 2.75 1.146l2.777 2.79c.75.747 1.12 1.66 1.12 2.737 0 1.105-.392 2.045-1.183 2.817l1.186 1.186c.774-.79 1.708-1.186 2.805-1.186 1.078 0 1.995.377 2.75 1.132l2.804 2.804c.754.755 1.13 1.672 1.13 2.75z"
              />
            </svg>
          </Chip>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
          aria-label="Facebook"
          title="Facebook"
          rel="nofollow noopener"
          target="_blank"
          className="inline-block"
        >
          <Chip>
            <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden>
              <path
                fill="#FFFFFF"
                d="M28 16c0-6.627-5.373-12-12-12S4 9.373 4 16c0 5.628 3.875 10.35 9.101 11.647v-7.98h-2.474V16H13.1v-1.58c0-4.085 1.849-5.978 5.859-5.978.76 0 2.072.15 2.608.298v3.325c-.283-.03-.775-.045-1.386-.045-1.967 0-2.728.745-2.728 2.683V16h3.92l-.673 3.667h-3.247v8.245C23.395 27.195 28 22.135 28 16Z"
              />
            </svg>
          </Chip>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`}
          aria-label="X"
          title="X"
          rel="nofollow noopener"
          target="_blank"
          className="inline-block"
        >
          <Chip>
            <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden>
              <path
                fill="#FFFFFF"
                d="M21.751 7h3.067l-6.7 7.658L26 25.078h-6.172l-4.833-6.32-5.531 6.32h-3.07l7.167-8.19L6 7h6.328l4.37 5.777L21.75 7Zm-1.076 16.242h1.7L11.404 8.74H9.58l11.094 14.503Z"
              />
            </svg>
          </Chip>
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
          aria-label="Linkedin"
          title="Linkedin"
          rel="nofollow noopener"
          target="_blank"
          className="inline-block"
        >
          <Chip>
            <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden>
              <path
                fill="#FFFFFF"
                d="M6.227 12.61h4.19v13.48h-4.19V12.61zm2.095-6.7a2.43 2.43 0 0 1 0 4.86c-1.344 0-2.428-1.09-2.428-2.43s1.084-2.43 2.428-2.43m4.72 6.7h4.02v1.84h.058c.56-1.058 1.927-2.176 3.965-2.176 4.238 0 5.02 2.792 5.02 6.42v7.395h-4.183v-6.56c0-1.564-.03-3.574-2.178-3.574-2.18 0-2.514 1.7-2.514 3.46v6.668h-4.187V12.61z"
              />
            </svg>
          </Chip>
        </a>

        <span aria-label="More" title="More" className="inline-block">
          <Chip>
            <svg viewBox="-.3 0 32 32" width="24" height="24" aria-hidden>
              <path
                fill="#FFFFFF"
                fillRule="evenodd"
                d="M18 14V8h-4v6H8v4h6v6h4v-6h6v-4h-6z"
              />
            </svg>
          </Chip>
        </span>
      </div>
    </div>
  );
}
