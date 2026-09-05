import type { SVGProps } from "react";

/** Long arrow used inside buttons — inherits currentColor so it recolors on hover. */
export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 12H20M20 12L14 6M20 12L14 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small chevron for the horizontally scrollable tab rail. */
export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="9"
      height="14"
      viewBox="0 0 9 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.5 13L7.5 7L1.5 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Chevron used by the footer's "See more" links and location accordions. */
export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Diagonal "opens in a new tab" arrow next to the footer's social links. */
export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.0156 18.2676L18.2652 10.018"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0156 10.0176H18.2652V18.2672"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Map pin in front of a footer office address. */
export function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.6693 8.33366C16.6693 12.4945 12.0534 16.8278 10.5034 18.1662C10.359 18.2747 10.1833 18.3335 10.0026 18.3335C9.82194 18.3335 9.64617 18.2747 9.50177 18.1662C7.95177 16.8278 3.33594 12.4945 3.33594 8.33366C3.33594 6.56555 4.03832 4.86986 5.28856 3.61961C6.5388 2.36937 8.23449 1.66699 10.0026 1.66699C11.7707 1.66699 13.4664 2.36937 14.7166 3.61961C15.9669 4.86986 16.6693 6.56555 16.6693 8.33366Z"
        stroke="#525252"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10.833C11.3807 10.833 12.5 9.71372 12.5 8.33301C12.5 6.9523 11.3807 5.83301 10 5.83301C8.61929 5.83301 7.5 6.9523 7.5 8.33301C7.5 9.71372 8.61929 10.833 10 10.833Z"
        stroke="#525252"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Envelope in front of a footer office email. */
export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.6641 3.33301H3.33073C2.41025 3.33301 1.66406 4.0792 1.66406 4.99967V14.9997C1.66406 15.9201 2.41025 16.6663 3.33073 16.6663H16.6641C17.5845 16.6663 18.3307 15.9201 18.3307 14.9997V4.99967C18.3307 4.0792 17.5845 3.33301 16.6641 3.33301Z"
        stroke="#525252"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3307 5.83301L10.8557 10.583C10.5985 10.7442 10.301 10.8297 9.9974 10.8297C9.6938 10.8297 9.39634 10.7442 9.13906 10.583L1.66406 5.83301"
        stroke="#525252"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Circular outlined next/prev button used by the sliders. */
export function CircleArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="0.5"
        y="47.5874"
        width="47"
        height="47"
        rx="23.5"
        transform="rotate(-90 0.5 47.5874)"
        fill="white"
      />
      <rect
        x="0.5"
        y="47.5874"
        width="47"
        height="47"
        rx="23.5"
        transform="rotate(-90 0.5 47.5874)"
        stroke="#2E3590"
      />
      <path
        d="M21 30.0874L27 24.0874L21 18.0874"
        stroke="#2E3590"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2V6" />
        <path d="M16 2V6" />
        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" />
        <path d="M3 10H21" />
      </g>
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
        <path d="M12 6V12L16 14" />
      </g>
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 6H21" />
        <path d="M3 12H21" />
        <path d="M3 18H21" />
      </g>
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 6L18 18" />
        <path d="M18 6L6 18" />
      </g>
    </svg>
  );
}

/** Plus/minus toggle for FAQ rows. */
export function PlusMinusIcon({
  open,
  ...props
}: SVGProps<SVGSVGElement> & { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 4V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={`origin-center transition-transform duration-300 ${
          open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        }`}
      />
    </svg>
  );
}
