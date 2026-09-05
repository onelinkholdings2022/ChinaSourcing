import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MissionVideoViewData } from "@/lib/views/homeView";

/**
 * The five stacked chevrons above the closing CTA. Each is a little wider and
 * taller than the one above it, stroked with the same pale-to-brand-blue
 * gradient, and they bob in sequence via `animate-pulse-arrow` + a 100ms
 * stagger — lifted straight from the original's markup.
 */
const CHEVRONS = [
  { w: 36, h: 18, stroke: 1.33333, d: "M1 1L17.411 16.1487C17.9292 16.6269 18.7301 16.6191 19.2388 16.1308L35 1" },
  { w: 40, h: 20, stroke: 1.5, d: "M0.875 1L19.3374 18.0422C19.9203 18.5803 20.8214 18.5715 21.3936 18.0221L39.125 1" },
  { w: 46, h: 22, stroke: 1.66667, d: "M1.75 1L22.2638 19.9358C22.9115 20.5337 23.9126 20.5239 24.5485 19.9135L44.25 1" },
  { w: 54, h: 26, stroke: 2, d: "M1.5 1L26.1166 23.723C26.8938 24.4404 28.0952 24.4286 28.8582 23.6961L52.5 1" },
  { w: 58, h: 29, stroke: 2.16667, d: "M1.375 2L28.0429 26.6166C28.8849 27.3938 30.1864 27.381 31.013 26.5875L56.625 2" },
];

const DELAYS = [
  "",
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
];

function ChevronStack() {
  return (
    <div className="flex flex-col justify-center gap-4 items-center">
      {CHEVRONS.map((c, i) => (
        <svg
          key={i}
          width={c.w}
          height={c.h}
          viewBox={`0 0 ${c.w} ${c.h}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className={cn("animate-pulse-arrow", DELAYS[i])}
        >
          <path
            d={c.d}
            stroke={`url(#pulse-arrow-${i})`}
            strokeWidth={c.stroke}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id={`pulse-arrow-${i}`}
              x1={c.w / 2}
              y1="2"
              x2={c.w / 2}
              y2={c.h * 1.2}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D1F0FF" />
              <stop offset="1" stopColor="#36A9E1" />
            </linearGradient>
          </defs>
        </svg>
      ))}
    </div>
  );
}

export function ClosingCta({ missionVideo }: { missionVideo: MissionVideoViewData }) {
  return (
    <section className="container lg:py-16 py-10">
      <ChevronStack />

      <div className="space-y-6 mt-16 flex flex-col justify-center items-center">
        <h2 className="heading-2 text-center text-dark-blue-950 font-medium max-w-[1076px]">
          {missionVideo.headingBefore}{" "}
          <span className="text-cyan-400">{missionVideo.headingHighlight}</span>{" "}
          {missionVideo.headingAfter}
        </h2>
        <p className="max-w-[792px] text-center font-medium text-lg text-grey-600">
          {missionVideo.subtitle}
        </p>
        <div className="flex justify-center items-center gap-4 sm:flex-row flex-col w-full">
          <Button href={missionVideo.primaryButton.href} withArrow className="sm:w-fit w-full">
            {missionVideo.primaryButton.label}
          </Button>
          <Button href={missionVideo.secondaryButton.href} variant="white" className="sm:w-fit w-full">
            {missionVideo.secondaryButton.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
