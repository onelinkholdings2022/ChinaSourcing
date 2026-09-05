/**
 * Fourth migration pass — `/resources` and every article behind it.
 *
 * `/resources` is ACF-driven, and the two listings on it are rendered in full
 * server-side (12 resource cards, 129 blog cards) with the theme's JS doing
 * nothing but toggling `display` for the category tabs and the pager. So the
 * whole collection has to come across, not a page of it.
 *
 * The article pages are one template used by two post types — `/resource/<slug>`
 * and blog posts at the site root — so both are scraped by the same parser.
 *
 *   src/data/content/resources-index.json  — the two listings + the page chrome
 *   src/data/content/article-pages.json    — one record per article
 *
 *   node scripts/fetch-resources.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import {
  SITE, OUT, IMG_DIR, TAG_RE,
  fetchText, downloadImage, decode, text, all, one, attr, firstImg,
  normalise, localise, mainOf, sectionsOf,
} from "./lib/scrape.mjs";

/** The theme's page sizes, straight out of the bundle. */
const RESOURCE_PER_PAGE = 3;
const BLOG_PER_PAGE = 6;

/* ------------------------------------------------------------------ listing */

/** A `#…-tabs` rail: `data-type` plus its label, in document order. */
function parseTabs(sectionHtml, id) {
  const rail = one(sectionHtml, new RegExp(`<div\\b[^>]*id="${id}"[^>]*>`, "i"));
  if (!rail) return [];
  return all(rail.html, /<button\b[^>]*>/i).map((b) => ({
    value: attr(b.attrs, "data-type") ?? "",
    label: text(b.html),
  }));
}

/**
 * `.resource-listing` — the dark band of download cards.
 *
 * `data-types` is a comma-separated list on the card, which is what the tab
 * filter splits on; kept as an array here.
 */
async function parseResourceListing(sec) {
  const grid = one(sec.html, /<div\b[^>]*id="resource-cards"[^>]*>/i);
  const cards = [];
  for (const card of all(grid?.html ?? "", /<div\b[^>]*class="resource-card[^"]*"[^>]*>/i)) {
    const link = one(card.html, /<a\b[^>]*>/i);
    const lines = all(link?.html ?? "", /<div\b[^>]*>/i);
    cards.push({
      types: (attr(card.attrs, "data-types") ?? "").split(",").filter(Boolean),
      category: text(one(link.html, /<div\b[^>]*class="[^"]*font-lora[^"]*"[^>]*>/i)?.html ?? "") || null,
      title: text(one(link.html, /<h3\b[^>]*>/i)?.html ?? ""),
      excerpt: text(
        one(link.html, /<div\b[^>]*class="body-3 text-grey-600 font-medium"[^>]*>/i)?.html ?? "",
      ),
      // The date is the last `text-grey-600` line, beside the calendar icon.
      date: text(lines.at(-1)?.html ?? ""),
      href: (attr(link.attrs, "href") ?? "").replace(SITE, ""),
    });
  }
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    heading: text(one(sec.html, /<h2\b[^>]*>/i)?.html ?? ""),
    perPage: RESOURCE_PER_PAGE,
    tabs: parseTabs(sec.html, "resource-tabs"),
    cards,
  };
}

/** `.blog-listing` — the grey band; the whole archive, server-rendered. */
async function parseBlogListing(sec) {
  const grid = one(sec.html, /<div\b[^>]*id="blog-cards"[^>]*>/i);
  const cards = [];
  for (const card of all(grid?.html ?? "", /<a\b[^>]*class="blog-card[^"]*"[^>]*>/i)) {
    const img = firstImg(card.html);
    const meta = one(card.html, /<div\b[^>]*class="flex items-center gap-2 body-3[^"]*"[^>]*>/i);
    const metaLines = all(meta?.html ?? "", /<div\b[^>]*class="font-lora"[^>]*>/i).map((d) => text(d.html));
    cards.push({
      types: (attr(card.attrs, "data-types") ?? "").split(",").filter(Boolean),
      category: text(one(card.html, /<div\b[^>]*class="[^"]*font-lora[^"]*"[^>]*>/i)?.html ?? "") || null,
      title: text(one(card.html, /<h3\b[^>]*>/i)?.html ?? ""),
      excerpt: text(one(card.html, /<p\b[^>]*>/i)?.html ?? ""),
      date: metaLines[0] ?? "",
      readingTime: metaLines[1] ?? "",
      image: await downloadImage(attr(img, "src")),
      alt: decode(attr(img, "alt") ?? ""),
      href: (attr(card.attrs, "href") ?? "").replace(SITE, ""),
    });
  }
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    heading: text(one(sec.html, /<h2\b[^>]*>/i)?.html ?? ""),
    intro: text(one(sec.html, /<p\b[^>]*class="text-headline-description[^"]*"[^>]*>/i)?.html ?? ""),
    perPage: BLOG_PER_PAGE,
    tabs: parseTabs(sec.html, "blog-tabs"),
    cards,
  };
}

/** `.split-screen` — the indigo download panel with a document shot beneath. */
async function parseSplitScreen(sec) {
  const img = firstImg(sec.html);
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    heading: text(one(sec.html, /<h2\b[^>]*>/i)?.html ?? ""),
    body: text(one(sec.html, /<p\b[^>]*>/i)?.html ?? ""),
    ctaLabel: text(one(sec.html, /<button\b[^>]*>/i)?.html ?? ""),
    image: await downloadImage(attr(img, "src")),
    alt: decode(attr(img, "alt") ?? ""),
  };
}

/**
 * `.faq` — the accordion.
 *
 * The heading is split across two `<div>`s so the second word can be cyan, and
 * the intro carries a `mailto:` link, so both are captured piecewise rather
 * than as one string.
 */
function parseFaq(sec) {
  const intro = one(sec.html, /<p\b[^>]*class="body-2[^"]*"[^>]*>/i);
  const mail = one(intro?.html ?? "", /<a\b[^>]*>/i);
  const headingParts = all(
    one(sec.html, /<h2\b[^>]*>/i)?.html ?? "",
    /<div\b[^>]*>/i,
  ).map((d) => text(d.html));
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    headingParts,
    intro: text((intro?.html ?? "").replace(/<a\b[\s\S]*?<\/a>/i, "")),
    email: text(mail?.html ?? ""),
    items: all(sec.html, /<div\b[^>]*class="faq-item[^"]*"[^>]*>/i).map((item) => ({
      question: text(one(item.html, /<span\b[^>]*class="body-2 font-semibold"[^>]*>/i)?.html ?? ""),
      answer: text(one(item.html, /<div\b[^>]*x-show="open"[^>]*>/i)?.html ?? ""),
    })),
  };
}

/* ------------------------------------------------------------------ article */

/**
 * One `/resource/<slug>` or root blog post.
 *
 * Both post types render the identical template: hero + fact box, a featured
 * image, a sidebar of table-of-contents links and share buttons beside the
 * gated body, then the subscribe form, related cards and the dark CTA.
 */
async function parseArticle(main) {
  const hero = one(main, /<div\b[^>]*class="relative pt-24 lg:pt-\[120px\] overflow-hidden"[^>]*>/i);
  const box = one(hero?.html ?? "", /<div\b[^>]*class="[^"]*bg-cyan-50[^"]*"[^>]*>/i);
  const facts = [];
  for (const col of all(box?.html ?? "", /<div\b[^>]*class="flex flex-row sm:flex-col[^"]*"[^>]*>/i)) {
    const parts = all(col.html, /<div\b[^>]*>/i);
    facts.push({
      label: text(parts[0]?.html ?? ""),
      icon: await downloadImage(attr(firstImg(col.html), "src")),
      value: text(parts[1]?.html ?? ""),
    });
  }

  const body = one(main, /<div\b[^>]*class="container mx-auto spacing flex flex-col"[^>]*>/i);
  const featured = firstImg(body?.html ?? "");

  const tocNav = one(body?.html ?? "", /<nav\b[^>]*>/i);
  const toc = all(tocNav?.html ?? "", /<a\b[^>]*class="ez-toc-link[^"]*"[^>]*>/i).map((a) => ({
    href: attr(a.attrs, "href") ?? "",
    label: text(a.html),
  }));

  const content = one(body?.html ?? "", /<div\b[^>]*class="[^"]*\brich-text\b[^"]*"[^>]*>/i);

  const secs = sectionsOf(main);
  const formSec = secs.find((s) => /resource-form/.test(s.attrs));
  const relatedSec = secs.find((s) => /my-16/.test(s.attrs));
  const ctaSec = secs.find((s) => /dark-cta/.test(s.attrs));

  const related = [];
  // Keyed on the card's own background, not just `<a>`: the section closes with
  // a "See All Resources" button that is an anchor too.
  for (const card of all(relatedSec?.html ?? "", /<a\b[^>]*class="[^"]*bg-dark-blue-900[^"]*"[^>]*>/i)) {
    const img = firstImg(card.html);
    const meta = one(card.html, /<div\b[^>]*class="flex items-center gap-2 body-3[^"]*"[^>]*>/i);
    const metaLines = all(meta?.html ?? "", /<div\b[^>]*class="font-lora"[^>]*>/i).map((d) => text(d.html));
    related.push({
      category: text(one(card.html, /<div\b[^>]*class="[^"]*font-lora[^"]*"[^>]*>/i)?.html ?? "") || null,
      title: text(one(card.html, /<h3\b[^>]*>/i)?.html ?? ""),
      excerpt: text(one(card.html, /<p\b[^>]*>/i)?.html ?? ""),
      date: metaLines[0] ?? "",
      readingTime: metaLines[1] ?? "",
      image: await downloadImage(attr(img, "src")),
      alt: decode(attr(img, "alt") ?? ""),
      href: (attr(card.attrs, "href") ?? "").replace(SITE, ""),
    });
  }

  return {
    title: text(one(hero?.html ?? "", /<h1\b[^>]*>/i)?.html ?? ""),
    subtitle: text(one(hero?.html ?? "", /<p\b[^>]*class="text-center body-1[^"]*"[^>]*>/i)?.html ?? ""),
    facts,
    featuredImage: await downloadImage(attr(featured, "src")),
    featuredAlt: decode(attr(featured, "alt") ?? ""),
    toc,
    html: await localise(content?.html ?? ""),
    subscribe: {
      tag: text(one(formSec?.html ?? "", TAG_RE)?.html ?? ""),
      heading: text(one(formSec?.html ?? "", /<h2\b[^>]*>/i)?.html ?? ""),
      body: text(one(formSec?.html ?? "", /<p\b[^>]*>/i)?.html ?? ""),
    },
    related: {
      tag: text(one(relatedSec?.html ?? "", TAG_RE)?.html ?? ""),
      heading: text(one(relatedSec?.html ?? "", /<h2\b[^>]*>/i)?.html ?? ""),
      cards: related,
      ctaLabel: text(one(relatedSec?.html ?? "", /<a\b[^>]*class="[^"]*bg-cyan-400[^"]*"[^>]*>/i)?.html ?? ""),
      ctaHref: attr(one(relatedSec?.html ?? "", /<a\b[^>]*class="[^"]*bg-cyan-400[^"]*"[^>]*>/i)?.attrs, "href") ?? "/resources",
    },
    cta: {
      tag: text(one(ctaSec?.html ?? "", TAG_RE)?.html ?? ""),
      heading: text(one(ctaSec?.html ?? "", /<h2\b[^>]*>/i)?.html ?? ""),
      body: text(one(ctaSec?.html ?? "", /<p\b[^>]*class="[^"]*text-dark-blue-400[^"]*"[^>]*>/i)?.html ?? ""),
      ctaLabel: text(one(ctaSec?.html ?? "", /<button\b[^>]*>/i)?.html ?? ""),
      sectionClass: attr(ctaSec?.attrs, "class")?.replace(/\s+/g, " ").trim() ?? "",
    },
  };
}

/* --------------------------------------------------------------------- main */

async function main() {
  await fs.mkdir(IMG_DIR, { recursive: true });

  process.stdout.write("Listing page… ");
  const listMain = normalise(mainOf(await fetchText(`${SITE}/resources/`)));
  const secs = sectionsOf(listMain);
  const pick = (re) => secs.find((s) => re.test(s.attrs));
  const heroSec = secs[0];
  const heroImg = firstImg(heroSec.html);

  const index = {
    hero: {
      heading: text(one(heroSec.html, /<h[12]\b[^>]*>/i)?.html ?? ""),
      intro: text(one(heroSec.html, /<p\b[^>]*>/i)?.html ?? ""),
      image: await downloadImage(attr(heroImg, "src")),
      imageAlt: decode(attr(heroImg, "alt") ?? ""),
    },
    resources: await parseResourceListing(pick(/resource-listing/)),
    blogs: await parseBlogListing(pick(/blog-listing/)),
    splitScreen: await parseSplitScreen(pick(/split-screen/)),
    faq: parseFaq(pick(/\bfaq\b/)),
  };
  console.log(
    `${index.resources.cards.length} resources, ${index.blogs.cards.length} blogs`,
  );

  // Every article the listings link to: `/resource/<slug>` plus the root posts.
  const links = [
    ...index.resources.cards.map((c) => c.href),
    ...index.blogs.cards.map((c) => c.href),
  ];
  const paths = [...new Set(links.filter(Boolean))];

  process.stdout.write(`Article pages (${paths.length})… `);
  const articles = {};
  let done = 0;
  for (const p of paths) {
    try {
      const main = normalise(mainOf(await fetchText(`${SITE}${p}`)));
      // `/resource/x/` and `/x/` both key on the trailing slug.
      articles[p.replace(/\/$/, "").split("/").pop()] = {
        path: p,
        ...(await parseArticle(main)),
      };
      done += 1;
    } catch (err) {
      console.warn(`\n  ! ${p}: ${err.message}`);
    }
  }
  console.log(`${done}/${paths.length}`);

  await fs.writeFile(path.join(OUT, "resources-index.json"), `${JSON.stringify(index, null, 2)}\n`);
  await fs.writeFile(path.join(OUT, "article-pages.json"), `${JSON.stringify(articles, null, 2)}\n`);
  console.log("\nWrote resources-index.json + article-pages.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
