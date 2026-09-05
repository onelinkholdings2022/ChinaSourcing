/**
 * Shared scraping helpers for the migration scripts.
 *
 * The theme's markup is regular enough to parse with targeted regexes, but two
 * things trip a naive approach and both are handled here: attribute values that
 * contain `>` (Tailwind arbitrary variants such as `[&>*]:body-2`), and nesting
 * several `<div>`s deep, which a lazy `</div>` match cannot survive. `inner()`
 * counts opens and closes of the same tag name; `tagEnd()` skips over quoted
 * attribute values.
 *
 * Used by `fetch-case-studies.mjs` and `fetch-resources.mjs`.
 */
import fs from "node:fs/promises";
import path from "node:path";

export const SITE = "https://chinasourcing.co";
export const AJAX = `${SITE}/wp-admin/admin-ajax.php`;
export const OUT = path.join(process.cwd(), "src/data/content");
export const IMG_DIR = path.join(process.cwd(), "public/images");

export const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36";

/** The pill above every section heading. */
export const TAG_RE = /<div\b[^>]*class="[^"]*\btag\b[^"]*"[^>]*>/i;

export async function fetchText(url, init) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, ...init });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

/* ------------------------------------------------------------------ assets */

const seen = new Set();

export async function downloadImage(url) {
  if (!url?.startsWith("http") || !url.includes("chinasourcing.co")) return null;
  const file = decodeURIComponent(url.split("/").pop().split("?")[0]);
  if (!/\.(png|jpe?g|webp|svg|gif|avif)$/i.test(file)) return null;
  const dest = path.join(IMG_DIR, file);
  if (seen.has(file)) return `/images/${file}`;
  seen.add(file);
  try {
    await fs.access(dest);
    return `/images/${file}`;
  } catch {
    /* download below */
  }
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
    return `/images/${file}`;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------- parse */

const ENTITIES = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
  "&nbsp;": " ", "&hellip;": "…", "&ndash;": "–", "&mdash;": "—",
};

export function decode(s = "") {
  return s.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (whole, dec, hex, named) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return ENTITIES[`&${named};`] ?? whole;
  });
}

/** Tag-stripped, entity-decoded, whitespace-collapsed text of an HTML string. */
export function text(html = "") {
  return decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

/**
 * Inner HTML of the element whose opening tag starts at `from`.
 *
 * The theme nests `<div>`s several levels deep inside every block, so a lazy
 * regex would stop at the first `</div>`. Counting opens and closes of the same
 * tag name is the only thing that gets the whole subtree. Void elements never
 * appear as the outer tag here, so they need no special case.
 */
/**
 * Index just past the `>` that closes the tag starting at `from`.
 *
 * Not `indexOf(">")`: the theme writes Tailwind arbitrary variants such as
 * `class="[&>*]:body-2"`, so a bare scan for `>` stops inside the attribute
 * and everything downstream is off by one tag.
 */
export function tagEnd(html, from) {
  let quote = null;
  for (let i = from; i < html.length; i += 1) {
    const ch = html[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === ">") return i + 1;
  }
  return html.length;
}

export function inner(html, from) {
  const open = tagEnd(html, from);
  const tag = html.slice(from + 1).match(/^[a-z0-9]+/i)[0];
  const re = new RegExp(`</?${tag}\\b`, "gi");
  re.lastIndex = open;
  let depth = 1;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (depth === 0) return { html: html.slice(open, m.index), end: tagEnd(html, m.index) };
  }
  return { html: html.slice(open), end: html.length };
}

/** Every element matching `re` at any depth, as `{ attrs, html }`. */
export function all(html, re) {
  const out = [];
  const rx = new RegExp(re.source, "gi");
  let m;
  while ((m = rx.exec(html))) {
    const { html: body, end } = inner(html, m.index);
    out.push({ attrs: html.slice(m.index, tagEnd(html, m.index)), html: body });
    rx.lastIndex = Math.max(rx.lastIndex, end);
  }
  return out;
}

export function one(html, re) {
  return all(html, re)[0] ?? null;
}

export const attr = (tagHtml, name) =>
  tagHtml?.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1] ?? null;

export const firstImg = (html) => html?.match(/<img\b[^>]*>/i)?.[0] ?? null;

/* ------------------------------------------------------------------ clean */

/** Undo the lazy-loader and drop the WordPress runtime attributes. */
export function normalise(html) {
  return html
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // A lazy image carries both a 1x1 base64 `src` and the real `data-src`.
    // The placeholder has to go first — leaving it in place would produce a
    // duplicate attribute, and the *first* one is the one that wins.
    .replace(/<img\b[^>]*\sdata-src="[^"]+"[^>]*>/gi, (tag) =>
      tag.replace(/\ssrc="data:[^"]*"/i, "").replace(/\sdata-src="/i, ' src="'),
    )
    .replace(
      /\s(data-aos[\w-]*|data-lazyloaded|data-src|data-srcset|data-sizes|data-sheets-root|loading|decoding|fetchpriority|sizes|srcset)="[^"]*"/gi,
      "",
    )
    .replace(/\sclass="([^"]*)\blozad\b([^"]*)"/gi, ' class="$1$2"');
}

/** Localise every `src` inside a fragment, downloading as it goes. */
export async function localise(html) {
  let out = html;
  const urls = new Set([...out.matchAll(/src="([^"]+)"/g)].map((m) => m[1]));
  for (const url of urls) {
    const local = await downloadImage(url);
    if (local) out = out.split(url).join(local);
  }
  return out.split(`${SITE}/`).join("/");
}

/* ---------------------------------------------------------------- sections */

export function mainOf(html) {
  const s = html.indexOf("<main");
  const e = html.indexOf("</main>", s);
  return html.slice(html.indexOf(">", s) + 1, e);
}

/** The five top-level `<section>`s of a detail page, in document order. */
export function sectionsOf(main) {
  const out = [];
  const re = /<section\b[^>]*>/gi;
  let m;
  while ((m = re.exec(main))) {
    const { html: body, end } = inner(main, m.index);
    out.push({ attrs: main.slice(m.index, tagEnd(main, m.index)), html: body });
    re.lastIndex = end;
  }
  return out;
}
