# Target Website

## URL
https://chinasourcing.co/

## Scope

### Pages Replicated
- [x] Home page (`/`)
- [x] About Us (`/about-us`) — rebuilt as components in `src/components/sections/about/`,
      content in `src/data/about.ts`, behaviour notes in `docs/research/ABOUT_BEHAVIORS.md`.
      All ten sections match the live page's rendered height to the pixel (the
      case-study block is 935 against 936 — one pixel of inline-image baseline).
- [x] Products (`/products`) — 7 sections, every one matching the live page's
      rendered height to the pixel (case-study block 935 v 936).
- [x] All 15 product pages (`/product/<slug>`) — one template, since all 15 render the
      identical six-section sequence. Content in `src/data/content/product-pages.json`,
      types in `src/data/products.ts`. Checked against the live pages for `furniture`
      and `point-of-sale`: 6/6 sections pixel-identical on both.
- [x] Services (`/services`) — 8 sections. 7/8 match the live page's rendered height
      to the pixel; `.vertical-tab` is 14px short because its panel image sizes to
      769x362 against the original's 800x376 — open, and unrelated to deviation 6,
      which is withdrawn.
- [x] All 4 service pages (`/service/<slug>`) — one template, since all four render the
      identical ten-section sequence. Content in `src/data/content/service-pages.json`,
      types in `src/data/services.ts`. Checked against live for `sourcing-service` and
      `freight-logistics`: **10/10 sections pixel-identical on both**.
- [x] Process (`/process`) — 5 sections, **5/5 pixel-identical**. Added no new
      components: the pinned timeline is About's, generalised.
- [x] Contact Us (`/contact-us`) — 3 sections, **3/3 pixel-identical**. Content in
      `src/data/contact.ts`. The original renders a fourth, `.book-meeting-form`
      ("Book your preferred time…"); it is deliberately omitted — see deviation
      24. The "Get In Touch" form is the original's live HubSpot embed —
      deviation 22.
- [x] Case Studies (`/case-studies`) — 5 sections, **5/5 pixel-identical**. The
      original renders a sixth, `.featured-case-studies` ("The Real Story Behind the
      Project"); it is deliberately omitted — see deviation 16.
- [x] All 14 case-study pages (`/case-study/<slug>`) — one template, since all 14
      render the identical five-section sequence. Content in
      `src/data/content/case-study-pages.json`, index in `case-studies-index.json`,
      types in `src/data/case-studies.ts`, behaviour notes in
      `docs/research/CASE_STUDY_BEHAVIORS.md`. Checked against live for
      `prestige-residential` and `tag-apparel`: 5/5 on both, bar 1px on the slider's
      arrow row.
- [x] Resources (`/resources`) — 5 sections, **5/5 pixel-identical**. The original
      renders a sixth, `.featured-resources` ("Most Popular Blogs"); it is
      deliberately omitted — see deviation 19.
- [x] All 141 article pages — the 12 `/resource/<slug>` downloads and the 129 blog
      posts at the site root render the identical template, so there is one
      `ArticlePage`. Content in `src/data/content/article-pages.json`, listings in
      `resources-index.json`, types in `src/data/resources.ts`, behaviour notes in
      `docs/research/RESOURCES_BEHAVIORS.md`. Checked against live for
      `canton-fair-…` and `incoterms-explained`: **every block matches to the
      pixel**, table-of-contents box included.

### Shared section components

Building the product pages pulled several blocks out of the page-specific files, because
the same markup appears on two or three pages with only the copy changed:
`UspList`, `DarkCta`, `LogoStrip`, `CaseStudySlider`, and props on the existing `Faq`
and `Partners`. `ReasonsList`, `AboutCta` and `AboutLogoMarquee` were folded into those
and deleted.

The case-study pages added `CaseStudyList` (filters + grid + pager),
`CarouselTestimonial`, `CaseStudyHero`, `CaseStudyArticle` and `ShareRow`; pulled
About's hero out into the shared `SimpleHero` (`/case-studies` opens with the same
block); gave `SimpleCardGrid` a `columns` prop for its `xl:grid-cols-4` variant; and
turned `CaseStudySlider` prop-driven so its indigo dressing can be reused.

The resources pages added `ResourceListing`, `BlogListing`, `TabRail`,
`ListingPager`, `BlogCard`, `SplitScreenDownload`, `ArticleHero`, `ArticleBody`,
`TableOfContents`, `SubscribeForm` and `RelatedResources`; reused `SimpleHero`,
`Faq`, `DarkCta` and the case-study `ShareRow`; and rewrote `ArticlePage`, which
until now rendered an invented layout rather than the theme's.

The services pages added `SimpleCardGrid`, `VerticalTab`, `ResourceCards`,
`ServiceCards` (list + carousel), `TabbedTestimonial` and `TestimonialCard`, and turned
About's `BrandTabs` into the prop-driven `FlowTrackTabs` — the same `.flow-track` block
appears on About, `/products`, `/services` and every service page, always as the Swiper
variant (no services page has a `.pin-spacer` at runtime).

### Fidelity Level
- [x] **Pixel-perfect** — design tokens, spacing, typography and colors ported 1:1 from the live site's computed styles

### In Scope
- Visual layout and styling
- Component structure and interactions
- Responsive design
- Hard-coded content in `src/data/site.ts`

### Out of Scope (for now)
- Backend / CMS — all content is hard-coded
- Contact forms and the newsletter signup (buttons link to `/contact-us`, no form yet)
- The hero background video (a Vimeo iframe on the original) — the clone uses the video's poster image
- SEO metadata beyond title/description

## Source of the design system

The original is a WordPress site whose theme is already built on Tailwind, so its class names
*are* the spec. Everything below was lifted from the live stylesheet rather than eyeballed
from screenshots:

**Colors** (Tailwind theme in `src/app/globals.css`)

| Token | Value |
| --- | --- |
| `cyan-400` (brand blue) | `rgb(37 107 232)` |
| `cyan-50` | `rgb(232 240 255)` |
| `dark-blue-950` | `rgb(39 48 141)` |
| `dark-blue-900` | `rgb(60 73 160)` |
| `dark-blue-400` | `rgb(164 175 227)` |
| `grey-50` | `rgb(250 250 250)` |
| `grey-400` | `rgb(97 87 127)` |

**Gradients** — `bg-gradient-cyan`, `bg-gradient-tag`, `bg-gradient-header`

**Fonts** — Poppins (body + headings), Lora (blog card meta), both via `next/font/google`

**Typography scale** — `heading-1/2/3`, `body-1/2/3`, `heading-max` with the site's exact
breakpoint steps (768 / 1280 / 1536 / 1920px)

**Container** — fixed tiers at 600 / 728 / 984 / 1140 / 1488px, 20px inline padding

**Section rhythm** — `.spacing` = 40px block padding, 120px at ≥1028px

## Assets
781 files in `public/images/` — service card photography, USP team photos, case-study
images, 42 factory partner logos, blog thumbnails, certification badges, brand logos and the
theme's icon SVGs (redrawn as React components in `src/components/icons.tsx`).

## Known deviations from the original

1. **USP section ("We Simplify Sourcing")** — the pin now matches the original: above 1024px a
   GSAP ScrollTrigger pins the section for `(cards - 1) x (cardHeight + 100)` px and advances one
   card per step; below that it is a prev/next carousel. The only difference is that the card
   track is a plain flex row with a CSS transform instead of a Swiper instance.
2. **Newsletter signup** — the original embeds a HubSpot form. The clone renders the same email
   field and Submit button, but the form does not post anywhere.
3. **Hero background** — the original autoplays a Vimeo iframe behind the scrim. The clone uses
   the same poster image the original shows before the video loads.
4. **Sliders** — the original uses Swiper and Splide. The clone implements the case-study
   carousel and logo marquee natively (CSS transform + keyframes) to avoid the dependencies.

5. **`star-05.png` was stale in the repo.** The copy downloaded for the homepage is a
   *white* star; the site now serves a *blue* one at the same URL, so on About's white
   background the icon was invisible. Replaced with the current file — it also changes
   the homepage USP slider, which uses the same asset, and now matches the live site.

6. ~~**About's case-study arrows are 48x48 here, 1x1 on the original.**~~ **Withdrawn —
   this was a measurement artefact, not a deviation.** Neither
   `.swiper-button-prev-custom` nor its `<img>` carries a size class, so the button
   takes its size from `button-next.svg`; that SVG is lazy-loaded behind a 1x1 base64
   placeholder, and a programmatic scroll does not trigger the loader. Measured
   before it fires, the arrows read 1x1 and the section 888px. Force the swap
   (`document.querySelectorAll('img[data-src]').forEach(i => { i.src = i.dataset.src })`)
   and the original's arrows are 48x49 and the section 936px against the clone's 935.
   The clone was right all along; the 47px gap never existed. See
   `docs/research/CASE_STUDY_BEHAVIORS.md` for how to measure these pages.

7. **Journey rail is stepped from scroll progress, not per-panel triggers.** The original
   creates one ScrollTrigger per panel and flips the class in `onEnter`. All six fire at
   creation while the panels are still stacked, so the rail lights the *last* year while
   the first panel is showing, and a fast scroll skips the crossings entirely. Progress
   is derived from the same range instead, which cannot drift. See the comment in
   `JourneyTimeline.tsx`.

8. **Two arbitrary-variant blockquote classes had to become real CSS.** The theme writes
   `[&>*]:heading-3` (About's founder quote) and `[&>*]:body-2` (the product
   testimonials). Those variants only compile when the utility they name is a registered
   Tailwind utility; here `heading-3` and `body-2` are plain classes in `globals.css`, so
   Tailwind emitted nothing and both fell back to 16px. Left unfixed, the founder quote
   was 288px short and each testimonial 24px short.

9. **The dark CTA's bottom padding is per-page ACF, not a constant.** 14 product pages
   carry `pb-[120px]`; `point-of-sale` carries none. It is captured per page as
   `cta.sectionClass` — hardcoding it made that page 120px too tall.

10. **The page-transition curtain runs the counter only on a fresh load.** The theme
    wraps every page in Barba.js with six indigo columns (`#page-transition-layer`) and
    ends its `leave` hook with `window.location.reload(true)`, so the 0→100% counter
    replays on *every* navigation — about 1.85s of waiting per click. Here the counter
    runs on first load and F5 only; in-app navigation gets the logo and the column wipe
    without it. Column count, colour, durations, stagger and easings are the theme's.

11. **The `/products` hero has a TypeIt line the category pages do not.** "Source " plus
    a cyan Lora span cycling all 15 category names, above the static "All in One Place".
    The words come from a hidden `.content-typeit` list in the markup. Timings are the
    theme's: `speed: 60`, `pause(1500)` after typing, `pause(500)` after deleting, with
    TypeIt's default delete speed of half the type speed. The homepage hero uses the same
    hook at its own documented values (`speed: 30` / 2000 / 1000) — it previously ran at
    invented timings.

12. **Scraped WordPress titles are HTML-encoded.** `Freight &#038; Logistics` was
    reaching `<title>` and article headings verbatim, because those strings are used as
    plain text and nothing decodes them. `decodeEntities()` in `src/lib/content.ts` now
    wraps every such use.

13. **The typography scale had to move into `@layer components`.** `.heading-*` and
    `.body-*` were plain top-level rules, and unlayered CSS beats every layered rule —
    so `.body-2` won against `text-sm`. The theme relies on the opposite: /process
    writes `class="... body-2 text-sm ... leading-snug"` on the timeline intro and
    renders it at 14px/19.25px. Unlayered it came out 18px/28px, which grew the headline
    by 17px, shrank each pinned panel by the same, and left the section 119px short.
    Re-checked afterwards: About and the service pages are unchanged.

14. **The header's shadow is scroll-gated, and the live site has none at all.**
    Measured on the original at every scroll position, on both the homepage and the
    inner pages: `box-shadow: none`, `border-bottom: 0`. The clone previously tied the
    shadow to the same flag that picks the colour treatment, and inner pages force that
    flag on — so they carried a permanent line, including at the very top. The shadow
    now follows scroll position alone, and is a hairline
    (`0 1px 0 rgba(15,23,42,.06)` plus a 12px ambient at .18) rather than Tailwind's
    `shadow`. This is a requested addition, not a fidelity fix: a bar with no edge reads
    as detached once content slides under it.

15. **`Reveal` no longer uses framer-motion.** It is an IntersectionObserver plus a CSS
   transition — which is what AOS itself does. `whileInView` withdraws its target when
   the observer reports a leave, and this page's GSAP pin plus `ScrollTrigger.refresh()`
   can produce an enter/leave in one frame on a jump-scroll, freezing sections near
   0.026 opacity with no way back once `once: true` has detached.

16. **`/case-studies` drops the `.featured-case-studies` band.** "The Real Story
    Behind the Project" — a 2x2 mosaic promoting TAG Apparel, Prestige Residential
    and Muscle Mat — sat between the grid and the USPs and measured 992px. Removed
    at the owner's request; all three studies are already in the grid above it.
    Everything needed to restore it (markup, the `bg-gradient-black` scrim it uses)
    is still in place.

17. **`.container` is now an `@utility`, not a bare class.** It was a top-level
    rule, and unlayered CSS beats every utility — so a width stated on the same
    element was silently ignored. The theme states one in three places:
    `container max-w-[800px]` on the case-study article, `container 2xl:px-0` on
    every `.usp-list`, `container max-w-[860px]` on the blog template. The article
    was rendering 1448px wide instead of 800, with its inline images nearly twice
    their intended size. Moving it into `@layer components` fixed that but then lost
    to Tailwind v4's *own* `.container` utility, which caps at 1536px — 48px wider
    than this site's top tier, on every page. `@utility container` replaces that
    built-in and orders before `max-w-*`, which is exactly how the original's
    Tailwind v3 container behaves. About, `/products` and `/services` were
    re-measured afterwards and are unchanged.

18. **Detail routes moved inside their listing folders.** `app/case-study/[slug]`
    → `app/case-studies/[slug]`, and the same for product/service/resource, so each
    section of the site is one directory. The original's singular URLs are
    unchanged: `next.config.ts` rewrites `/case-study/:slug` onto
    `/case-studies/:slug`, so the address bar, inbound links and the sitemap all
    still resolve to what the original publishes. Both forms return 200.

19. **`/resources` drops the `.featured-resources` band.** "Most Popular Blogs" —
    a 2x2 mosaic promoting three posts — sat between the hero and the downloads and
    measured 998px. Removed at the owner's request; all three are in the blog
    listing below it.

20. ~~**The table-of-contents box is 24px shorter than the original's.**~~
    **Fixed.** The box was missing the numbering the plugin puts before each
    entry — a `::before` inside the link carrying `counters(item, ".") ". "`.
    Beyond the missing digits it cost 12px of text column, which stopped one
    entry wrapping to a third line and left the box 66px short. With the counter
    in place the box measures 481px against the original's 481, row for row. The
    left-edge "Index" drawer the plugin also renders was missing entirely and is
    now built too; see `docs/research/RESOURCES_BEHAVIORS.md`.

21. **The article paywall is reproduced, and the form now sets the flag.** The
    theme clamps `#post-content-container` to `max-h-[600px] lg:max-h-[1000px]`
    behind a white gradient reading "Please subscribe to see the detail", and lifts
    it when `localStorage.onelink_subscribed` is set — which its HubSpot iframe
    does on submit. The clone keeps the same key and the same clamp, and its own
    email field sets the flag rather than posting anywhere (deviation 2 applies to
    the form itself). Without that the article could never be read.

22. **`/contact-us` embeds the real HubSpot form.** "Get In Touch" is the
    original's own embed — same portal (`46681098`), same form id — so it
    actually submits. A deliberate exception to deviation 2, taken at the
    owner's request; the page loads `js.hsforms.net` and sends what a visitor
    types to HubSpot, which no other page in the clone does. The booking
    calendar was to be embedded on the same basis (a rebuilt one showing
    invented slots would look right and quietly waste a visitor's time) but the
    band was then dropped entirely — see deviation 24 — so
    `static.hsappstatic.net` is no longer loaded.

    Three different forms are in play and they are easy to confuse:
    `216cfe97…` is the contact form (also the header dialog's), `e30221f0…` the
    footer newsletter, `bed6a08e…` the article paywall's. The last is the only
    one still rebuilt by hand rather than embedded.

23. **Tailwind v4 moved the important marker, and changed what `space-y-*` sets.**
    The theme's contact column is `space-y-10` with `!mt-3` / `!mt-3` /
    `lg:!mt-20` overriding every gap it creates — so on the original the spacing
    utility does nothing. Ported literally it does the opposite: v4 wants the `!`
    at the end (`mt-3!`), and its `space-y-*` sets `margin-bottom` where v3 set
    `margin-top`, so the two margins collapse to the larger instead of the child
    replacing the parent. Left as written the column came out 56px too tall. The
    fix was to drop `space-y-10` and keep the plain `mt-*` the original resolves
    to. Worth remembering for any other block that pairs `space-y-*` with `!mt-*`.

24. **`/contact-us` drops the `.book-meeting-form` band.** "Book your preferred
    time here and let's get started!" — the tag, heading, intro and the 800x715
    HubSpot Meetings calendar — sat between the hero and the contact details and
    measured 1237px. Removed at the owner's request; visitors reach the team
    through the "Get In Touch" form instead. `BookMeeting` and `HubspotMeetings`
    stay in `src/components/sections/contact/`, and its copy stays in
    `contact.ts`, so restoring the band is one element in `page.tsx`.

## Customization Plans
None yet — pure emulation. Content lives in `src/data/site.ts`, so copy changes are one-file edits.
