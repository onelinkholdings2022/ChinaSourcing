# `/case-studies` and `/case-study/<slug>` — behaviour bible

Read off the live site: markup from the served HTML, CSS from the LiteSpeed-combined
stylesheet, the filter script from the inline `<script>` on `/case-studies`, and the
Swiper configs straight out of the theme bundle (`main-o3q4ZZaz.js`). Nothing here
is estimated.

## Measuring the original

Two lazy-loaders run on these pages and both distort any measurement taken before
they finish, badly enough to send you chasing differences that are not there:

- **WP Rocket** ships each `<img>` with a 1x1 base64 `src` and the real URL in
  `data-src`. Until it swaps, an image with `width:100%` and no height rule takes
  the placeholder's 1:1 ratio — the article's 1170x762 photos measure **760x760**
  instead of 760x495, which is 530px of phantom height per case study.
- **lozad** handles the icons, which have `data-src` and *no* `src` at all. The
  quote mark and both slider arrows measure 0 until it fires.

Neither triggers on a programmatic `window.scrollTo`. Force them before measuring:

```js
document.querySelectorAll('img[data-src]').forEach(i => { i.src = i.dataset.src; });
```

Every figure below is the settled state.

## Section heights at 1920px

| `/case-studies` | Original | Clone |
| --- | --- | --- |
| hero | 907 | 907 |
| `.casestudy-list` | 2062 | 2062 |
| `.featured-case-studies` | 992 | *removed at the owner's request* |
| `.usp-list` | 1436 | 1436 |
| `.carousel-testimonial` | 698 | 698 |
| `.dark-cta` | 552 | 552 |

| `/case-study/prestige-residential` | Original | Clone |
| --- | --- | --- |
| hero | 608 | 608 |
| `.simple-card` | 842 | 842 |
| article | 2111 | 2111 |
| `.casestudy-slider` | 879 | 878 |
| `.dark-cta` | 468 | 468 |

`tag-apparel` was checked as a second sample: 680 / 890 / 2195 / 879→878 / 468.

The 1px on the slider is the arrow row: the original's `<img>` sits inline inside
an unsized `<button>` and picks up a 1px baseline gap; the clone gives the button
`w-12 h-12` and gets exactly 48.

## `.casestudy-list` — the filter, grid and pager

The section is server-rendered with six cards, and then **thrown away**. The inline
script's last statement is:

```js
fetchCaseStudies({}, 1, false);   // on DOMContentLoaded
```

which POSTs `action=filter_case_studies&posts_per_page=6&paged=1` to
`admin-ajax.php` and replaces `#case-studies-grid`'s `innerHTML` from the JSON. So
the PHP card markup never renders for a visitor. The two templates differ:

| | PHP (never seen) | JS (what renders) |
| --- | --- | --- |
| padding | `p-6 xl:p-10` | `p-6 md:p-8 xl:p-10` |
| direction | `flex lg:flex-row flex-col-reverse sm:flex-row` | `flex flex-col lg:flex-row` |
| hover | `hover:bg-dark-blue-950` | `hover:shadow-lg hover:bg-dark-blue-950` |
| gaps | `gap-4 sm:gap-6` | `gap-4 lg:gap-6` |
| AOS | `data-aos="fade-up"` staggered | **none** |

The clone reproduces the JS template, including the absent fade-up.

**Filtering.** Three `<select>`s whose values are term *slugs*
(`hospitality-items`), while the AJAX payload returns term *names*
(`Hospitality Items`); WordPress resolves between them. Nothing happens on
`change` — only the **Search** button reads the selects. **Reset filters** clears
all three and re-fetches page 1. Both scroll `.casestudy-list .mb-10` into view
with `behavior: 'smooth'`.

**Pagination.** `posts_per_page: 6`, so 14 studies give 3 pages (6 / 6 / 2). The
pager renders only when `total_pages > 1`; the current page is
`bg-dark-blue-900 text-white cursor-default`, the others `text-grey-300`. Clicking
the current page is a no-op; any other page re-fetches *and* scrolls.

Empty result: a single `col-span-2 py-12 text-center` cell reading
"No case studies found matching your criteria."

The clone keeps all 14 records in the bundle and filters locally — same rules, no
request.

## `.carousel-testimonial` — Swiper, and why it does not move

From the bundle:

```js
new Swiper(".testimonial-swiper", {
  loop: true, effect: "slide", slidesPerView: 1, spaceBetween: 24,
  autoplay: { delay: 2500, disableOnInteraction: false }, speed: 1000,
  breakpoints: { 768: { slidesPerView: 2 }, 1280: { slidesPerView: 3 } },
  navigation: { nextEl: ".swiper-button-next-custom-te", prevEl: ".swiper-button-prev-custom-te" },
});
```

There are exactly **three** testimonials. At ≥1280px `slidesPerView` is also 3, so
Swiper marks itself locked: it stamps `swiper-button-lock` (`display:none`) on both
arrows and autoplay never advances. Desktop therefore shows a static three-up row
**48px shorter** than the same section with arrows. Below 1280 the arrows return and
the loop runs. The clone derives the same `locked` flag from
`items.length <= slidesPerView`.

`reachEnd` / `reachBeginning` set `disabled` on the arrows, but under `loop: true`
neither can ever fire, so the arrows are never actually disabled.

The quote mark is `w-8 h-8 lg:w-[60px] lg:h-[60px]` with no `shrink-0`. Once
`quote-2.svg` (intrinsic 100x100) has loaded, `min-width: auto` floors the flex item
at its 60px specified width and the blockquote gets 359px. Before it loads the item
collapses to 49px and the quote reflows one line narrower — a cold-view artefact,
not the design.

## `.casestudy-slider` — the same block in two dressings

```js
new Swiper(".case-study-swiper", {
  slidesPerView: 1, effect: "slide", speed: 1000, spaceBetween: 24,
  breakpoints: { 768: { slidesPerView: 1.5 }, 1280: { slidesPerView: 2 } },
  navigation: { nextEl: ".swiper-button-next-custom", prevEl: ".swiper-button-prev-custom" },
});
```

No loop, no autoplay — the arrows genuinely disable at each end.

| | `/about-us`, `/products`, `/services` | `/case-study/<slug>` |
| --- | --- | --- |
| section | `casestudy-slider spacing` | `+ mb-20 lg:mb-[120px] bg-dark-blue-950` |
| tag | above the heading row | inside the heading column |
| heading | `text-cyan-400`, two lines | `text-white mt-3`, one line |
| button | white / indigo outline | `bg-cyan-400 text-white` |
| card meta | — | optional `font-lora text-dark-blue-400` line |

Cards are per-page ACF picks, five on every case study, and a page may list the
same study twice (`tag-apparel` and `muscle-mat` both repeat Prestige Residential) —
so React keys cannot come from the title.

## The detail-page template

All 14 pages render the identical five-section sequence, wrapped in
`<div class="flex flex-col pb-[120px]">`. That trailing 120px is what separates the
CTA from the footer: `.dark-cta` here is `dark-cta px-5` on every page, without the
`pb-[120px]` the product pages carry.

- **Hero** — `spacing relative overflow-hidden`, two `pattern-*.svg` wedges rotated
  40.692° and pushed half outside so `overflow-hidden` clips them, both
  `hidden md:block`. Centred `h1` + intro, then a `bg-cyan-50` fact box
  (`max-w-[772px] w-full lg:w-4/5`) holding Region / Industry / Service. Only Region
  has a flag image (`w-[30px] h-5`). The third column's label carries a stray `mb-2`
  the other two do not — reproduced.
- **`.simple-card`** — the shared dark grid, but `xl:grid-cols-4` here against the
  `xl:grid-cols-3` About and the service pages use. Four cards, all with the same
  `Icon.png`.
- **Article** — `spacing container max-w-[800px] mx-auto flex flex-col gap-10`. Two
  tag + `<h3 class="heading-2 font-lora">` + `.rich-text` blocks ("What we faced /
  The Challenge", "Our Result / The Solution"), then the share strip.
- **Share strip** — the Heateor plugin: five 24x24 `rounded` chips, each with a 2px
  margin, floated left inside a block that fills the row — so the row's
  `justify-end` has nothing left to move and the chips sit against "Share:". At
  1920 they land at x = 648 / 676 / 704 / 732 / 760 in a 760px row 29px tall. Copy
  Link and More are `preventDefault()` no-ops.

  **All five are grey, not brand colours.** Each anchor carries an inline
  `background-color` in its network's colour (`#ffc112`, `#0765FE`, `#2a2a2a`,
  `#0077b5`, `#ee8e2d`) and every one of them is overridden:

  ```css
  .heateor_sss_horizontal_sharing .heateor_sss_svg {
    color: #fff; border: 0; background: rgb(163,163,163) !important;
  }
  .heateor_sss_horizontal_sharing span.heateor_sss_svg:hover {
    background-color: rgb(15,45,66) !important;
  }
  ```

  So the strip is one `grey-300` row that goes `#0f2d42` on hover, with no
  transition. Trusting the inline attribute here gives five wrong colours.

## `.rich-text`

The article body's type comes entirely from this rule, lifted verbatim from the
live stylesheet into `globals.css`:

- children separated by `margin-top: 1.5rem`
- `h2` / `h3` Lora 600 `#040c19`, on the `heading-2` / `heading-3` steps
- `h4`–`h6` 18px → 20px (1536) → 24px (1920), 600
- `p` / `ul` / `ol` / `li` / `a` / `blockquote` 16px/28 → 18px/28 at 1536
- `img { width: 100%; border-radius: 1.5rem }` — no height rule, so the aspect
  ratio comes from the file
- `blockquote` 2px left border `#040c19`, `padding-left: 1rem`

## Assets

Every image is local. `pattern-left.svg`, `pattern-right.svg`, `quote-2.svg`,
`button-next.svg`, `Icon.png` and the flags were already in `public/images/`; the
scraper added the case-study photography and article inline images.
