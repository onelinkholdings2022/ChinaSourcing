import { cn } from "@/lib/utils";

/**
 * Renders a migrated page body.
 *
 * The markup comes straight from the source site and already carries its own
 * Tailwind classes (Tailwind scans the JSON via the `@source` rule in
 * globals.css), so section layouts need no extra styling. `prose` is only
 * applied for editor-authored bodies — blog posts and resources — where the
 * markup is plain <p>/<h2>/<ul> with no classes of its own.
 */
export function WpContent({
  html,
  prose = false,
  className,
}: {
  html: string;
  prose?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(prose && "wp-prose", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
