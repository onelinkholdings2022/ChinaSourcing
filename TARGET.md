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
- [x] Services (`/services`) — 8 sections, **8/8 pixel-identical** (bar the 1px on
      the case-study slider's arrow row, deviation 6). The earlier note that
      `.vertical-tab` was 14px short is **withdrawn**: measured against the live
      page it is 965 on both, and the 800x376 reading came from measuring the
      original immediately after force-swapping its lazy images, before layout
      settled.
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
- [x] Privacy Policy (`/privacy-policy`) — 1 section (`.text-block`), **khớp
      từng pixel ở cả 6 bề rộng đã đo**. Nội dung từ Single Type
      `privacy-policy-page` bên strapi-cns. Xem deviation 49.
- [x] Trang lọc — không phải trang riêng của site gốc, là bản cắt lát của một
      trang listing với đúng một bộ lọc mở sẵn (xem deviation 46):
      10 category blog (`app/categories/[slug]`) và 12 blog post ở
      `/resources`; 3 partner category (`app/partner-categories/[slug]`) render
      thân `/products`; 4 loại download (`app/resource-types/[slug]`) render
      thân `/resources`. Tất cả đều trả 200 và có trong sitemap.

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
2. ~~**Newsletter signup** — the original embeds a HubSpot form. The clone renders the same email
   field and Submit button, but the form does not post anywhere.~~ **Đã khắc phục —
   footer giờ nhúng đúng form HubSpot của site gốc** (portal `46681098`, form
   `e30221f0-7060-4147-9b7b-4dc9593f7828`, region `na1`), nên đăng ký nhận tin
   thật sự về HubSpot. Cấu hình đọc từ CMS (`global.footer.newsletterForm`, field
   đã có sẵn dữ liệu) với env `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` /
   `NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID` / `NEXT_PUBLIC_HUBSPOT_REGION` làm lưới
   đỡ; không có cả hai thì `Footer` lùi về `<form>` tĩnh cũ. `unlocksContent` bật
   theo đúng `onFormSubmitted` của theme — đăng ký nhận tin LÀ chỗ dỡ paywall bài
   viết (deviation 21/45). Vẫn còn tự dựng: form email dưới bài (`SubscribeForm`,
   `bed6a08e…`). Cùng ngoại lệ với deviation 22: trang nào có footer cũng nạp
   `js.hsforms.net` — tức mọi trang.
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

25. **Rich text ảnh của case study lưu đường dẫn TƯƠNG ĐỐI `/uploads/...`.**
    11/14 case study trước đây trống hoàn toàn phần thân trang (không có
    `region`/`industry`, khối "What We Do", "The Challenge"/"The Solution").
    Nội dung được đẩy lên Strapi từ bản scrape trang gốc
    (`strapi-cns/scripts/fix-case-study-content.js` +
    `case-study-content-data.json`), và ảnh minh hoạ trong rich text được upload
    vào Media Library. `src` lưu ở dạng `/uploads/…` chứ không phải URL tuyệt
    đối, để cùng một bản ghi chạy được ở cả local lẫn production;
    `resolveContentMedia()` trong `src/lib/views/textUtils.ts` ghép
    `NEXT_PUBLIC_STRAPI_URL` vào ngay trước khi render. (Nội dung blog-post scrape
    từ WordPress vẫn giữ URL tuyệt đối `chinasourcing.co` như trước.)

26. **Khối `.resource-card` trộn cả `resource` lẫn blog post.**
    "Our Resources" trên `/services` là 3 **blog post**, còn trên trang service
    detail là 2 resource + 1 blog post — quan hệ `featuredResources` của
    `sections.featured-resources` chỉ trỏ được tới `resource`, nên đã thêm quan hệ
    `featuredBlogPosts` (xem `scripts/fix-resource-cards.js`). Thứ tự render là
    resource trước, blog post sau, đúng như trang gốc.

27. **Theme cắt mọi excerpt trên thẻ bài về 150 ký tự.**
    `wp_html_excerpt($text, 150, '...')`: cắt ở 150 ký tự, lùi về khoảng trắng
    gần nhất, nối "...". `.resource-card` không có `line-clamp` nên nếu không cắt
    thẻ cao dư tới 120px; `.blog-card` có `line-clamp-4` nhưng vẫn lệch 24px vì
    excerpt đầy đủ chiếm 4 dòng thay vì 3. `trimExcerpt()` trong `textUtils.ts`.

28. **Câu trả lời FAQ phải giữ ngắt đoạn.** Theme render `<p>` thành
    `văn bản<br><br>văn bản`; `stripHtml()` gộp mọi khoảng trắng nên dòng trống
    biến mất và panel đang mở thấp đi đúng 24px. `stripHtmlKeepBreaks()` giữ lại
    ngắt dòng, và `Faq` vốn đã có `whitespace-pre-line`.

29. **Phân trang listing là hằng số của theme, không phải field CMS.**
    `main-*.js` phân trang client-side với `n = 6` cho `.blog-item` và `n = 3`
    cho `.resource-item`. `resources-page.insights.pageSize` đã chỉnh về 6;
    số 3 của resource listing nằm trong `resourceView.ts` vì CMS không có field
    tương ứng.

30. **9 blog post và cả 12 resource không có featured image trên site gốc.**
    Thẻ `.blog-card` của theme bỏ hẳn `<img>` khi bài không có ảnh (không hiện
    ảnh thay thế), nên `buildInsightsView` trong `resourceView.ts` trả `null` chứ
    không fallback. Resource thì ngược lại: khối `.resource-card` fallback về
    `blog-fallback.png` của theme — ảnh đó đã được upload lên Strapi và gán cho
    cả 12 resource. `resource.publishedDate` cũng là field mới: trước đây thẻ in
    `publishedAt` của Strapi (ngày seed) thay vì ngày đăng thật.

31. ~~**`SimpleCardGrid` trên trang case study từng đặt `xl:grid-cols-4`.**~~
    **RÚT LẠI — đo lại từ markup thật thì bản gốc ĐÚNG LÀ 4 cột ở trang case
    study.** `xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2` trên cả
    `tag-apparel`, `prestige-residential` và `muscle-mat`; About (3 thẻ) và
    trang service (5 thẻ) mới là `xl:grid-cols-3`. Tức số cột là của TỪNG KHỐI,
    không suy ra từ số thẻ. Ép 3 cột ở trang case study đẩy 4 highlight xuống 2
    hàng và làm `.simple-card` **cao dư 216px** ở 1280/1512 — đúng chiều ngược
    lại với ghi chú cũ. `SimpleCardGrid` nhận lại prop `columns` (3 mặc định),
    `app/case-studies/[slug]` truyền `4`. Header của khối vẫn canh giữa như
    About, chỉ trang service canh trái — phần đó của ghi chú cũ vẫn đúng.

32. **`.dark-cta` có `pb-[120px]` ở hầu hết trang.** `/products`, `/services`,
    trang service detail và `/case-studies` đều thiếu 120px đệm dưới. Ngoại lệ
    thật sự chỉ có trang case study detail và trang bài viết (không có `pb`), và
    `point-of-sale` trong số 15 trang product — xem
    `PRODUCTS_WITHOUT_CTA_PADDING` trong `productView.ts`.

33. **Ảnh Media Library còn thiếu hàng loạt, đã lấp toàn bộ.**
    `strapi-cns/scripts/fix-media-gaps.js` + `media-gaps-data.json`: ảnh 6 bước
    "How We Source", 5 tab "Explore by Category", icon `cube-01.svg` của
    offerings, 25 ảnh flow-track của 4 trang service, sao `star-05` (xanh) cho
    `/process` + `/case-studies` và `star-05-1` (navy) cho trang service, ảnh
    "Why Choose Us" trên trang chủ, icon mạng xã hội + 4 ảnh "What Happens Next"
    của `/contact-us`, `Ship.png` cho timeline `/process`. Hai ảnh SAI cũng được
    thay: `service.cardImage` đang là bản thumbnail 300x168 (vỡ hạt khi phóng lên
    ~700px trong "Our Core Services") và `testimonial.image` đang là bản 300x204
    trong khi thẻ rộng 448px — cả hai giờ dùng đúng bản gốc mà srcset của site
    gốc phục vụ. `media-lib.js` cũng thôi rasterize SVG.

34. **Ảnh testimonial trước đây không render.**
    `buildProductTestimonialView` và `buildServiceTestimonialsView` đều hardcode
    `image: null`, nên `.two-column-testimonial` (15 trang product) và
    `.tabbed-testimonial` (4 trang service) mất hẳn tấm ảnh 5/4 grayscale phía
    trên trích dẫn — riêng khối tabbed thấp đi 358px.

35. **Smooth scroll là phần thêm theo yêu cầu, bản gốc KHÔNG có.** Đo trên
    chinasourcing.co: không có Lenis, không có ScrollSmoother, `scroll-behavior`
    là `auto` — cuộn hoàn toàn native. Clone chạy Lenis trong `SmoothScroll.tsx`.
    Cấu hình đã đổi từ `duration: 1.15` + easing expo-out sang `lerp: 0.12`: mỗi
    nấc lăn chuột trước đây khởi động lại một tween 1,15 giây nên trang còn trôi
    hơn một giây sau khi ngừng thao tác, cảm giác là *lag* chứ không phải mượt.
    Riêng `/contact-us` tệ hơn các trang khác vì form HubSpot là iframe khác
    origin (deviation 22): con trỏ đặt trên iframe thì sự kiện `wheel` đi vào
    tài liệu của iframe, trình duyệt cuộn native, Lenis chỉ biết sau đó qua sự
    kiện `scroll` rồi đồng bộ lại — animation của nó càng dài thì hai vị trí
    càng lệch. Lerp ngắn làm hai kiểu cuộn gần như không phân biệt được. Cuộn
    ngay trên form vẫn là native và không sửa được từ phía trang cha.

36. **`api::category` thiếu component `shared.seo`.** Đây là content type duy
    nhất có nội dung riêng mà không có `seo`; 13 type còn lại đã có, và những
    type không có (`*-setting`, `global`, `contact-dialog`, `partner`,
    `partner-category`, `team-member`, `testimonial`) đều chỉ là cấu hình hoặc
    thực thể nhúng nên đúng là không cần. Đã thêm vào `schema.json` và điền
    `metaTitle`/`metaDescription`/`keywords` cho cả 10 category
    (`strapi-cns/scripts/fix-category-seo.js`). Nội dung tự viết theo đúng
    những bài đang thuộc từng category, không bê từ site gốc: chinasourcing.co
    dùng Rank Math và loại category archive khỏi sitemap, danh sách category
    WordPress bên đó cũng khác hẳn (chỉ 4/10 slug tồn tại). `canonicalURL` và
    `shareImage` để trống vì clone chưa có route `/category/<slug>` — tab lọc
    trên `/resources` là client-side thuần, không đổi URL.

37. **URL phẳng: mọi trang chi tiết ở `/<slug>`.** Bản gốc phát hành
    `/case-study/<slug>`, `/product/<slug>`, `/service/<slug>`,
    `/resource/<slug>` và blog ở gốc. Theo yêu cầu, tất cả giờ nằm ở gốc —
    giống OlcoMain. Các thư mục route (`app/services/[slug]`…) chỉ còn là đường
    dẫn NỘI BỘ, đích rewrite của `src/proxy.ts`; mọi dạng có tiền tố, cả số ít
    lẫn số nhiều, đều **301** về bản phẳng, nên link cũ ngoài internet không mất
    tín hiệu SEO. `/category/<slug>` cũng nằm trong danh sách tiền tố cũ:
    WordPress bên site gốc có trang archive thật ở đó, 4 URL đang trả 200.
    Deviation 18 (rewrite trong `next.config.ts`) bị thay thế.

    Thứ tự ưu tiên khi hai loại cùng mang một slug:
    `service > product > case-study > resource > category > blog-post`
    (`SLUG_KINDS` trong `src/lib/routing/routeSlugs.ts`). Hiện có đúng **một**
    va chạm: `freight-logistics` vừa là service vừa là category blog. Service
    thắng vì đó là trang bán hàng; category bị che lùi về
    `/resources?category=freight-logistics` — tính bằng `categoryHref()`, không
    hardcode slug nào, nên hết va chạm là tự thành phẳng lại.

38. **Category có URL riêng, và bộ lọc điều hướng bằng URL.** Rail category của
    `.blog-listing` không còn là nút lọc client-side: mỗi pill là một `<Link>`
    tới `/<category-slug>`, nên chọn mục nào thì thanh địa chỉ hiện đúng mục đó
    và trang chia sẻ/bookmark được. Route nội bộ `app/categories/[slug]` render
    lại đúng thân `/resources` (`src/components/ResourcesPage.tsx`) với category
    đó mở sẵn — cùng bố cục, vì lọc không phải là sang trang khác.

    ~~Tab của `.resource-listing` thì vẫn là nút: chúng là *loại* resource
    (Checklist/eBook/…), không phải category, và không có trang riêng.~~
    **Không còn đúng** — loại resource giờ cũng có URL riêng, và rail ngành nhà
    máy cũng vậy. Xem deviation 46.

39. **404 → trang chủ, hai tầng.** `src/proxy.ts` bắt gần hết: một segment ở gốc
    không có trong bảng phân giải là chuyển hướng ngay — **301** khi đã đọc được
    bảng (404 xác định), **307** khi chưa đọc được (đang mù), cả hai kèm
    `Cache-Control: no-store` để một slug hôm nay chưa có mà mai có thì trình
    duyệt không nhớ chết bản 301. `src/app/not-found.tsx` là lưới đỡ cho phần
    lọt qua (308). Năm trang chi tiết đổi `notFound()` → `permanentRedirect("/")`.

40. **SEO đọc trọn `shared.seo`, không còn chuỗi ghi cứng.**
    `src/lib/seo/metadata.ts` dùng cả sáu field: `metaTitle`, `metaDescription`,
    `keywords`, `shareImage` (→ og:image + twitter:image), `canonicalURL` và
    `structuredData` (→ JSON-LD). Ba tầng: `seo` của trang → `global.defaultSeo`
    → fallback dựng TỪ NỘI DUNG CMS (heading của hero, tiêu đề bài, excerpt) chứ
    không phải chuỗi trong code. Trước đây `layout.tsx` giữ một cặp
    title/description ghi cứng và `buildPageMetadata` nối `"| China Sourcing Co"`
    vào một nhãn viết tay cho mỗi trang; giờ layout chỉ còn `metadataBase`.
    Canonical mặc định là URL phẳng của chính trang. `sitemap.ts` và `robots.ts`
    dựng từ cùng bảng slug mà proxy dùng, nên sitemap không bao giờ khai một URL
    mà proxy sẽ 301 đi chỗ khác.

    Dữ liệu SEO đã được đổ đầy — xem deviation 43.

41. **Favicon là logo "CH", bọc PNG trong SVG.** `src/app/icon.svg` (viewBox
    512, nền trong suốt, PNG đã crop theo bbox mực và hạ xuống 496px nhúng
    base64), kèm `favicon.ico` (16/32/48/64) cho client cũ và `apple-icon.png`
    180x180 nền trắng — iOS ghép nền đen cho ảnh trong suốt. Nguồn:
    `Logo_China Sourcing-06.png`, 3750x2203, một màu `rgb(46 54 143)`. Vì là
    raster nhúng nên nó KHÔNG đổi màu theo dark mode; muốn vector thật (và file
    ~2KB thay vì 17KB) thì cần bản AI/EPS gốc.

42. **`applyDeepPopulate` giờ tôn trọng `fields`.** Controller Strapi gắn deep
    populate cho mọi `find` và chỉ bỏ qua khi query đã có `populate`, nên
    `?fields[0]=slug` một mình vẫn trả nguyên cây: 131 blog post ra **25MB**,
    vượt trần 2MB/entry của Next Data Cache nên mỗi lượt render tải lại từ đầu.
    `CategoryRepository` dính nặng nhất (2,3MB cho 10 category, vì populate
    ngược `blogPosts` kéo theo `content`). Đã sửa cả hai đầu: bên CMS bỏ qua deep
    populate khi có `fields`, bên frontend truy vấn kèm `populate=` rỗng (chạy
    được với cả bản CMS cũ).

43. **SEO của CMS đã đổ đầy cho toàn bộ nội dung.**
    `strapi-cns/scripts/import-seo.js` + `seo-import-data.json`:
    `global.defaultSeo`, 8 single type trang, 15 product, 4 service, 14 case
    study, 12 resource, 131 blog post. Nguồn là bản cào `<title>` +
    `<meta description>` của chính chinasourcing.co (Rank Math), 180/184 URL trả
    200 — 4 URL 404 là resource site gốc chưa từng đăng.

    **Không bê nguyên phần mô tả.** Site gốc để nguyên mặc định của Rank Math
    cho từng post type ở hầu hết trang chi tiết, kể cả lỗi chính tả:
    `"This is the meta descrtiption for the Products"` (15/15 product),
    `"…for the Services"` (4/4), `"…for the Resources"` (8/8),
    `"Dummy case study 6"` (14/14 case study),
    `"This is the default meta description for the Posts"` (68/131 blog).
    108/180 mô tả là placeholder như vậy và đã bị loại; script suy mô tả từ nội
    dung thật của bản ghi (heroDescription / cardDescription / description /
    excerpt / đoạn đầu bài, cắt ở 155 ký tự tại khoảng trắng). 72 mô tả THẬT —
    8 trang, 63 blog post, 1 product — giữ nguyên văn. `<title>` thì lấy hết:
    180/180 đều là chuỗi thật.

    Kết quả cuối: **185 bản ghi**, `metaTitle` + `metaDescription` đầy đủ 100%
    ở cả 8 single type, `global.defaultSeo`, và 7 collection (15 product,
    4 service, 14 case study, 12 resource, 132 blog post, 10 category,
    7 partner-category).

    `shareImage` để trống có chủ đích: `og:image` của site gốc trỏ vào uploads
    WordPress, ảnh đó không có trong Media Library, và `buildMetadata` đã tự lùi
    về ảnh của chính bản ghi. `keywords` cũng trống — site gốc không phát
    `<meta name="keywords">` ở đâu cả. `canonicalURL` do frontend dựng.

44. **Rail category đổi URL nhưng KHÔNG rời trang.** Bấm một pill trên
    `.blog-listing` không phải một lượt điều hướng: bộ lọc chạy tại chỗ và URL
    được thay bằng `history.pushState`. Không fetch lại, không render lại từ
    server, không rèm chuyển trang, hero đứng yên. Gõ thẳng `/<category-slug>`
    thì server vẫn render đúng category đó, và `popstate` đồng bộ ngược để
    Back/Forward vẫn khớp.

    Ba chỗ phải khớp nhau mới ra được hành vi này:
    • Pill vẫn là thẻ `<a href>` (bot thu thập được, Cmd-click mở tab mới được)
      nhưng `onClick` chặn default. Dùng `<a>` thường chứ không phải `next/link`
      — Link prefetch rồi `router.push`, mà ở đây không có lượt điều hướng nào.
    • `data-no-transition` để `PageTransition` bỏ qua: nó nghe ở pha CAPTURE
      trên document nên phần tử không tự rút lui được.
    • `PageTransition` chỉ vén rèm khi CHÍNH nó vừa kéo rèm (`leaving`).
      `usePathname()` đổi giá trị với mọi thứ chạm vào history, kể cả
      `pushState`, nên không chốt thì mỗi cú bấm lọc đều `resetScroll()` +
      `reveal()` — trang nhảy về đầu và rèm quét qua, tức trông y hệt vừa tải
      lại trang. Nút Back/Forward cũng vào nhánh đó, và ở đấy trình duyệt tự
      khôi phục vị trí cuộn nên `resetScroll()` cũng sai.

45. **Form liên hệ không còn mở khoá bài viết.** Theme gốc cho MỌI form set
    `localStorage.onelink_subscribed` — cùng cờ dỡ paywall (deviation 21), nên
    chỉ cần gửi một câu hỏi qua "Get In Touch" là đọc miễn phí toàn bộ blog,
    vĩnh viễn, trên máy đó. Đó cũng là lý do chính chủ site thử form xong rồi
    không bao giờ thấy paywall của mình nữa. Xin báo giá không phải đăng ký
    nhận nội dung, nên `HubspotForm` mặc định không set cờ; chỗ mở khoá đúng
    nghĩa là form email dưới bài (`SubscribeForm`). Trả lại hành vi theme bằng
    prop `unlocksContent`.

    Trạng thái gate hiện tại: **132/132 blog post `gated: true`**, 12 resource
    `gated: false` — tức đúng "mọi bài trừ khối Free Resources đều bị gate".

46. **Loại download và ngành nhà máy cũng có URL riêng.** Theo yêu cầu, hai rail
    còn lại được đưa về đúng hợp đồng của rail category blog (deviation 44):
    mỗi mục một URL phẳng `/<slug>`, bấm thì lọc TẠI CHỖ và URL đổi bằng
    `history.pushState` — không rời trang, không rèm chuyển trang.

    • **`.resource-listing`** ("Free Resources — Everything You Need to Source
      Smarter"). Bốn tab trước đây lấy từ enum `resource.resourceType`; enum
      không có slug, không có bản ghi, không có chỗ nhập SEO, nên không thể cho
      mỗi loại một URL. Đã dựng collection `resource-type` bên CMS
      (`strapi-cns/scripts/seed-resource-types.js`, kèm quan hệ `resource.type`
      và SEO cho cả bốn) — `/checklists`, `/ebook`, `/others`, `/templates`,
      route nội bộ `app/resource-types/[slug]` render lại thân `/resources`.
      Enum CŨ được giữ nguyên làm lưới đỡ: `buildFreeResourcesView` lùi về nó
      khi `resource.type` trống.

    • **`Partners`** (dải logo nhà máy, có trên trang chủ và `/products`). Bảy
      partner category đã có sẵn slug + SEO bên CMS. Route nội bộ
      `app/partner-categories/[slug]` render lại thân `/products`
      (`src/components/ProductsPage.tsx`, tách ra từ `app/products/page.tsx`
      đúng như `ResourcesPage.tsx` đã tách trước đó). Thứ tự tab giờ đọc field
      `order` của CMS thay vì mảng bảy tên ghi cứng trong `homeView` — mảng cũ
      nghĩa là đổi tên một category bên CMS thì tab đó biến mất khỏi trang.

    **4/7 slug partner category trùng với một trang product** —
    `point-of-sale`, `gym-fitness`, `hospitality-items`,
    `household-appliances`. Không gỡ va chạm: đó là CÙNG một ngành, nên
    `/point-of-sale` để trang product nhận (`SLUG_KINDS` xếp `partner-category`
    sau `product`) và chỉ ba slug còn lại đi vào `app/partner-categories/[slug]`.
    Hệ quả cần biết: F5 tại một trong bốn URL đó ra trang sản phẩm chứ không
    phải dải logo. Sitemap khai mỗi slug đúng một lần nên không có URL trùng.

47. **Ba rail lọc dùng chung `useUrlFilter`.** Logic "URL đổi nhưng không rời
    trang" giờ nằm ở `src/hooks/useUrlFilter.ts` thay vì chép ba lần. Hook giữ
    ba chốt, cả ba đều đã cắn thật khi làm deviation 46:

    • **Hai rail dùng chung một segment đường dẫn.** `/resources` có cả rail
      category lẫn rail loại download, mà path chỉ có một chỗ. Bấm category đẩy
      URL thành `/manufacturing`; rail kia cũng nghe `popstate` và cũng đọc
      segment đó, nên không chốt thì nó lọc theo một loại không tồn tại và lưới
      của nó trống trơn. Chỉ nhận slug có trong rail của chính mình.
    • **Bấm lại pill đang mở.** Không đổi gì mà vẫn `pushState` thì trên trang
      chủ thanh địa chỉ nhảy từ `/` sang `/furniture-interior`, và Back sau đó
      là một nấc lịch sử rác.
    • **Pill "All" của rail này xoá bộ lọc của rail kia.** "All" trỏ về
      `/resources`. Đang ở `/manufacturing` mà bấm "All" bên Free Resources thì
      URL về `/resources` trong khi lưới bài vẫn đang lọc — thanh địa chỉ nói
      dối. Nên "All" chỉ đẩy URL khi đường dẫn hiện tại đúng là của rail này.

48. **Content type mới không tự có quyền đọc Public.** Sau khi strapi-cns được
    deploy, `/api/resource-types` đổi từ 404 sang **403**: route đã tồn tại
    nhưng role Public chưa được cấp `find`/`findOne`, nên frontend log
    `[StrapiClient] 403 Forbidden` ở MỌI lượt render — `getRouteSlugs` gọi
    endpoint này trên mọi trang. Cấp bằng
    `strapi-cns/scripts/open-resource-type-permission.js`;
    `api::resource-type.resource-type` cũng đã được thêm vào `PUBLIC_TYPES`
    của `seed.js` để một lượt seed lại không làm mất quyền.

    Cần nhớ cho mọi content type dựng sau này: seed dữ liệu xong chưa phải là
    xong. Bốn URL `/checklists`, `/ebook`, `/others`, `/templates` giờ trả 200
    và đã có mặt trong sitemap.

    Nhánh lùi trong code thì vẫn giữ, và không phải là mã chết: nó đúng cho
    khoảng thời gian giữa lúc frontend deploy và lúc CMS deploy. Khi
    `/api/resource-types` không đọc được, `getRouteSlugs` trả mảng rỗng,
    `filterTabHref` trả `undefined`, `TabRail` render pill thành `<button>` và
    `buildFreeResourcesView` lùi về enum — rail chạy y như trước, không link gãy.

49. **`/privacy-policy` — trang thứ 13, dựng đầy đủ qua CMS.** Trang duy nhất
    của site chạy khuôn `.text-block`: `container max-w-[800px]`, một `<h1>`,
    một đoạn dẫn canh giữa, rồi lặp `<h3>` + thân bài `.rich-text`. Không hero,
    không CTA; link vào nó nằm ở đáy footer (link đó đã có sẵn từ trước, chỉ là
    trước đây proxy đá nó về trang chủ).

    Bên CMS: Single Type `privacy-policy-page` (`seo`, `title`, `intro`,
    `sections` — repeatable `legal.text-section` gồm `heading` + CKEditor
    `body`). Seed bằng `strapi-cns/scripts/seed-privacy-policy.js`, nội dung bóc
    bằng script từ trang render thật vào `scripts/privacy-policy-content.json`.
    Script cũng tự mở quyền `find` cho role Public — xem deviation 48, content
    type mới không tự có quyền đó.

    **Nội dung giữ nguyên văn, kể cả phần còn dở của bản gốc.** 5 mục, và bản
    gốc đang để copy mẫu ở gần hết: 11/12 đoạn là "Short description about what
    this service will offer for clients and customers etc." lặp ba lần, một
    đoạn là lorem. Heading "How do we use your information?" xuất hiện HAI lần.
    `metaDescription` cũng là mặc định Rank Math kèm lỗi chính tả
    ("descrtiption") — đây là bản clone nên không tự sửa, nhưng cần chủ site
    viết lại nội dung thật trước khi trang này có ý nghĩa pháp lý.

    Đo lại: `.text-block` khớp bản gốc **từng pixel ở cả 6 bề rộng**
    (320/390/768/1024/1280/1512), không lệch khối nào.

50. **Header của trang trong là `sticky`, không phải `fixed`.** Đây là khác biệt
    ảnh hưởng MỌI trang. Site gốc phân biệt theo trang:
    trang chủ `fixed lg:top-8 top-3` (viên thuốc nổi trên hero tối), trang trong
    `sticky top-0 bg-gradient-header` — tức header NẰM TRONG DÒNG và chiếm 82px
    chiều cao (88px ở mobile). Bản clone trước đây `fixed` ở cả hai rồi bù bằng
    `pt-28 lg:pt-32` trên `<main>`; 112/128px đó lớn hơn header thật, nên mọi
    trang trong bắt đầu thấp hơn bản gốc 30px (mobile) tới 46px (desktop) và
    tài liệu dài thêm đúng chừng ấy ở mọi bề rộng. `Header` giờ chọn `position`
    theo chính prop `solid`, và cả 11 chỗ `pt-28 lg:pt-32` đã bỏ.
    `sticky` chạy được vì `<body>` là `overflow-x: clip` chứ không phải
    `hidden` — `clip` không tạo scroll container.

51. **Tailwind v4 hiểu `min-w-<phân số>`, v3 thì không.** Theme viết
    `lg:min-w-5/12 2xl:min-w-1/3` trên cột trái của `.faq`, nhưng thang
    `min-width` của v3 không có phân số nên hai lớp đó **không sinh CSS nào**
    bên site gốc. Chép nguyên văn sang v4 thì chúng có tác dụng thật: hai cột
    `w-5/12` + `w-7/12` cộng `gap-10` rộng hơn hàng 39px, bình thường co lại
    theo tỉ lệ (377 / 527 ở 1024px), có min-width thì cột trái không co được và
    thành 393 / 511 — cột FAQ hẹp đi 16px, một câu trả lời xuống thêm dòng, cả
    section cao dư 28-56px trên trang chủ, `/process` và 15 trang product. Đã bỏ
    hẳn hai lớp. (Cùng họ với deviation 23.)

52. **`display: contents` làm vô hiệu `min-h-*` của dòng TypeIt.** Khối chứa
    dòng đánh máy ở `ProductHero` mang `min-h-12 lg:min-h-16 xl:min-h-20` NHƯNG
    cũng mang `contents`, nên bên site gốc mấy lớp đó không có tác dụng gì và
    dòng chữ cao đúng một dòng `heading-1` (35px). Bản clone đặt chúng lên một
    hộp thật → 48px, hero dài hơn bản gốc 13px ở mọi bề rộng dưới `lg` trên
    `/products` và `/services`. Đã dựng lại đúng cấu trúc của theme: một `<div>`
    bọc chung dòng TypeIt (`contents`) và `<h1>` tĩnh.

53. **Khoảng cách giữa các slide `.flow-track` là MARGIN, không phải padding.**
    Swiper cài `spaceBetween: 30` bằng `margin-right`, bề rộng slide vẫn đúng
    bằng bề rộng khung. Bản clone dùng `pr-[30px]`, nên phần nội dung hụt 30px
    và cột ảnh `aspect-[540/420]` co từ 540 xuống 530 — `.flow-track` thấp đi
    8px trên About, `/services`, `/contact-us` và 4 trang service. Đổi sang
    `mr-[30px]` thì phải cộng thêm 30px vào mỗi nấc `translate3d`, nếu không
    track trượt thiếu dần.

54. **`next/image` với `fill` không đóng góp vào max-content.** Cột phải của
    `.vertical-tab` (`/services`) không có lớp bề rộng nào: bên site gốc `<img>`
    thường đẩy nó ra tới trần `max-w-[800px]` của khối bên trong. Ở đây ảnh là
    `fill` (position: absolute) nên cột co theo dòng chữ dài nhất — 684px thay
    vì 800 ở 1512, ảnh 800/376 thấp theo, section hụt 55px. Bù bằng
    `lg:w-full lg:max-w-[800px]` trên chính cột đó (chỉ từ `lg`: dưới mốc đó
    hàng xếp dọc và cột vốn đã rộng hết phần còn lại).

55. **Nút "Download A Sourcing Guide" ở hero-CTA trang chủ giờ tải PDF thật.**
    Bên site gốc nó là `<button id="downloadBtn">` dựng tạm một `<a download>`
    rồi tự bấm — cùng file, cùng hành vi với `#downloadBtnCta` của `/resources`.
    Bản clone render nó thành `<a href="/sourcing-guide">`, một địa chỉ không có
    trang, nên proxy đá về trang chủ. Đường dẫn file và hàm tải giờ nằm chung ở
    `src/lib/sourcingGuide.ts` + `components/ui/DownloadButton.tsx`, dùng cho cả
    hai chỗ; `homeView` nhận ra href giữ chỗ `/sourcing-guide` và trả `fileUrl`
    thật. `/sourcing-guide` vẫn là href dự phòng khi env chưa trỏ tới file nào.

56. **Video nền hero trang chủ chỉ dựng từ `lg` trở lên.** Theo yêu cầu. Dưới
    1024px trình duyệt di động chặn autoplay, Vimeo lùi về giao diện player đầy
    đủ — nút play to và THANH ĐIỀU KHIỂN/CÀI ĐẶT dưới đáy hero — mà
    `background=1&controls=0` không cứu được, vì tham số đó chỉ có tác dụng khi
    video thật sự tự chạy. Poster là đúng khung hình đầu của video nên hero
    trông không khác gì, và đỡ vài MB trên 4G. Phải KHÔNG DỰNG (`useMediaQuery`)
    chứ không phải `hidden lg:block`: iframe bị ẩn vẫn tải và vẫn phát.

57. **Hai chênh lệch còn lại là CỐ Ý hoặc do nội dung, không phải lỗi bố cục.**
    Sau khi sửa 50-54, ở 1280 và 1512 mọi trang đều "0 khối lệch" so với bản
    gốc. Phần còn lại:

    • **Trang chủ, `.usp-slider` (-2.4k đến -2.6k px ở ≥1280).** Bản gốc ghim
      section bằng GSAP và sinh `pin-spacer` cao 3370-3535px; bản clone đã bỏ
      ghim theo yêu cầu của chủ site (xem deviation 1), nên tài liệu ngắn đúng
      chừng ấy. Đã thêm lại `lg:min-h-screen` mà theme khai trên section này —
      thiếu nó thì ngay ở 1024px (nơi bản gốc CHƯA ghim) section vẫn hụt 180px.

    • **Timeline `/process` (-160px) và `/about` (-120px) dưới 1024px.** Markup
      Twig của theme để LẠC một dấu xuống dòng ngay đầu mỗi `<div
      whitespace-pre-line>` thân bước, và `pre-line` render nó thành một DÒNG
      TRỐNG — đúng 20px mỗi panel, 8 panel ở `/process`, 6 ở About. Từ `lg` trở
      lên panel bị ép về `panelH` nên không ai thấy. **Cố ý không chép lại**:
      đó là tai nạn khoảng trắng của bản gốc, chép lại nghĩa là cố tình chèn một
      dòng trống vào DOM. Phần structural thì ĐÃ khớp: theme luôn dựng `<span>`
      nhãn bước kể cả khi trống (About), và bỏ nó đi làm panel mất một nấc
      `gap-3` = 12px mỗi panel.

    • **`.resource-card` trang chủ (+28 đến +56px) và `.casestudy-slider` trang
      case study (-21 đến -58px).** Khác NỘI DUNG: excerpt của bài blog dài
      ngắn khác nhau, và slider "Explore more" của hai bên đang chọn những case
      study khác nhau. Không có lớp nào lệch.

    • **Footer (-9px ở hầu hết bề rộng, -33px ở 1280).** Form đăng ký nhận tin
      của bản gốc là embed HubSpot cao 130px; bản clone dựng tay, cao 97px —
      deviation 2. Không phải vấn đề responsive.

    Đo bằng script Puppeteer so bản gốc với bản clone theo từng section ở
    320/360/390/414/768/1024/1280/1512. **Không trang nào tràn ngang ở bất kỳ
    bề rộng nào** (`scrollWidth === clientWidth` từ 320px trở lên).

## Customization Plans
None yet — pure emulation. Content lives in `src/data/site.ts`, so copy changes are one-file edits.
