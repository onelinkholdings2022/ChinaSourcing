/**
 * Pulls every page/post from the live WordPress install into local JSON,
 * and downloads each featured image into public/images/.
 *
 * Re-run this whenever the source content changes:
 *   node scripts/fetch-content.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const SITE = "https://chinasourcing.co";
const OUT_DIR = path.join(process.cwd(), "src/data/content");
const IMG_DIR = path.join(process.cwd(), "public/images");

/** WP post types to mirror, in the order we want them built. */
const TYPES = [
  { rest: "pages", name: "pages" },
  { rest: "service", name: "services" },
  { rest: "product", name: "products" },
  { rest: "case-study", name: "case-studies" },
  { rest: "resource", name: "resources" },
  { rest: "posts", name: "posts" },
];

const decode = (s = "") =>
  s
    .replace(/&#8217;|&#039;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const stripTags = (html = "") =>
  decode(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));

async function getJSON(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "chinasourcing-clone/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return { data: await res.json(), total: res.headers.get("x-wp-totalpages") };
}

/** Fetch every page of a paginated collection. */
async function fetchAll(restType) {
  const all = [];
  let page = 1;
  for (;;) {
    const url = `${SITE}/wp-json/wp/v2/${restType}?per_page=100&page=${page}&_embed=wp:featuredmedia`;
    let batch;
    try {
      ({ data: batch } = await getJSON(url));
    } catch (err) {
      if (String(err).includes("400")) break; // past the last page
      throw err;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return all;
}

const seenImages = new Set();

async function downloadImage(url) {
  if (!url || !url.startsWith("http")) return null;
  const file = decodeURIComponent(url.split("/").pop().split("?")[0]);
  const dest = path.join(IMG_DIR, file);
  if (seenImages.has(file)) return `/images/${file}`;
  seenImages.add(file);
  try {
    await fs.access(dest);
    return `/images/${file}`; // already on disk
  } catch {
    /* needs downloading */
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
    return `/images/${file}`;
  } catch {
    return null;
  }
}

/** Rewrite <img src> in body HTML to the local copies we just downloaded. */
async function localiseImages(html = "") {
  const urls = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  let out = html;
  for (const url of urls) {
    const local = await downloadImage(url);
    if (local) out = out.split(url).join(local);
  }
  return out;
}

function toRecord(item) {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: item.id,
    slug: item.slug,
    title: decode(item.title?.rendered ?? ""),
    excerpt: stripTags(item.excerpt?.rendered ?? ""),
    date: item.date,
    modified: item.modified,
    link: item.link?.replace(SITE, "") || `/${item.slug}`,
    featuredImage: media?.source_url ?? null,
    featuredAlt: media?.alt_text ?? "",
    content: item.content?.rendered ?? "",
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(IMG_DIR, { recursive: true });

  const summary = [];

  for (const { rest, name } of TYPES) {
    process.stdout.write(`Fetching ${name}… `);
    const raw = await fetchAll(rest);
    const records = [];

    for (const item of raw) {
      const record = toRecord(item);
      record.featuredImage = await downloadImage(record.featuredImage);
      record.content = await localiseImages(record.content);
      records.push(record);
    }

    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    await fs.writeFile(
      path.join(OUT_DIR, `${name}.json`),
      JSON.stringify(records, null, 2),
    );
    console.log(`${records.length} items`);
    summary.push(`${name}: ${records.length}`);
  }

  console.log(`\nDone. ${summary.join(", ")}`);
  console.log(`Images on disk: ${seenImages.size} referenced this run.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
