/**
 * Second migration pass.
 *
 * The theme builds its landing pages and the case-study / product / service
 * detail pages from ACF field groups, so `content.rendered` comes back empty
 * from the REST API. For those we take the rendered HTML instead, keep the
 * `.page-content` region, localise its images and strip the WordPress runtime
 * attributes (lazyload, Alpine bindings, AOS) that we re-implement ourselves.
 *
 *   node scripts/fetch-rendered.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const SITE = "https://chinasourcing.co";
const OUT = path.join(process.cwd(), "src/data/content");
const IMG_DIR = path.join(process.cwd(), "public/images");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36";

/** Landing pages whose layout lives entirely in ACF. */
const LANDING = [
  "about-us",
  "products",
  "services",
  "process",
  "case-studies",
  "resources",
  "contact-us",
];

const seen = new Set();

async function downloadImage(url) {
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

/**
 * Pull the page body out of the rendered document.
 *
 * Templates are inconsistent: the home page wraps everything in
 * `<section class="page-content">`, while the landing pages drop their
 * sections straight into `<main>`. Taking everything between the header and
 * the end of `<main>` covers both.
 */
function extractBody(html) {
  const mainStart = html.indexOf("<main");
  if (mainStart === -1) return null;
  const mainEnd = html.indexOf("</main>", mainStart);
  if (mainEnd === -1) return null;

  let body = html.slice(html.indexOf(">", mainStart) + 1, mainEnd);

  // Drop the site header — we render our own <Header /> component.
  const headerEnd = body.lastIndexOf("</header>");
  if (headerEnd !== -1) body = body.slice(headerEnd + "</header>".length);

  return body.trim() || null;
}

async function clean(html) {
  let out = html;

  // Drop the noscript duplicates the lazy-loader injects for every image
  out = out.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Lazy-loaded images keep their real URL in data-src
  out = out.replace(
    /<img([^>]*?)\sdata-src="([^"]+)"([^>]*)>/gi,
    (_, a, src, b) => `<img${a} src="${src}"${b}>`,
  );

  // Localise every image we can reach
  const urls = new Set(
    [...out.matchAll(/(?:src|data-bg)="([^"]+)"/g)].map((m) => m[1]),
  );
  for (const url of urls) {
    const local = await downloadImage(url);
    if (local) out = out.split(url).join(local);
  }

  // Absolute internal links become app-relative
  out = out.split(`${SITE}/`).join("/");

  // Strip runtime attributes we re-implement natively
  out = out.replace(
    /\s(x-data|x-show|x-cloak|x-collapse|x-transition[.:][\w.-]*|x-ref|x-init|@click[.\w]*|:class|data-aos[\w-]*|data-lazyloaded|data-src|data-srcset|data-sizes|loading|decoding|fetchpriority)="[^"]*"/gi,
    "",
  );
  out = out.replace(/\s(x-cloak|x-collapse)(?=[\s>])/gi, "");
  out = out.replace(/\sclass="([^"]*)\blozad\b([^"]*)"/gi, ' class="$1$2"');

  return out.replace(/\s{2,}/g, " ").trim();
}

async function fetchPage(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function run(label, slugs, prefix = "") {
  process.stdout.write(`${label}… `);
  const out = {};
  let ok = 0;
  for (const slug of slugs) {
    try {
      const html = await fetchPage(`${SITE}${prefix}/${slug}/`);
      const body = extractBody(html);
      if (!body) continue;
      out[slug] = await clean(body);
      ok += 1;
    } catch (err) {
      console.warn(`\n  ! ${slug}: ${err.message}`);
    }
  }
  console.log(`${ok}/${slugs.length}`);
  return out;
}

async function slugsFrom(file) {
  const data = JSON.parse(await fs.readFile(path.join(OUT, file), "utf8"));
  return data.map((d) => d.slug);
}

async function main() {
  const rendered = {};

  rendered.landing = await run("Landing pages", LANDING);
  rendered.services = await run(
    "Services",
    await slugsFrom("services.json"),
    "/service",
  );
  rendered.products = await run(
    "Products",
    await slugsFrom("products.json"),
    "/product",
  );
  rendered["case-studies"] = await run(
    "Case studies",
    await slugsFrom("case-studies.json"),
    "/case-study",
  );

  await fs.writeFile(
    path.join(OUT, "rendered.json"),
    JSON.stringify(rendered, null, 2),
  );

  const counts = Object.entries(rendered)
    .map(([k, v]) => `${k}: ${Object.keys(v).length}`)
    .join(", ");
  console.log(`\nWrote rendered.json — ${counts}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
