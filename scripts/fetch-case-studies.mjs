/**
 * Third migration pass — the case-study templates.
 *
 * `/case-studies` and the 14 `/case-study/<slug>` pages are ACF-driven like the
 * product and service pages, so `content.rendered` is empty and
 * `fetch-rendered.mjs` can only capture them as a blob of theme markup. This
 * script pulls them apart into the structured JSON the React components take:
 *
 *   src/data/content/case-studies-index.json  — the filter/grid data
 *   src/data/content/case-study-pages.json    — one record per detail page
 *
 * The index comes from the same admin-ajax action the theme's own filter calls
 * (`filter_case_studies`), which is the only place `industry` and `region` are
 * exposed — the rendered cards carry neither, so client-side filtering has to
 * be fed from here.
 *
 *   node scripts/fetch-case-studies.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import {
  SITE, AJAX, OUT, IMG_DIR, TAG_RE,
  fetchText, downloadImage, decode, text, all, one, attr, firstImg,
  normalise, localise, mainOf, sectionsOf,
} from "./lib/scrape.mjs";

/** The theme's own `posts_per_page` — the pagination has to match it. */
const PER_PAGE = 6;


function parseHero(sec) {
  const box = one(sec.html, /<div\b[^>]*class="[^"]*bg-cyan-50[^"]*"[^>]*>/i);
  const meta = box
    ? all(box.html, /<div\b[^>]*class="flex flex-row md:flex-col[^"]*"[^>]*>/i).map((col) => {
        const parts = all(col.html, /<div\b[^>]*>/i);
        const img = firstImg(col.html);
        return {
          label: text(parts[0]?.html ?? ""),
          value: text(parts[1]?.html ?? ""),
          flag: attr(img, "src"),
          flagAlt: attr(img, "alt"),
        };
      })
    : [];
  return {
    heading: text(one(sec.html, /<h1\b[^>]*>/i)?.html ?? ""),
    intro: text(one(sec.html, /<p\b[^>]*class="[^"]*body-1[^"]*"[^>]*>/i)?.html ?? ""),
    meta,
  };
}

function parseSimpleCards(sec) {
  const grid = one(sec.html, /<div\b[^>]*class="grid gap-6[^"]*"[^>]*>/i);
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    heading: text(one(sec.html, /<h2\b[^>]*>/i)?.html ?? ""),
    intro: text(one(sec.html, /<p\b[^>]*class="[^"]*text-dark-blue-50\b[^"]*"[^>]*>/i)?.html ?? ""),
    cards: grid
      ? all(grid.html, /<div\b[^>]*class="space-y-3"[^>]*>/i).map((c) => ({
          icon: attr(firstImg(c.html), "src"),
          title: text(one(c.html, /<h3\b[^>]*>/i)?.html ?? ""),
          body: text(one(c.html, /<p\b[^>]*>/i)?.html ?? ""),
        }))
      : [],
  };
}

/**
 * The article body: alternating tag / heading / rich-text triples.
 *
 * Read as three parallel streams rather than by walking the wrapper divs —
 * the wrappers are bare `<div>` with no class to key on, and the triple is
 * always complete on every page.
 */
async function parseArticle(sec) {
  const tags = all(sec.html, TAG_RE).map((t) => text(t.html));
  const heads = all(sec.html, /<h3\b[^>]*>/i).map((h) => text(h.html));
  const bodies = all(sec.html, /<div\b[^>]*class="rich-text[^"]*"[^>]*>/i).map((b) => b.html);
  const blocks = [];
  for (let i = 0; i < heads.length; i += 1) {
    blocks.push({
      tag: tags[i] ?? "",
      heading: heads[i] ?? "",
      html: await localise(bodies[i] ?? ""),
    });
  }
  return blocks;
}

function parseSlider(sec) {
  const cta = one(sec.html, /<a\b[^>]*>/i);
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    heading: text(one(sec.html, /<h2\b[^>]*>/i)?.html ?? ""),
    ctaLabel: text(cta?.html ?? ""),
    ctaHref: attr(cta?.attrs, "href"),
    cards: all(sec.html, /<div\b[^>]*class="swiper-slide"[^>]*>/i).map((sl) => {
      const img = firstImg(sl.html);
      return {
        category: text(one(sl.html, /<div\b[^>]*class="[^"]*font-lora[^"]*"[^>]*>/i)?.html ?? "") || null,
        title: text(one(sl.html, /<h3\b[^>]*>/i)?.html ?? ""),
        body: text(one(sl.html, /<p\b[^>]*>/i)?.html ?? ""),
        href: attr(one(sl.html, /<a\b[^>]*>/i)?.attrs, "href"),
        image: attr(img, "src"),
        alt: attr(img, "alt"),
      };
    }),
  };
}

/** `.usp-list` — rule-separated items beside one product shot. */
function parseUspList(sec) {
  const items = all(sec.html, /<div\b[^>]*class="usp-list-item[^"]*"[^>]*>/i);
  const photo = [...sec.html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]).at(-1);
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    heading: text(one(sec.html, /<h2\b[^>]*>/i)?.html ?? ""),
    intro: text(one(sec.html, /<p\b[^>]*class="[^"]*body-2[^"]*"[^>]*>/i)?.html ?? ""),
    icon: attr(firstImg(items[0]?.html ?? ""), "src"),
    image: attr(photo, "src"),
    items: items.map((it) => ({
      title: text(one(it.html, /<h3\b[^>]*>/i)?.html ?? ""),
      body: text(one(it.html, /<p\b[^>]*>/i)?.html ?? ""),
    })),
  };
}

/** `.carousel-testimonial` — a looping three-up quote slider. */
function parseTestimonials(sec) {
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    heading: text(one(sec.html, /<h2\b[^>]*>/i)?.html ?? ""),
    items: all(sec.html, /<div\b[^>]*class="swiper-slide"[^>]*>/i).map((sl) => {
      const imgs = [...sl.html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
      const names = all(sl.html, /<div\b[^>]*class="[^"]*flex flex-col gap-1[^"]*"[^>]*>/i)[0];
      const lines = names ? all(names.html, /<div\b[^>]*>/i) : [];
      return {
        quote: text(one(sl.html, /<blockquote\b[^>]*>/i)?.html ?? ""),
        avatar: attr(imgs.at(-1), "src"),
        name: text(lines[0]?.html ?? ""),
        role: text(lines[1]?.html ?? ""),
      };
    }),
  };
}

function parseCta(sec) {
  const btn = one(sec.html, /<button\b[^>]*>/i) ?? one(sec.html, /<a\b[^>]*>/i);
  return {
    tag: text(one(sec.html, TAG_RE)?.html ?? ""),
    heading: text(one(sec.html, /<h2\b[^>]*>/i)?.html ?? ""),
    body: text(one(sec.html, /<p\b[^>]*class="[^"]*text-dark-blue-400[^"]*"[^>]*>/i)?.html ?? ""),
    ctaLabel: text(btn?.html ?? ""),
    // Per-page ACF, exactly like the product pages' dark CTA.
    sectionClass: attr(sec.attrs, "class")?.replace(/\s+/g, " ").trim() ?? "",
  };
}

/* -------------------------------------------------------------------- main */


/** Walk `filter_case_studies` until it runs out of pages. */
async function fetchIndex() {
  const records = [];
  let paged = 1;
  let totalPages = 1;
  do {
    const body = new URLSearchParams({
      action: "filter_case_studies",
      posts_per_page: String(PER_PAGE),
      paged: String(paged),
    });
    const json = JSON.parse(await fetchText(AJAX, { method: "POST", body }));
    if (!json.success) throw new Error("filter_case_studies returned success:false");
    totalPages = json.data.pagination.total_pages;
    for (const c of json.data.case_studies) {
      const img = c.card_image ?? c.image ?? {};
      records.push({
        id: Number(c.ID),
        slug: c.link.replace(/\/$/, "").split("/").pop(),
        title: decode(c.title),
        category: decode(c.category ?? ""),
        industry: decode(c.industry ?? ""),
        region: decode(c.region ?? ""),
        description: decode(c.description ?? ""),
        image: await downloadImage(img.url) ?? null,
        alt: decode(img.alt ?? ""),
      });
    }
    paged += 1;
  } while (paged <= totalPages);
  return records;
}

/** The three `<select>`s, read off the rendered page so the order matches. */
function parseFilters(main) {
  const read = (id) => {
    const sel = one(main, new RegExp(`<select\\b[^>]*id="${id}"[^>]*>`, "i"));
    return [...(sel?.html ?? "").matchAll(/<option value="([^"]*)"[^>]*>([^<]*)</g)]
      .filter((m) => m[1])
      .map((m) => ({ value: m[1], label: decode(m[2]).trim() }));
  };
  return {
    industry: read("industry-filter"),
    region: read("region-filter"),
    service: read("service-filter"),
  };
}

async function main() {
  await fs.mkdir(IMG_DIR, { recursive: true });

  process.stdout.write("Index (admin-ajax)… ");
  const cards = await fetchIndex();
  console.log(`${cards.length} case studies`);

  process.stdout.write("Listing page… ");
  const listMain = normalise(mainOf(await fetchText(`${SITE}/case-studies/`)));
  const listSections = sectionsOf(listMain);
  const listHeroImg = firstImg(listSections[0].html);
  const listSec = listSections.find((s) => /casestudy-list/.test(s.attrs));
  const uspSec = listSections.find((s) => /usp-list/.test(s.attrs));
  const teSec = listSections.find((s) => /carousel-testimonial/.test(s.attrs));
  const ctaSec = listSections.find((s) => /dark-cta/.test(s.attrs));

  const usp = parseUspList(uspSec);
  usp.icon = (await downloadImage(usp.icon)) ?? usp.icon;
  usp.image = (await downloadImage(usp.image)) ?? usp.image;
  const testimonials = parseTestimonials(teSec);
  for (const t of testimonials.items) t.avatar = (await downloadImage(t.avatar)) ?? t.avatar;

  const index = {
    hero: {
      heading: text(one(listSections[0].html, /<h[12]\b[^>]*>/i)?.html ?? ""),
      intro: text(one(listSections[0].html, /<p\b[^>]*>/i)?.html ?? ""),
      image: await downloadImage(attr(listHeroImg, "src")),
      imageAlt: attr(listHeroImg, "alt") ?? "",
    },
    list: {
      tag: text(one(listSec.html, TAG_RE)?.html ?? ""),
      heading: text(one(listSec.html, /<h2\b[^>]*>/i)?.html ?? ""),
      perPage: PER_PAGE,
      filters: parseFilters(listMain),
    },
    usp,
    testimonials,
    cta: parseCta(ctaSec),
    cards,
  };
  console.log("ok");

  process.stdout.write("Detail pages… ");
  const pages = {};
  for (const card of cards) {
    const html = await fetchText(`${SITE}/case-study/${card.slug}/`);
    const secs = sectionsOf(normalise(mainOf(html)));
    if (secs.length !== 5) {
      console.warn(`\n  ! ${card.slug}: ${secs.length} sections, expected 5`);
      continue;
    }
    const [heroSec, simpleSec, articleSec, sliderSec, ctaSec] = secs;
    const hero = parseHero(heroSec);
    for (const m of hero.meta) m.flag = (await downloadImage(m.flag)) ?? m.flag;
    const simple = parseSimpleCards(simpleSec);
    for (const c of simple.cards) c.icon = (await downloadImage(c.icon)) ?? c.icon;
    const slider = parseSlider(sliderSec);
    for (const c of slider.cards) {
      c.image = (await downloadImage(c.image)) ?? c.image;
      c.href = c.href?.replace(`${SITE}`, "") ?? null;
    }
    pages[card.slug] = {
      slug: card.slug,
      title: card.title,
      description: card.description,
      hero,
      simple,
      blocks: await parseArticle(articleSec),
      slider,
      cta: parseCta(ctaSec),
    };
  }
  console.log(`${Object.keys(pages).length}/${cards.length}`);

  await fs.writeFile(path.join(OUT, "case-studies-index.json"), `${JSON.stringify(index, null, 2)}\n`);
  await fs.writeFile(path.join(OUT, "case-study-pages.json"), `${JSON.stringify(pages, null, 2)}\n`);
  console.log("\nWrote case-studies-index.json + case-study-pages.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
