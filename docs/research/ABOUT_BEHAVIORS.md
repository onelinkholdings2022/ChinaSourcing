# `/about-us` — behaviour bible

Everything below was read off the live site: markup from the logged-out HTML, CSS
from the LiteSpeed-combined stylesheet, and the JS straight out of the theme
bundle (`main-o3q4ZZaz.js`). Nothing here is estimated.

## Libraries actually running on this page

Checked at runtime — all of them are bundled, so none appear on `window`:

| Library | Evidence | Used by |
| --- | --- | --- |
| GSAP + ScrollTrigger | 1 `.pin-spacer` in the DOM | Journey timeline only |
| Splide | 2 initialised roots | logo marquee, team slider |
| Swiper | 2 initialised roots | case studies, flow-track |
| AOS | 54 `[data-aos]`, all `.aos-init` | every section |
| lozad | `data-src` on every `<img>` | all imagery |

There is **no smooth-scroll library** — no `.lenis`, no Locomotive. Scrolling is
native, and the clone must leave it native or the feel changes.

## Section 2 — Journey timeline (the only pinned section)

Verbatim from the bundle (`Zb` + `e1`, symbols renamed):

```js
const panelH = window.innerHeight - 120 - headline.offsetHeight;
if (innerWidth > 1024) content.style.height = panelH + "px";
setTimeout(() => init(panelH), 1000);          // note: a full second

// init()
const scrollDist = panels.length * panelH - panelH;
if (innerWidth > 1024) modifyHeightEls.forEach(el => el.style.height = panelH + "px");

const tl = gsap.timeline({ scrollTrigger: {
  trigger: "#timeline-scroll",
  start: "top-=70 top",
  end: innerWidth > 1024 ? `+=${scrollDist}` : `+=${sumOfPanelHeights}`,
  scrub: true,
  pin: innerWidth > 1024 ? "#timeline-scroll-container" : false,
}});

tl.fromTo(shipImg, { y: -shipH * 0.75 }, { y: shipH * 0.75, ease: "none" });
tl.to(panelsEl, { y: `+=${-scrollDist}`, ease: "none" }, 0);
gsap.set(panelsWrapper, { height: panelH * panels.length });

panels.forEach((panel, i) => ScrollTrigger.create({
  trigger: panel,
  start: () => "top+=50 center",
  end:   () => "bottom center",
  toggleClass: { targets: trackItems[i], className: "active" },
  onEnter:     () => setActive(i),
  onEnterBack: () => setActive(i),
}));
```

Active-marker CSS:

```css
.timeline-track-item.active .timeline-track-dot     { background: #fff }
.timeline-track-item.active .timeline-track-heading { color: #fff; transform: translateX(4px) }
```

Below 1024px there is **no pin and no ScrollTrigger** — the panels stack and the
ship simply travels the full stack height. The left year rail is `lg:block hidden`,
so mobile never shows it.

## Section 4 — logo marquee (Splide)

```js
new Splide(".splide.marquee-logos", {
  type: "loop", drag: false, autoWidth: true, pagination: false, arrows: false,
  autoScroll: { speed: 0.5 }, gap: 120,
  breakpoints: { 1280: { gap: 24 } },
}).mount({ AutoScroll });
```

Two `onelink_white_overlay.png` fades sit at `z-[2]`, `w-10 h-full`, `opacity-70`
— left one is `rotate-180`. 7 logos, `size-[100px] object-cover`.

## Section 7 — team slider (Splide, the signature effect)

```js
new Splide("#team-slider", {
  type: "loop", perPage: 1, focus: "center", gap: "1rem",
  autoWidth: true, autoHeight: true, updateOnMove: true,
  pagination: false, arrows: false,
  autoplay: true, interval: 6000, speed: 500,
  pauseOnHover: true, pauseOnFocus: true,
});
```

The width change is pure CSS, not JS:

```css
#team-slider .splide__slide            { width: 200px; height: 300px; transition: width .5s ease }
#team-slider .splide__slide.is-active  { width: 700px; height: 525px }
#team-slider .splide__list             { align-items: center; will-change: transform }
#team-slider .splide__slide .splide-image img           { filter: grayscale(12) }  /* clamps to 1 */
#team-slider .splide__slide.is-active .splide-image img { filter: grayscale(0) }
#team-slider .splide__slide .expanded-card            { width: 0%;  transition: transform .5s ease }
#team-slider .splide__slide.is-active .expanded-card  { width: 50% }
#team-slider .with-transition { transition: transform .15s ease }

@media (max-width: 1023px) {
  #team-slider .splide__slide,
  #team-slider .splide__slide.is-active { width: 300px; height: auto }
  #team-slider .splide__slide .expanded-card,
  #team-slider .splide__slide.is-active .expanded-card { width: 100% }
}
```

Clicking a non-active card walks the **shortest way round the loop**, not the
naive index difference:

```js
let delta = targetIndex - currentSlideIndex;
if (delta >  len / 2) delta -= len;
if (delta < -len / 2) delta += len;
splide.go(splide.index + delta);
```

On every `moved`, the list gets `.with-transition` for 800ms and `refresh()` runs.

## Section 9 — case-study slider (Swiper)

```js
new Swiper(".case-study-swiper", {
  slidesPerView: 1, effect: "slide", speed: 1000, spaceBetween: 24,
  breakpoints: { 768: { slidesPerView: 1.5 }, 1280: { slidesPerView: 2 } },
  navigation: { nextEl: ".swiper-button-next-custom", prevEl: ".swiper-button-prev-custom" },
});
```

Arrows carry `disabled:grayscale disabled:cursor-default disabled:opacity-60`
and are `disabled` at the respective ends.

Card hover: `bg-cyan-50 → bg-dark-blue-950`, text → white, `duration-300`.

## Section 10 — flow-track tabs (Swiper, **not** the pinned variant)

The bundle contains a *second*, GSAP-pinned flow-track implementation that hunts
for `.flow-track-wrapper` / `.tab-label` / `.tab-content`. **None of those exist
on this page** — verified at runtime: `flowTrackWrapper: false`,
`flowContainerTabContent: 0`, `flowTabLabel: 0`. Only one pin-spacer exists on
the page and it belongs to the timeline. So this section is the Swiper variant:

```js
const sw = new Swiper(".mySwiper", {
  allowTouchMove: false, slidesPerView: 1, spaceBetween: 30,
  effect: "slide", init: false,
});
sw.on("slideChange", () => {
  syncArrows();
  labels.forEach((l, i) => i === sw.realIndex ? (l.classList.add("active"), centre(l))
                                              : l.classList.remove("active"));
});
sw.init();
labels.forEach((l, i) => l.onclick = () => sw.slideTo(i));
nextTabBtns.forEach((b, i) => b.onclick = () => sw.slideTo(i + 1));

// the active label slides itself to the centre of the scroller
const centre = (label) => {
  const bar = document.querySelector(".bar-labels");
  const left = bar.scrollLeft + (label.getBoundingClientRect().left - bar.getBoundingClientRect().left)
             - bar.getBoundingClientRect().width / 2 + label.getBoundingClientRect().width / 2;
  gsap.to(bar, { scrollLeft: left, duration: 0.5, ease: "power2.out" });
};
```

Arrow disabled styling is applied by class, not the `disabled` attribute:
`opacity-60 pointer-events-none grayscale`.

Tab colours:

```css
.flow-track-tab-label        .tab-btn            { color: #e5e5e5 }
.flow-track-tab-label.active .tab-btn            { color: #040c19 }
.flow-track-tab-label        .flow-tract-tab-dot { background-color: #e5e5e5 }
.flow-track-tab-label.active .flow-tract-tab-dot { background-color: #040c19 }
```

Note the theme's own typo — `flow-tract-tab-dot` — kept as-is so the CSS matches.

## AOS, everywhere

`data-aos="fade-up"`, `duration=500`, `once=true`, `offset=-50`, with
`delay` stepping 100 / 150 / 200 / 250 down a section. The project's
`<Reveal>` already reproduces this; `delay` is passed in milliseconds.

## Responsive

| Section | ≥1024px | <1024px |
| --- | --- | --- |
| Hero | 2-col, image right | stacked, `gap-[60px]` |
| Timeline | pinned, year rail visible | stacked panels, rail hidden, no pin |
| Core values | 3-col | 2-col at `md`, 1-col below |
| USP list | list left / image right | image first (`flex-col-reverse`) |
| Team | 200×300 cards, active 700×525 | every card 300px wide, `h-auto` |
| Case studies | 2 per view (1.5 at 768) | 1 per view |
| Flow-track | tabs centred, `gap-[204px]` | tabs left-aligned, `gap-2`, horizontal scroll |
