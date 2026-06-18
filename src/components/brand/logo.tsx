import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Blue Fox wordmark + geometric fox mark.
 * Placeholder until the official logo asset is supplied — colours come
 * from the brand CSS variables, so it already matches the theme.
 */
export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${site.name} home`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft ring-1 ring-primary/30">
        <FoxMark className="h-5 w-5" />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Blue<span className="text-primary">Fox</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-2">
            Dubai
          </span>
        </span>
      )}
    </Link>
  );
}

function FoxMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* stylised fox head: two ears + snout */}
      <path
        d="M3 3.5 5.5 9 12 6.5 18.5 9 21 3.5l-1.5 8.2A8 8 0 0 1 12 21a8 8 0 0 1-7.5-9.3L3 3.5Z"
        fill="var(--color-primary)"
      />
      <path
        d="M12 21a8 8 0 0 0 7.5-9.3L18.5 9 12 11.5 5.5 9l-1 2.7A8 8 0 0 0 12 21Z"
        fill="var(--color-accent)"
        fillOpacity="0.85"
      />
      <circle cx="9" cy="12" r="1" fill="#06121f" />
      <circle cx="15" cy="12" r="1" fill="#06121f" />
    </svg>
  );
}
