# `/resources` and the article template — behaviour bible

Read off the live site: markup from the served HTML, CSS from the
LiteSpeed-combined stylesheet, and the listing/paywall JS straight out of the
theme bundle (`main-o3q4ZZaz.js`). Nothing here is estimated.

Measure the original with the lazy-loaders forced — see
`CASE_STUDY_BEHAVIORS.md` for why and how.

## Section heights at 1920px

| `/resources` | Original | Clone |
| --- | --- | --- |
| hero | 907 | 907 |
| `.featured-resources` | 998 | *removed at the owner's request* |
| `.resource-listing` | 1033 | 1033 |
| `.blog-listing` | 2245 | 2245 |
| `.split-screen` | 818 | 818 |
| `.faq` | 637 | 637 |

| `/canton-fair-…` (gated) | Original | Clone |
| --- | --- | --- |
| hero | 692 | 692 |
| body wrapper | 4383 | 4383 |
| — banner image | 579 | 579 |
| — sidebar + article | 1000 | 1000 |
| — `.resource-form` | 584 | 584 |
| — related row | 1004 | 1004 |
| — `.dark-cta` | 496 | 496 |
| — table-of-contents box | 481 | 481 |

`/resource/incoterms-explained` was checked as a second sample: hero 444, body
3504 against 3503.

Take the `.resource-form` figure only once the HubSpot iframe has settled — it
is 150px tall while loading and 154px after, which is the whole difference
between 580 and 584.

## Both listings are server-rendered in full

`/resources` ships **all 12 resource cards and all 129 blog cards** in the HTML.
The theme's script never fetches: it filters and pages by toggling
`style.display` on nodes that are already there.

```js
const items = [...document.querySelectorAll(".blog-item")];   // 129
const PER_PAGE = 6;                                           // 3 for resources
filtered = () => items.filter(el =>
  type === "all" || el.dataset.types.split(",").includes(type));
show = (list, p) => {
  items.forEach(el => el.style.display = "none");
  list.slice((p - 1) * PER_PAGE, p * PER_PAGE)
      .forEach(el => el.style.display = "flex");
};
```

Two independent instances, identical apart from their selectors and page size:
`#blog-tabs` / `.blog-item` / `.pagination-blog` at 6 per page, and
`#resource-tabs` / `.resource-item` / `.pagination-resource` at 3.

Changing tab resets to page 1. Nothing scrolls — unlike the case-study filter,
which does.

Cards with an empty `data-types` belong to no category and only appear under
"All"; `"".split(",")` yields `[""]`, which matches no tab value.

## The pager

```
total = ceil(list.length / perPage);          // nothing renders below 2
if (innerWidth < 768)  ‹ · p-1 · p · p+1 · ›  // chevrons only where they lead somewhere
else if (total <= 6)   1 2 3 … total
else if (p <= 3)       1 2 3 4 5 … total
else if (p < total-2)  1 … p-1 p p+1 … total
else                   1 … total-4 total-3 total-2 total-1 total
```

The layout is chosen from `window.innerWidth` when the buttons are built, not by
CSS — so it only re-evaluates on the next render. The ellipsis is a
`<span class="px-2">`, not a button.

`.pagination-blog` / `.pagination-resource` set `margin-top: 2.5rem`, but the
element also carries `mt-16`, and the utility wins: **64px, not 40**. That is
24px of section height on each listing.

The two pagers differ in exactly one rule — the current page is indigo-on-white
in the blog band and white-on-indigo in the resource band, matching their
backgrounds.

## The category rails

Drag-to-scroll, wired in Alpine on the scroll container: `mousedown` latches,
`mousemove` pans at **2x** the pointer delta, `mouseup`/`mouseleave` release,
with `cursor-grab` / `active:cursor-grabbing`. The rail is `overflow-x-auto
no-scrollbar` and the track is `w-max mx-auto`, so it centres until it overflows.

```css
.blog-tab-btn      { color: #a3a3a3; border-radius: 8px; transition: .3s }
.blog-tab-btn.active,
.blog-tab-btn:hover{ background: #2e3590; color: #fff }

.resource-tab-btn      { color: #fff; border-radius: 8px }
.resource-tab-btn.active,
.resource-tab-btn:hover{ background: #fff; color: #2e3590 }
```

## The article template — one layout, two post types

`/resource/<slug>` and the root blog posts render the identical PHP template.
Checked across all 141: same five blocks, same three facts, same three related
cards, `dark-cta px-5` on every one.

Note the nesting: the subscribe form, the related row and the dark CTA all sit
**inside** the `container mx-auto spacing flex flex-col` wrapper, so the CTA is
1448px wide rather than bleeding to the viewport edges the way it does on every
other page.

**The banner image is always the fallback.** Every article renders
`resource-detail-fallback.png` at `aspect-[4/3] md:aspect-[5/2] rounded-3xl`,
never its own featured image; the theme hard-codes it. The post's real image is
used on the listing cards instead.

## The paywall

```js
// on DOMContentLoaded
if (localStorage.getItem("onelink_subscribed")) {
  postContentContainer.style.maxHeight = "none";
  contentOverlay.style.display = "none";
  document.querySelector("#subscribe-form").style.display = "none";
}
```

Unsubscribed, `#post-content-container` is capped at `max-h-[600px]
lg:max-h-[1000px]` with `overflow-clip`, and `#content-overlay` — a
`from-white/0 to-white` gradient over the full box — fades the cut edge under
"Please subscribe to see the detail" (24px/32, `dark-blue-900`, pinned to the
bottom). The HubSpot form in `#hubspot-form-container` is a 352x150 cross-origin
iframe and sets the flag on success.

The clone keeps the key and the clamp; its own field sets the flag without
posting anywhere, because otherwise no article could be read.

## The table of contents

Two copies of the same links on every article: the box beside the body, and a
drawer pinned to the left edge of the viewport.

### The inline box

Not sticky — `position: relative`.

- box: `#f2f9fd`, 1px white border, radius 4px, padding `10px 20px 10px 10px`,
  shadow `0 1px 1px rgb(0 0 0 / .05)`
- title row: `display: table`, **34px** tall — the title itself is 27px; the
  height comes from the collapse toggle floated into it at `height: 34px`. The
  visible 1px outline (`#999191`, radius 5px, 35x32) is on the icons' own box,
  not on the button
- title: 19.2px/27.84, weight 500, `#0f2d42`
- links: 15.2px/24.32, weight 500, black, and **`display: inline-flex` with
  `padding: 0 0 6px`** — that foot is 6px on every row
- **entries are numbered.** The number is a `::before` *inside* the link:
  `content: counters(item, ".") ". "`, `display: block`, `flex: 0 0 auto`,
  `margin-right: 0.2em`, inheriting the label's size. Because it is a flex item
  the label wraps beside it with a hanging indent, and Chrome does not carry
  the hover underline into it — so the number stays clean while the label
  underlines. Getting this wrong costs more than the number: without it the
  text column is 12px wider, one entry stops wrapping to a third line, and the
  box comes out 66px short
- hover: `text-decoration: underline` on the label
- the toggle works: 481px collapsed to 56px and back

`getComputedStyle(el, '::before').content` is the only way to read any of this —
the plugin's stylesheet is cross-origin, so `cssRules` enumeration returns
nothing for it while computed styles still resolve.

### The "Index" drawer

A second copy, always reachable. The tab is `position: fixed; left: 0; top: 8%`,
an `inline-grid` of `→` over the word "Index" in `writing-mode: vertical-rl`, on
a white pill rounded only on its right edge (`0 10px 10px 0`), shadow
`1px -5px 10px 5px rgb(0 0 0 / .1)`, `z-index: 999999`.

The drawer slides in from `left: -100%` to `left: 0`, and the two transitions
are deliberately asymmetric — `left .3s linear` opening, `opacity .3s linear,
left .3s cubic-bezier(.4, 0, 1, 1)` closing.

- sidebar: white, `padding: 20px 30px`, `height: 100vh`, `overflow-y: auto`,
  shadow `1px 1px 10px 3px rgb(0 0 0 / .2)`, `width: auto` — it shrink-wraps to
  the longest entry rather than taking a set width
- title bar: absolutely positioned across the top, `padding: 15px`, 1px
  `#e5e5e5` bottom border, `display: table`; title 18px/1.45 weight 600; the
  close `×` is 30px weight 600, floated right at `top: -2px`
- list: `margin-top: 65px` to clear that bar; links 16px/25.6 weight 400, with
  the same numbering rule

Measuring it needs care: the slide is a CSS transition, and a background tab
throttles it, so the panel reads as still off-screen. `el.getAnimations()
.forEach(a => a.finish())` settles it.

## The share strip

Same Heateor block as the case studies, and the same trap — the inline
brand colours are overridden to one grey. See `CASE_STUDY_BEHAVIORS.md`. The
only difference is the wrapper class: the case study writes `justify-end`, the
article pages do not, which changes nothing because the chip group grows to fill
the row either way.
