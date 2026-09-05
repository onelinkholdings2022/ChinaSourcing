import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/components/icons";

type Variant = "primary" | "outline" | "white";

const base =
  "inline-flex gap-2 items-center justify-center md:px-6 md:py-3 py-4 px-4 rounded-lg font-semibold duration-300 group cursor-pointer";

const variants: Record<Variant, string> = {
  // Solid brand blue — the header CTA and "Request A Free Quote"
  primary:
    "bg-cyan-400 text-white hover:bg-cyan-400/80 border border-cyan-400",
  // White fill with indigo outline — "See All Case Studies", "Read More"
  white:
    "bg-white text-dark-blue-900 hover:bg-dark-blue-50 border border-dark-blue-900",
  // Transparent with indigo outline — the card-level "Get A Free Quote"
  outline:
    "border border-dark-blue-950 text-dark-blue-950 bg-transparent hover:bg-dark-blue-50",
};

type ButtonProps = {
  variant?: Variant;
  withArrow?: boolean;
  children: ReactNode;
  className?: string;
  href?: string;
} & Omit<ComponentProps<"button">, "ref">;

export function Button({
  variant = "primary",
  withArrow = false,
  children,
  className,
  href,
  ...props
}: ButtonProps) {
  const content = (
    <>
      {children}
      {withArrow && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRightIcon className="w-5 h-5" />
        </span>
      )}
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

/** The pill label that sits above every section heading. */
export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-fit text-cyan-400 body-3 font-medium bg-gradient-tag border border-cyan-400 py-1 px-6 leading-7 rounded-[40px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
