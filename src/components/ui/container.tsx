import { cn } from "@/lib/utils";

/** Centered max-width content wrapper used across the site. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
